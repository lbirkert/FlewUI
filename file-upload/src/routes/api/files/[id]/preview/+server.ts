import { error } from "@sveltejs/kit";
import { join } from "node:path";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { getFile } from "$lib/server/db";
import type { RequestHandler } from "./$types";

const UPLOAD_DIR = join(process.cwd(), "uploads");

export const GET: RequestHandler = async ({ params, locals }) => {
  if (!locals.user) error(401, "Not authenticated");

  const file = await getFile(params.id);
  if (!file || file.userId !== locals.user.id) error(404, "Not found");

  const previewPath = join(UPLOAD_DIR, "previews", `${file.storedName}.webp`);
  if (!existsSync(previewPath)) error(404, "Preview not found");

  const buffer = await readFile(previewPath);
  return new Response(buffer, {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
