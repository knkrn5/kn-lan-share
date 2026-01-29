# KN-Lan-Share

> A lightweight, feature-rich command-line HTTP server for local file sharing and transfer across your network.

[![npm version](https://img.shields.io/npm/v/kn-lan-share.svg)](https://www.npmjs.com/package/kn-lan-share)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

## 🚀 Quick Start

```bash
# Install globally
npm install -g kn-lan-share

# Start the server
kls
```

That's it! Your file server is now running and accessible from any device on your local network.

## 📋 Table of Contents

- [Installation](#-installation)
- [Usage](#-usage)
- [Command-Line Options](#-command-line-options)
- [Security Considerations](#-security-considerations)
- [Examples](#-examples)
- [Development](#-development)
- [License](#-license)

## 📦 Installation

### Global Installation (Recommended)

```bash
npm install -g kn-lan-share
```

### Local Development

```bash
# Clone the repository
git clone <repository-url>
cd kn-lan-share

# Install dependencies
npm install

# Build the project
npm run build

# Run the server
npm start
```

## 🎯 Usage

### Basic Usage

```bash
# Start server on default port (3000)
kls

# The server will display:
# - Server host address
# - Active network interface IP
# - Access URL for other devices
```

### With Custom Port

```bash
kls -p 8080
```

### With Custom IP Binding

```bash
kls -a 192.168.1.100
```

### Enable File Uploads

```bash
kls -up
```

### Show QR Code

```bash
kls -qr
```

### Combined Options

```bash
kls -p 8080 -up true -qr
```

## 🎛️ Command-Line Options

| Flag           | Description                                         | Default | Example                |
| -------------- | --------------------------------------------------- | ------- | ---------------------- |
| `-p <port>`    | Custom port number                                  | 3000    | `kls -p 8080`          |
| `-a <address>` | Bind to specific IP address                         | 0.0.0.0 | `kls -a 192.168.1.100` |
| `-hw <bytes>`  | High water mark for streams (1 to 1073741824 bytes) | Default | `kls -hw 65536`        |
| `-qr`          | Display QR code in terminal                         | false   | `kls -qr`              |
| `-up`          | Enable/disable file uploads                         | false   | `kls -up true`         |

## 🔒 Security Considerations

### Upload Protection

By default, file uploads are **disabled** to protect your system from unauthorized file writes. To enable uploads:

```bash
kls -up
```

### Network Exposure

The server binds to `0.0.0.0` by default, making it accessible from any device on your network. To restrict access:

```bash
# Bind to localhost only
kls -a 127.0.0.1

# Bind to specific network interface
kls -a 192.168.1.100
```

### Recommended Practices

- Only enable uploads (`-up true`) when you need to receive files
- Use on trusted networks only
- Monitor the terminal for access logs
- Stop the server when not in use

## 📖 Examples

### Example 1: Personal File Server

```bash
# Start server with QR code for easy mobile access
kls -qr
```

Scan the QR code with your phone to instantly access files!

### Example 2: Team File Sharing with Uploads

```bash
# Start on custom port with uploads enabled
kls -p 3000 -up
```

Share the URL with your team to both download and upload files.

### Example 3: Optimized Streaming

```bash
# Start with custom buffer size for large file transfers
kls -hw 131072
```

Adjust the high water mark for optimal performance with large files.

### Example 4: Development Server

```bash
# Bind to localhost only for local testing
kls -a 127.0.0.1 -p 3000
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📄 License

ISC License - See LICENSE file for details

## 👨‍💻 Author

**knkrn5**

## 🙏 Acknowledgments

- Built with Node.js native modules for zero-dependency runtime
- Uses `qrcode-terminal` for QR code generation

---

**Made with ❤️ for easy local file sharing**
