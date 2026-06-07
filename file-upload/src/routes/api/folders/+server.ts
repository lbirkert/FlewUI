import { json } from "@sveltejs/kit";
import { createFolder, getRootFolders, getSubFolders, getAllFolders } from "$lib/server/db";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url, locals }) => {
  if (!locals.user) return json({ error: "Not authenticated" }, { status: 401 });

  const all = url.searchParams.get("all");
  if (all === "true") {
    const folders = await getAllFolders(locals.user.id);
    return json({ folders });
  }

  const parentId = url.searchParams.get("parentId");
  const folders = parentId
    ? await getSubFolders(parentId)
    : await getRootFolders(locals.user.id);

  return json({ folders });
};

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) return json({ error: "Not authenticated" }, { status: 401 });

  const { name, parentId } = await request.json();
  if (!name || typeof name !== "string" || !name.trim()) {
    return json({ error: "Folder name is required" }, { status: 400 });
  }

  const folder = await createFolder(name.trim(), locals.user.id, parentId);
  return json({ folder }, { status: 201 });
};
