import { error } from "@sveltejs/kit";
import { createReadStream } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { getFile, incrementDownloads } from "$lib/server/db";
import type { RequestHandler } from "./$types";

const UPLOAD_DIR = join(process.cwd(), "uploads");

export const GET: RequestHandler = async ({ params, url, request }) => {
  const record = await getFile(params.id);
  if (!record) error(404, "File not found");

  const filePath = join(UPLOAD_DIR, record.storedName);

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
          "Content-Type": record.type || "application/octet-stream",
          "Content-Length": String(chunkSize),
          "Content-Disposition": `inline; filename="${record.originalName}"`,
        },
      });
    }

    await incrementDownloads(record.id);
    const buffer = await readFile(filePath);
    const inline = url.searchParams.has("inline");
    return new Response(buffer, {
      headers: {
        "Content-Type": record.type || "application/octet-stream",
        "Content-Disposition": inline ? `inline; filename="${record.originalName}"` : `attachment; filename="${record.originalName}"`,
        "Content-Length": String(buffer.length),
        "Accept-Ranges": "bytes",
      },
    });
  } catch {
    error(404, "File not found on disk");
  }
};
