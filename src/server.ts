#!/usr/bin/env node
import { open, readdir, readFile } from "node:fs/promises";
import http from "node:http";
import type { IncomingMessage, ServerResponse } from "node:http";
import { mime } from "./utils/mime.js";
import { DirPath } from "./utils/dirpath.js";
import { argsHandler, argChecker } from "./utils/argshandler.js";
import { getFileIcon } from "./utils/fileicon.js";
import { createWriteStream } from "node:fs";
const server = http.createServer();
import { getActiveInterface } from "./utils/nic.js";
import qrcode from "qrcode-terminal";

const activeNICip = await getActiveInterface();

let port: number = 3000;
let addr: string = "0.0.0.0";
let highwaterMark: number;
let isUploadAllowed: boolean = false;
let showQRCode: boolean = false;
let serverPwd: string | null = null;

const serverAuthCheck = argChecker("-pwd");
if (!serverAuthCheck)
  throw Error(
    "Please provide a password using -pwd flag to start the server.",
  );

argsHandler("-pwd", (pwd) => {
  if (!pwd) {
    throw Error("Invalid password after -pwd");
  }

  if (pwd === "false") {
    console.log("your server password is disabled");
    return;
  }

  serverPwd = pwd;
  console.log("your server password is", serverPwd);
});

argsHandler("-p", (portNum) => {
  if (!portNum || isNaN(Number(portNum))) {
    throw Error("Invalid port number after -p");
  }
  port = Number(portNum);
});

argsHandler("-a", (ipAddr) => {
  if (!ipAddr) {
    throw Error("Invalid IP address after -a");
  }
  addr = ipAddr;
});

argsHandler("-hw", (hw) => {
  if (!hw || isNaN(Number(hw))) {
    throw Error("Invalid highwater mark number after -hw");
  }
  if (Number(hw) < 1 || Number(hw) > 1024 * 1024 * 1024) {
    throw Error("Highwater mark must be between 1 and 1073741824");
  }
  highwaterMark = Number(hw);
});

argsHandler("-qr", () => {
  showQRCode = true;
});

argsHandler("-up", () => {
  isUploadAllowed = true;
});

