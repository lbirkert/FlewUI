import { json } from "@sveltejs/kit";
import { unlink } from "node:fs/promises";
import { join } from "node:path";
import { getFile, getFolder, deleteFileRecord, moveFile } from "$lib/server/db";
import type { RequestHandler } from "./$types";

const UPLOAD_DIR = join(process.cwd(), "uploads");

export const PATCH: RequestHandler = async ({ request, params, locals }) => {
  if (!locals.user) return json({ error: "Not authenticated" }, { status: 401 });

  const file = await getFile(params.id);
  if (!file || file.userId !== locals.user.id) return json({ error: "File not found" }, { status: 404 });

  const { folderId } = await request.json();
  if (folderId) {
    const folder = await getFolder(folderId);
    if (!folder || folder.userId !== locals.user.id) {
      return json({ error: "Folder not found" }, { status: 404 });
    }
  }

  await moveFile(params.id, folderId ?? null);
  return json({ moved: params.id, folderId: folderId ?? null });
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
  if (!locals.user) return json({ error: "Not authenticated" }, { status: 401 });

  const file = await getFile(params.id);
  if (!file || file.userId !== locals.user.id) return json({ error: "File not found" }, { status: 404 });

  await deleteFileRecord(params.id);
  try { await unlink(join(UPLOAD_DIR, file.storedName)); } catch {}

  return json({ deleted: params.id });
};
