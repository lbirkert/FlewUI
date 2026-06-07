import { json } from "@sveltejs/kit";
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { randomBytes } from "node:crypto";
import { addFile, getFiles, isImage } from "$lib/server/db";
import { generateDocumentPreview, isDocumentType } from "$lib/server/preview";
import type { RequestHandler } from "./$types";

const UPLOAD_DIR = join(process.cwd(), "uploads");

export const GET: RequestHandler = async ({ url, locals }) => {
  if (!locals.user) return json({ error: "Not authenticated" }, { status: 401 });

  const folderId = url.searchParams.get("folderId");
  const files = await getFiles(locals.user.id, folderId);
  return json({ files });
};

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) return json({ error: "Not authenticated" }, { status: 401 });

  await mkdir(UPLOAD_DIR, { recursive: true });
  await mkdir(join(UPLOAD_DIR, "previews"), { recursive: true });

  const formData = await request.formData();
  const uploaded = formData.getAll("files") as File[];
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
      } catch {
        // Preview generation failed, proceed without
      }
    } else if (isDocumentType(file.type, file.name)) {
      hasPreview = await generateDocumentPreview(storedName, file.name, file.type);
    }

    const folderId = formData.get("folderId") as string | null;
    const record = await addFile(locals.user.id, storedName, file.name, file.size, file.type, folderId, hasPreview);
    files.push({ id: record.id, originalName: record.originalName, size: record.size, type: record.type, hasPreview });
  }

  return json({ uploaded: files.length, files });
};
