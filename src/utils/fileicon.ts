import { statSync } from "node:fs";

const IMAGE_EXT = ["png", "jpg", "jpeg", "gif", "webp", "svg", "ico", "bmp"];
const VIDEO_EXT = ["mp4", "webm", "mkv", "mov", "avi"];
const AUDIO_EXT = ["mp3", "wav", "ogg", "flac", "m4a"];
const ARCHIVE_EXT = ["zip", "rar", "7z", "tar", "gz"];

export function getFileIcon(item: string, fsPath: string) {
  const isDir = statSync(fsPath).isDirectory();
  const ext =
    !isDir && item.includes(".") ? item.split(".").pop()!.toLowerCase() : "";

  let iconClass = "is-doc";
  let iconLabel = ext ? ext.slice(0, 4) : "file";

  if (isDir) {
    iconClass = "is-folder";
    iconLabel = "dir";
  } else if (IMAGE_EXT.includes(ext)) {
    iconClass = "is-image";
  } else if (VIDEO_EXT.includes(ext)) {
    iconClass = "is-video";
  } else if (AUDIO_EXT.includes(ext)) {
    iconClass = "is-audio";
  } else if (ARCHIVE_EXT.includes(ext)) {
    iconClass = "is-archive";
  }

  return { iconClass, iconLabel, isDir };
}
