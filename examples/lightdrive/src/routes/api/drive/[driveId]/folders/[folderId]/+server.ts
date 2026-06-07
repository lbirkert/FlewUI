import { json } from "@sveltejs/kit";
import { unlink } from "node:fs/promises";
import { join } from "node:path";
import { getDriveContext, getFolder, deleteFolder } from "$lib/server/db";
import type { RequestHandler } from "./$types";

const UPLOAD_DIR = join(process.cwd(), "uploads");

export const DELETE: RequestHandler = async ({ params, locals }) => {
  const ctx = await getDriveContext(params.driveId, locals);
  if (!ctx) return json({ error: "Drive not found" }, { status: 404 });

  if (ctx.type === "share") return json({ error: "Delete folder not available in shared drives" }, { status: 403 });

  const folder = await getFolder(params.folderId);
  if (!folder || folder.userId !== ctx.userId) {
    return json({ error: "Folder not found" }, { status: 404 });
  }

  const result = await deleteFolder(params.folderId);

  for (const storedName of result.deletedFiles) {
    try { await unlink(join(UPLOAD_DIR, storedName)); } catch {}
    try { await unlink(join(UPLOAD_DIR, "previews", `${storedName}.webp`)); } catch {}
  }

  return json({ deleted: params.folderId, cleanedFiles: result.deletedFiles.length });
};
