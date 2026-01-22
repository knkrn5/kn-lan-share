# kn-http-server

A lightweight, zero-dependency command-line HTTP server for serving static files and directories. It provides a simple interface for directory listings, file previews, and downloads.

## Features

- **Static File Serving:** Instantly serves files from the current directory.
- **Directory Listing:** Auto-generated HTML directory listings with intuitive navigation.
- **Preview & Download:** Built-in links to preview (👁️) or download (⬇️) files directly from the browser.
- **Customizable:** Configure port, binding address, and stream high-water mark via CLI flags.
- **Wide MIME Support:** Comprehensive support for text, images, audio, video, and application file types.
- **Zero Dependencies:** Built using only native Node.js modules.

## Installation

### Globally via npm

You can install the package globally to use it as a command-line tool anywhere on your system.

```bash
npm install -g kn-http-server
```

### Run via npx

Alternatively, you can run it without installing using `npx`:

```bash
npx kn-http-server [options]
```

## Usage

Navigate to the directory you want to serve and run:

```bash
kn-http-server
```

By default, the server listens on `0.0.0.0:3000`.

### Command Line Options

You can customize the server behavior using the following flags:

| Flag  | Description                                      | Default     | Example                  |
| :---- | :----------------------------------------------- | :---------- | :----------------------- |
| `-p`  | **Port**: The port number to listen on.          | `3000`      | `kn-http-server -p 8080` |
| `-a`  | **Address**: The IP address to bind to.          | `0.0.0.0`   | `kn-http-server -a 127.0.0.1` |
| `-hw` | **HighWaterMark**: Stream buffer size in bytes.  | Node Default| `kn-http-server -hw 65536` |

### Examples

**Start on a specific port:**
```bash
kn-http-server -p 8080
```

**Bind to localhost only:**
```bash
kn-http-server -a 127.0.0.1
```

**Set custom stream buffer size (HighWaterMark):**
```bash
kn-http-server -hw 64000
```

## Development

If you want to contribute or modify the server code:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd http-server
    ```

2.  **Start the server locally:**
    ```bash
    node server.js
    # OR with options
    node server.js -p 4000
    ```

## License

ISC

