export function formatSize(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
}

export function formatDate(ts: Date | string) {
  const d = new Date(ts);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60000) return "just now";
  if (diff < 3600000) return Math.floor(diff / 60000) + " min ago";
  if (diff < 86400000) return Math.floor(diff / 3600000) + " hours ago";
  return d.toLocaleDateString();
}

export function formatFullDate(ts: Date | string) {
  return new Date(ts).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

const AUDIO_MIMES = new Set(["audio/mpeg", "audio/wav", "audio/x-wav", "audio/flac", "audio/x-flac", "audio/ogg", "audio/aac", "audio/mp4", "audio/x-m4a", "audio/webm", "audio/opus"]);
const AUDIO_EXTS = new Set(["mp3", "wav", "flac", "ogg", "aac", "m4a", "wma", "opus", "webm"]);

export function isImageType(type: string) {
  return ["image/jpeg", "image/png", "image/gif", "image/webp", "image/bmp", "image/svg+xml", "image/avif"].includes(type);
}

export function isAudioType(type: string, originalName: string): boolean {
  if (AUDIO_MIMES.has(type)) return true;
  const ext = originalName.split(".").pop()?.toLowerCase();
  return ext ? AUDIO_EXTS.has(ext) : false;
}

export function getPreviewUrl(fileId: string, driveId?: string) {
  if (driveId) return `/api/drive/${driveId}/files/${fileId}/preview`;
  return `/api/files/${fileId}/preview`;
}

export function getFileIconClass(type: string, originalName: string) {
  if (isImageType(type) || type.startsWith("image/")) return "image";
  if (isAudioType(type, originalName)) return "audio";
  const ext = originalName.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return "pdf";
  if (["doc", "docx"].includes(ext || "")) return "docx";
  if (["xls", "xlsx"].includes(ext || "")) return "xlsx";
  if (ext === "txt") return "txt";
  if (ext === "md") return "md";
  if (ext === "csv") return "csv";
  return "other";
}
