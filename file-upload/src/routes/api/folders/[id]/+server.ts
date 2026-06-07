import { json } from "@sveltejs/kit";
import { getFolder, deleteFolder } from "$lib/server/db";
import type { RequestHandler } from "./$types";

export const DELETE: RequestHandler = async ({ params, locals }) => {
  if (!locals.user) return json({ error: "Not authenticated" }, { status: 401 });

  const folder = await getFolder(params.id);
  if (!folder || folder.userId !== locals.user.id) {
    return json({ error: "Folder not found" }, { status: 404 });
  }

  await deleteFolder(params.id);
  return json({ deleted: params.id });
};
