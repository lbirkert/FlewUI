import { json } from "@sveltejs/kit";
import { writeFile, appendFile, rename, mkdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { randomBytes } from "node:crypto";
import { addFile, getFiles, isImage, getDriveContext, isFolderInSharedFolder } from "$lib/server/db";
import { generateDocumentPreview, isDocumentType } from "$lib/server/preview";
import type { RequestHandler } from "./$types";

const UPLOAD_DIR = join(process.cwd(), "uploads");

export const GET: RequestHandler = async ({ url, locals, params }) => {
  const ctx = await getDriveContext(params.driveId, locals);
  if (!ctx) return json({ error: "Drive not found" }, { status: 404 });

  let folderId = url.searchParams.get("folderId");

  if (ctx.type === "share" && ctx.share?.folderId) {
    if (folderId && !(await isFolderInSharedFolder(folderId, ctx.share.folderId))) {
      return json({ error: "Folder not in shared drive" }, { status: 403 });
    }
    if (!folderId) folderId = ctx.share.folderId;
  }

  const files = await getFiles(ctx.userId, folderId || null);
  return json({ files });
};

export const POST: RequestHandler = async ({ request, locals, params, url }) => {
  const ctx = await getDriveContext(params.driveId, locals, "insert");
  if (!ctx) return json({ error: "Drive not found or upload not permitted" }, { status: 404 });
  if (ctx.type === "share" && !ctx.share?.folderId) {
    return json({ error: "Can only upload to shared folders" }, { status: 400 });
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  await mkdir(join(UPLOAD_DIR, "previews"), { recursive: true });

  const formData = await request.formData();
  const uploaded = formData.getAll("files") as File[];
  const folderId = formData.get("folderId") as string | null;
  const chunkIndex = formData.get("chunkIndex") as string | null;
  const totalChunks = formData.get("totalChunks") as string | null;

  const resolvedFolderId = ctx.type === "share" && ctx.share?.folderId ? (folderId || ctx.share.folderId) : folderId;

  // Chunked upload
  if (chunkIndex !== null && totalChunks !== null) {
    const idx = parseInt(chunkIndex);
    const total = parseInt(totalChunks);
    const file = uploaded[0];
    const originalName = formData.get("originalName") as string || "file";
    const fileType = formData.get("fileType") as string || "application/octet-stream";

    if (ctx.type === "share" && ctx.share?.folderId) {
      const targetFolder = folderId || ctx.share.folderId;
      if (resolvedFolderId && !(await isFolderInSharedFolder(resolvedFolderId, ctx.share.folderId))) {
        return json({ error: "Folder not in shared drive" }, { status: 403 });
      }
    }

    const ext = originalName.split(".").pop() ?? "";
    const newStoredName = `${randomBytes(16).toString("hex")}.${ext}`;

    async function createRecord(stored: string, finalPath: string) {
      const { size } = await stat(finalPath);
      const img = isImage(fileType);
      let hasPreview = false;
      if (img) {
        try {
          const sharp = (await import("sharp")).default;
          await sharp(finalPath)
            .resize(800, 800, { fit: "inside", withoutEnlargement: true })
            .webp({ quality: 60 })
            .toFile(join(UPLOAD_DIR, "previews", `${stored}.webp`));
          hasPreview = true;
        } catch { /* preview failed */ }
      } else if (isDocumentType(fileType, originalName)) {
        hasPreview = await generateDocumentPreview(stored, originalName, fileType);
      }
      const record = await addFile(ctx.userId, stored, originalName, size, fileType, resolvedFolderId, hasPreview);
      return { id: record.id, originalName: record.originalName, size: record.size, type: record.type, hasPreview };
    }

    if (idx === 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      if (total === 1) {
        const finalPath = join(UPLOAD_DIR, newStoredName);
        await writeFile(finalPath, buffer);
        const result = await createRecord(newStoredName, finalPath);
        return json({ uploaded: 1, files: [result] });
      }
      const tempPath = join(UPLOAD_DIR, `${newStoredName}.part`);
      await writeFile(tempPath, buffer);
      return json({ chunk: idx, totalChunks: total, storedName: newStoredName });
    }

    const storedName = formData.get("storedName") as string;
    if (!storedName) return json({ error: "Missing storedName for chunk" }, { status: 400 });

    const tempPath = join(UPLOAD_DIR, `${storedName}.part`);
    const buffer = Buffer.from(await file.arrayBuffer());
    await appendFile(tempPath, buffer);

    if (idx === total - 1) {
      const finalPath = join(UPLOAD_DIR, storedName);
      await rename(tempPath, finalPath);
      const result = await createRecord(storedName, finalPath);
      return json({ uploaded: 1, files: [result] });
    }

    return json({ chunk: idx, totalChunks: total, storedName });
  }

  // Non-chunked upload
  if (ctx.type === "share" && ctx.share?.folderId) {
    const targetFolder = folderId || ctx.share.folderId;
    if (!(await isFolderInSharedFolder(targetFolder, ctx.share.folderId))) {
      return json({ error: "Folder not in shared drive" }, { status: 403 });
    }
  }

  const files: { id: string; originalName: string; size: number; type: string; hasPreview: boolean }[] = [];

  for (const file of uploaded) {
    if (file.size > 100 * 1024 * 1024) continue;
    const ext = file.name.split(".").pop() ?? "";
    const storedName = `${randomBytes(16).toString("hex")}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(join(UPLOAD_DIR, storedName), buffer);

    const img = isImage(file.type);
    let hasPreview = false;

    if (img) {
      try {
        const sharp = (await import("sharp")).default;
        await sharp(buffer)
          .resize(800, 800, { fit: "inside", withoutEnlargement: true })
          .webp({ quality: 60 })
          .toFile(join(UPLOAD_DIR, "previews", `${storedName}.webp`));
        hasPreview = true;
      } catch { /* preview failed */ }
    } else if (isDocumentType(file.type, file.name)) {
      hasPreview = await generateDocumentPreview(storedName, file.name, file.type);
    }

    const record = await addFile(ctx.userId, storedName, file.name, file.size, file.type, resolvedFolderId, hasPreview);
    files.push({ id: record.id, originalName: record.originalName, size: record.size, type: record.type, hasPreview });
  }

  return json({ uploaded: files.length, files });
};
