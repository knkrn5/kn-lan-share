import type { IncomingMessage } from "node:http";

export function getCookie(req: IncomingMessage, name: string) {
  const raw = req.headers.cookie || "";
  const match = new RegExp(`(?:^|; )${name}=([^;]*)`).exec(raw);
  return match ? decodeURIComponent(match[1]!) : null;
}