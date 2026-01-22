// import { open, readdir, readFile } from "node:fs/promises";
// import { createReadStream } from "node:fs";
// import { spawn } from "node:child_process";
// import http from "node:http";
// import { MIMEParams, MIMEType } from "node:util";
// import { mime } from "./mime.js";
// const server = http.createServer();

// const port = 3000;
// const ip = "0.0.0.0";

// server.on("request", async (req, res) => {
//   let [url, query] = req.url.split("?");
//   url = decodeURIComponent(url);
//   console.log(url, "and", query);

//   if (url == "/favicon.ico") return res.end("no favicon");
//   //   console.clear();

//   try {
//     const fh = await open(`.${url}`);
//     const stat = await fh.stat();
//     // const contentType = mime.lookup(url);
//     const contentType = mime(url);

//     if (stat.isDirectory()) {
//       const htmlContent = await readFile("./public/index.html");
//       const dirsList = await readdir(`.${url}`);
//       let DynamicHTML = "";
//       let DynamicFolder = url;
//       dirsList.forEach((item, index) => {
//         // dirsList[index] = `<li>${item}</li>`;

//         DynamicHTML += `<li><a href="${
//           url === "/" ? "" : url
//         }/${item}"> ${item}</a> <a href="${
//           url === "/" ? "" : url
//         }/${item}?preview"> 👁️</a> <a href="${
//           url === "/" ? "" : url
//         }/${item}?download"> ⬇️</a></li>`;
//       });
//       if (query === "download") {
//         res.setHeader("content-disposition", "attachment");
//         // res.setHeader("Content-Type", `${contentType}`);
//       }
//       res.end(
//         htmlContent
//           .toString()
//           .replace("${DynamicHTML}", DynamicHTML)
//           .replace("${DynamicFolder}", DynamicFolder)
//       );
//     } else {
//       const ext = url.split(".").pop()?.toLowerCase();
//       const filePath = `.${url}`;

//       if (query === "preview" && ext === "mkv") {
//         res.statusCode = 200;
//         res.setHeader("Content-Type", "video/mp4");
//         res.setHeader("Accept-Ranges", "bytes");

//         const ffmpeg = spawn("ffmpeg", [
//           "-i",
//           filePath,
//           "-f",
//           "mp4",
//           "-movflags",
//           "frag_keyframe+empty_moov",
//           "-vcodec",
//           "libx264",
//           "-acodec",
//           "aac",
//           "-preset",
//           "veryfast",
//           "-crf",
//           "23",
//           "-pix_fmt",
//           "yuv420p",
//           "-g",
//           "48",
//           "-r",
//           "30",
//           "pipe:1",
//         ]);

//         ffmpeg.stdout.pipe(res);
//         ffmpeg.stderr.on("data", () => {});

//         const killFfmpeg = () => ffmpeg.kill("SIGKILL");
//         res.on("close", killFfmpeg);
//         res.on("finish", killFfmpeg);
//         return;
//       }

//       res.setHeader("Content-Type", `${contentType}`);
//       if (query === "download") {
//         res.setHeader("content-disposition", "attachment");
//         // res.setHeader("filename", "a.txt")
//       }

//       const range = req.headers.range;
//       if (range) {
//         const [startStr, endStr] = range.replace(/bytes=/, "").split("-");
//         const start = Number.parseInt(startStr, 10);
//         const end = endStr ? Number.parseInt(endStr, 10) : stat.size - 1;
//         const chunkSize = end - start + 1;

//         res.statusCode = 206;
//         res.setHeader("Content-Range", `bytes ${start}-${end}/${stat.size}`);
//         res.setHeader("Accept-Ranges", "bytes");
//         res.setHeader("Content-Length", `${chunkSize}`);
//         createReadStream(filePath, { start, end }).pipe(res);
//       } else {
//         res.setHeader("Content-length", `${stat.size}`);
//         const rs = fh.createReadStream();
//         rs.pipe(res);
//       }
//     }

//     res.on("close", () => {
//       fh.close();
//     });
//   } catch (err: any) {
//     res.end(err.message);
//   }
// });

// server.listen(port, ip, () => {
//   console.log(`API listening on http://${ip}:${port}`);
// });
