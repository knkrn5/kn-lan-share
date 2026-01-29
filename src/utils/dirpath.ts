import path from "node:path";

//create absolute path
export function createSourceCodeApath(...filePaths: string[]) {
  const dir = path.join(import.meta.dirname, ...filePaths);
  return dir;
}

export function createFileExecApath(...filePaths: string[]) {
  const dir = path.join(process.cwd(), ...filePaths);
  return dir;
}

export function normalisePath(...filePaths: string[]) {
  const dir = path.join("/", ...filePaths);
  return dir;
}

//join relative path
// export function joinRpath(filePath: string) {
//   const dirn = path.join(process.cwd(), filePath);
//   return dirn;
// }

