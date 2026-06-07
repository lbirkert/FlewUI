import { error } from "@sveltejs/kit";
import { createReadStream } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { getFile, getDriveContext, isFileInSharedFolder, prisma } from "$lib/server/db";
import { transcodeVideo, getTranscodedPath } from "$lib/server/transcode";
import type { RequestHandler } from "./$types";

const UPLOAD_DIR = join(process.cwd(), "uploads");

export const GET: RequestHandler = async ({ params, request, url, locals }) => {
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

  const quality = url.searchParams.get("quality") || undefined;

  async function tryServe(): Promise<Response | null> {

    if(!record.transcodedName)
      return null;

    const filePath = join(UPLOAD_DIR, getTranscodedPath(record.storedName, quality));
    console.log(filePath);

    let fileStat;
    try {
      fileStat = await stat(filePath);
    } catch {
      return null;
    }

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
  }

  let response = await tryServe();
  if (response) return response;

  // File not found on disk — try transcoding on demand
  if (!record.type.startsWith("video/")) error(404, "File not found on disk");

  console.log(`[stream] transcoding ${record.storedName} on demand`);
  const newTranscoded = await transcodeVideo(record.storedName);
  if (!newTranscoded) error(404, "File not found on disk");

  await prisma.file.update({
    where: { id: record.id },
    data: { transcodedName: newTranscoded },
  });
  record.transcodedName = newTranscoded;

  response = await tryServe();
  if (!response) error(404, "File not found on disk");
  return response;
};
