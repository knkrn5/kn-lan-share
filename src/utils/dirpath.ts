import path from "node:path";

//create absolute path
export function createApath(...filePaths: string[]) {
  const dir = path.join(import.meta.dirname, ...filePaths);
  return dir;
}

//join relative path
// export function joinRpath(filePath: string) {
//   const dirn = path.join(process.cwd(), filePath);
//   return dirn;
// }