server.on("request", async (req: IncomingMessage, res: ServerResponse) => {
  const parsed = new URL(
    req.url || "/",
    `http://${req.headers.host || "localhost"}`,
  );
  const url = decodeURIComponent(parsed.pathname || "/");
  const nomalisedUrl = DirPath.normalisePath(url);
  const query = parsed.searchParams.has("download")
    ? "download"
    : parsed.searchParams.has("preview")
      ? "preview"
      : undefined;
  const appPwd = parsed.searchParams.get("auth") ?? undefined;
  console.log(url, "and", query);

  if (req.method === "GET") {
    if (url == "/favicon.ico") {
      const favicon = await readFile(
        DirPath.createSourceCodeApath("../", "../", "public", "favicon.ico"),
      );
      res.setHeader("Content-Type", "image/x-icon");
      return res.end(favicon);
      //   console.clear();
    }

    if (url.startsWith("/_js/")) {
      const [, scriptFileName] = url.split("/_js/");
      if (!scriptFileName) {
        res.end(`${scriptFileName} not found`);
        return;
      }
      const scriptContent = await readFile(
        DirPath.createSourceCodeApath("../", "../", "public", scriptFileName),
      );
      res.setHeader("Content-Type", "text/javascript");
      return res.end(scriptContent);
    } else if (url.startsWith("/_css/")) {
      const [, cssFileName] = url.split("/_css/");
      if (!cssFileName) {
        res.end(`${cssFileName} not found`);
        return;
      }
      const cssContent = await readFile(
        DirPath.createSourceCodeApath("../", "../", "public", cssFileName),
      );
      res.setHeader("Content-Type", "text/css");
      return res.end(cssContent);
    }

    //authentication
    if (serverPwd && url !== "/") {
      if (serverPwd !== appPwd) {
        const unauthHtml = await readFile(
          DirPath.createSourceCodeApath(
            "../",
            "../",
            "public",
            "unauth",
            "unauth.html",
          ),
        );
        res.statusCode = 401;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.end(unauthHtml);
        console.log("Unauthorized access attempt:", url);
        return;
      }
    }

    try {
      const fh = await open(`.${nomalisedUrl}`);
      const stat = await fh.stat();
      const contentType = mime(nomalisedUrl);

      if (stat.isDirectory()) {
        // console.log(DirPath.createSourceCodeApath("../", "../", "public", "index.html"))
        const htmlContent = await readFile(
          DirPath.createSourceCodeApath("../", "../", "public", "index.html"),
        );
        const dirsList: string[] = await readdir(`.${nomalisedUrl}`);
        let DynamicHTML = "";
        let DownloadFolder = url;
        const UploadFolder = process.cwd();
        dirsList.forEach((item) => {
          const itemPath = `${DirPath.encodeUrlPath(nomalisedUrl)}/${encodeURIComponent(item)}`;
          const fsPath = `.${nomalisedUrl === "/" ? "" : nomalisedUrl}/${item}`;
          const { iconClass, iconLabel, isDir } = getFileIcon(item, fsPath);
          const downloadBtn = isDir
            ? ""
            : `<a class="action-btn" href="${itemPath}?download" title="Download" aria-label="Download ${item}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>
              </a>`;
          DynamicHTML += `<li class="file-row">
            <div class="file-icon ${iconClass}" aria-hidden="true">${iconLabel}</div>
            <span class="file-name" title="${item}">${item}</span>
            <div class="file-actions">
              <a class="action-btn" href="${itemPath}?preview" title="Preview" aria-label="Preview ${item}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </a>
              ${downloadBtn}
            </div>
          </li>`;
        });
        if (query === "download") {
          res.setHeader("content-disposition", "attachment");
        }
        res.end(
          htmlContent
            .toString()
            .replace("${DynamicHTML}", DynamicHTML)
            .replace("${DownloadFolder}", DownloadFolder)
            .replace("${UploadFolder}", UploadFolder),
        );
      } else {
        res.setHeader("Content-Type", `${contentType}`);
        if (query === "download") {
          res.setHeader("content-disposition", "attachment");
          // res.setHeader("filename", "a.txt")
        }
        res.setHeader("Content-length", `${stat.size}`);
        const rs = fh.createReadStream({
          highWaterMark: highwaterMark ? Number(highwaterMark) : undefined,
        });
        rs.pipe(res);
      }

      res.on("close", () => {
        fh.close();
      });
    } catch (err: Error | any) {
      res.end(err.message);
    }
  } else if (req.method === "POST") {
    if (req.url === "/upload") {
      if (!isUploadAllowed) {
        res.statusCode = 403;
        return res.end("File uploads are not allowed on this server.");
      }

      const filename = req.headers.filename;

      if (!filename) {
        res.statusCode = 400;
        return res.end("Filename is missing.");
      }

      const ws = createWriteStream(`./${filename}`);
      req.pipe(ws);

      req.on("data", (chunk) => {
        // console.log("chunk received:", chunk.toString());
      });

      req.on("end", () => {
        console.log("Upload complete");
        res.end(`✅File Uploaded: ${filename}`);
      });
    } else {
      res.statusCode = 404;
      res.end("Invalid api endpoint.");
    }
  } else {
    res.statusCode = 405;
    res.end(`${req.method} method not allowed`);
  }
});

server.listen(port, addr, () => {
  console.log(`Server running on Host ${addr}`);
  console.log(
    `API listening on http://${activeNICip ? activeNICip.address : addr}:${port}`,
  );
  if (showQRCode)
    qrcode.generate(
      `http://${activeNICip ? activeNICip.address : addr}:${port}`,
      { small: true },
    );
});
