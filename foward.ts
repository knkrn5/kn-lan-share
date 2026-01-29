import { open } from "node:fs/promises";

    const fh = await open('screen.mp4', 'r');
    let closed = false;
    const closeFH = async () => {
        if (!closed) {
            closed = true;
            await fh.close();
        }
    };
    try {
        const stat = await fh.stat();
        const range = req.headers.range;
        console.log(range)

        const attachCloseHandlers = (stream: NodeJS.ReadableStream) => {
            // stream.on('end', closeFH);
            // stream.on('close', closeFH);
            // stream.on('error', closeFH);
            res.on('close', closeFH);
            // res.on('finish', closeFH);
        };


        if (!range) {
            res.writeHead(200, {
                'Content-Type': 'video/mp4',
                'Content-Length': stat.size,
                'Accept-Ranges': 'bytes'
            });
            const stream = fh.createReadStream();
            stream.pipe(res);

            attachCloseHandlers(stream)
            return;
        }

        const match = /bytes=(\d+)-(\d*)/.exec(range);
        // if range is not in valid format
        if (!match) {
            res.status(416).setHeader('Content-Range', `bytes */${stat.size}`).end();
            return;
        }

        const bytesStart = match[1] ? parseInt(match[1], 10) : 0;
        const bytesEnd = match[2] ? parseInt(match[2], 10) : stat.size - 1;

        //extra validation incase server receives startbytes greater than endbytes or startbytes greater than file size
        if (bytesStart > bytesEnd || bytesStart >= stat.size) {
            res.status(416).setHeader('Content-Range', `bytes */${stat.size}`).end();
            return;
        }


        const chunkSize = bytesEnd - bytesStart + 1;
        res.writeHead(206, {
            'Content-Range': `bytes ${bytesStart}-${bytesEnd}/${stat.size}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': 'video/mp4'
        });

        const stream = fh.createReadStream({ start: bytesStart, end: bytesEnd });

        attachCloseHandlers(stream)
        stream.pipe(res);

    } catch (err) {
        res.status(500).send('Error reading video file');
        await closeFH();
    }