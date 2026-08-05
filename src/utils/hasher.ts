import { createHash } from "node:crypto";

export function hashData(data: string): string {
  return createHash("sha256")
    .update(data, "utf8")
    .digest("hex");
}
