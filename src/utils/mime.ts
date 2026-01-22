const extensionToMime = new Map([
  // Text
  ["txt", "text/plain; charset=utf-8"],
  ["text", "text/plain; charset=utf-8"],
  ["csv", "text/csv; charset=utf-8"],
  ["tsv", "text/tab-separated-values; charset=utf-8"],
  ["md", "text/markdown; charset=utf-8"],
  ["html", "text/html; charset=utf-8"],
  ["htm", "text/html; charset=utf-8"],
  ["css", "text/css; charset=utf-8"],
  ["js", "text/javascript; charset=utf-8"],
  ["mjs", "text/javascript; charset=utf-8"],
  ["cjs", "text/javascript; charset=utf-8"],
  ["json", "application/json; charset=utf-8"],
  ["map", "application/json; charset=utf-8"],
  ["xml", "application/xml; charset=utf-8"],
  ["yaml", "text/yaml; charset=utf-8"],
  ["yml", "text/yaml; charset=utf-8"],
  ["svg", "image/svg+xml"],
  ["srt", "application/x-subrip; charset=utf-8"],

  // Images
  ["png", "image/png"],
  ["jpg", "image/jpeg"],
  ["jpeg", "image/jpeg"],
  ["gif", "image/gif"],
  ["webp", "image/webp"],
  ["avif", "image/avif"],
  ["ico", "image/x-icon"],
  ["bmp", "image/bmp"],
  ["tif", "image/tiff"],
  ["tiff", "image/tiff"],
  ["heic", "image/heic"],
  ["heif", "image/heif"],
  ["dng", "image/x-adobe-dng"],
  ["cr2", "image/x-canon-cr2"],
  ["cr3", "image/x-canon-cr3"],
  ["nef", "image/x-nikon-nef"],
  ["arw", "image/x-sony-arw"],
  ["raf", "image/x-fuji-raf"],
  ["rw2", "image/x-panasonic-rw2"],
  ["orf", "image/x-olympus-orf"],

  // Audio
  ["mp3", "audio/mpeg"],
  ["wav", "audio/wav"],
  ["aac", "audio/aac"],
  ["flac", "audio/flac"],
  ["ogg", "audio/ogg"],
  ["opus", "audio/opus"],
  ["m4a", "audio/mp4"],
  ["wma", "audio/x-ms-wma"],
  ["alac", "audio/alac"],
  ["aiff", "audio/aiff"],
  ["ape", "audio/ape"],
  ["amr", "audio/amr"],

  // Video
  ["mp4", "video/mp4"],
  ["m4v", "video/x-m4v"],
  ["mkv", "video/x-matroska"],
  ["mov", "video/quicktime"],
  ["avi", "video/x-msvideo"],
  ["webm", "video/webm"],
  ["flv", "video/x-flv"],
  ["wmv", "video/x-ms-wmv"],
  ["3gp", "video/3gpp"],
  ["ts", "video/mp2t"],
  ["mts", "video/mp2t"],
  ["vob", "video/dvd"],

  // Documents
  ["pdf", "application/pdf"],
  ["doc", "application/msword"],
  [
    "docx",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  ["xls", "application/vnd.ms-excel"],
  ["xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
  ["ppt", "application/vnd.ms-powerpoint"],
  [
    "pptx",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ],
  ["rtf", "application/rtf"],
  ["odt", "application/vnd.oasis.opendocument.text"],
  ["ods", "application/vnd.oasis.opendocument.spreadsheet"],
  ["odp", "application/vnd.oasis.opendocument.presentation"],

  // Archives
  ["zip", "application/zip"],
  ["tar", "application/x-tar"],
  ["gz", "application/gzip"],
  ["tgz", "application/gzip"],
  ["rar", "application/vnd.rar"],
  ["7z", "application/x-7z-compressed"],
  ["bz2", "application/x-bzip2"],
  ["xz", "application/x-xz"],

  // Fonts
  ["woff", "font/woff"],
  ["woff2", "font/woff2"],
  ["ttf", "font/ttf"],
  ["otf", "font/otf"],
  ["eot", "application/vnd.ms-fontobject"],
]);

export function mime(filePath: string): string {
  const ext = filePath.split(".").pop()?.toLowerCase();
  if (!ext || ext === filePath.toLowerCase()) return "application/octet-stream";
  return extensionToMime.get(ext) || "application/octet-stream";
}
