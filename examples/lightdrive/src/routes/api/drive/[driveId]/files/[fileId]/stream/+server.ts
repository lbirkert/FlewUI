import { error } from "@sveltejs/kit";
import { createReadStream } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { getFile, getDriveContext, isFileInSharedFolder } from "$lib/server/db";
import type { RequestHandler } from "./$types";

const UPLOAD_DIR = join(process.cwd(), "uploads");

export const GET: RequestHandler = async ({ params, request, locals }) => {
  const ctx = await getDriveContext(params.driveId, locals);
  if (!ctx) error(404, "Drive not found");

  const record = await getFile(params.fileId);
  if (!record) error(404, "File not found");

  if (ctx.type === "share") {
    if (ctx.share?.fileId) {
      if (params.fileId !== ctx.share.fileId) error(403, "File is not in the shared drive");
    } else if (ctx.share?.folderId) {
      const allowed = await isFileInSharedFolder(params.fileId, ctx.share.folderId);
      if (!allowed) error(403, "File is not in the shared drive");
    } else {
      error(400, "Invalid share configuration");
    }
  } else if (record.userId !== ctx.userId) {
    error(404, "File not found");
  }

  const filePath = record.transcodedName
    ? join(UPLOAD_DIR, "transcoded", record.transcodedName)
    : join(UPLOAD_DIR, record.storedName);

  try {
    const fileStat = await stat(filePath);
    const fileSize = fileStat.size;
    const rangeHeader = request.headers.get("range");

    if (rangeHeader) {
      const match = rangeHeader.match(/bytes=(\d+)-(\d*)/);
      if (!match) error(416, "Range Not Satisfiable");

      const start = parseInt(match[1], 10);
      const end = match[2] ? parseInt(match[2], 10) : fileSize - 1;

      if (start >= fileSize || end >= fileSize) {
        return new Response(null, {
          status: 416,
          headers: { "Content-Range": `bytes */${fileSize}` },
        });
      }

      const chunkSize = end - start + 1;
      const stream = createReadStream(filePath, { start, end });

      return new Response(stream as unknown as ReadableStream, {
        status: 206,
        headers: {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Type": "video/webm",
          "Content-Length": String(chunkSize),
        },
      });
    }

    const buffer = await readFile(filePath);
    return new Response(buffer, {
      headers: {
        "Content-Type": "video/webm",
        "Content-Length": String(buffer.length),
        "Accept-Ranges": "bytes",
      },
    });
  } catch {
    error(404, "File not found on disk");
  }
};
