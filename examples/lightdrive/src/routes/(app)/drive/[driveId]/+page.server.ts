import { getRootFolders, getSubFolders, getFolder, getFiles, getFolderTreeSizes } from "$lib/server/db";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, depends, url, params }) => {
  depends("app:drive");
  const user = locals.user ?? null;
  const driveId = params.driveId;

  if (user && driveId === user.id) {
    const folderId = url.searchParams.get("folder") || null;
    const folders = folderId
      ? await getSubFolders(folderId)
      : await getRootFolders(user.id);
    const files = await getFiles(user.id, folderId);
    const folderSizes = await getFolderTreeSizes(user.id);

    const breadcrumbs: { id: string | null; name: string }[] = [{ id: null, name: "My Drive" }];
    if (folderId) {
      let current = await getFolder(folderId);
      const chain: { id: string; name: string }[] = [];
      while (current) {
        chain.unshift({ id: current.id, name: current.name });
        current = current.parentId ? await getFolder(current.parentId) : null;
      }
      breadcrumbs.push(...chain);
    }

    return { user, driveId, folders, files, breadcrumbs, folderSizes, isShared: false };
  }

  return { user, driveId, isShared: true };
};
