import path from "node:path";

export class DirPath {
  private constructor() {}

  static createSourceCodeApath(...filePaths: string[]) {
    const dir = path.join(import.meta.dirname, ...filePaths);
    return dir;
  }

  static createFileExecApath(...filePaths: string[]) {
    const dir = path.join(process.cwd(), ...filePaths);
    return dir;
  }

  static normalisePath(...filePaths: string[]) {
    const parts = filePaths.map((p) => p.replace(/\\/g, "/"));
    return path.posix.join("/", ...parts);
  }

  static encodeUrlPath(urlPath: string) {
    if (urlPath === "/") return "";
    return urlPath
      .split("/")
      .map((seg) => (seg ? encodeURIComponent(seg) : ""))
      .join("/");
  }
}
