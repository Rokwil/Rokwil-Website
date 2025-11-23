const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8000;
const BASE_DIR = path.join(__dirname, 'docs');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  // Parse and decode the URL
  const parsedUrl = url.parse(req.url);
  let filePath = decodeURIComponent(parsedUrl.pathname);
  
  // Remove leading slash and handle root
  if (filePath === '/' || filePath === '') {
    filePath = 'index.html';
  } else {
    filePath = filePath.substring(1); // Remove leading /
  }
  
  // Join with base directory
  const fullPath = path.join(BASE_DIR, filePath);
  
  // Normalize path and check it's within BASE_DIR (security)
  const normalizedPath = path.normalize(fullPath);
  const resolvedBase = path.resolve(BASE_DIR);
  const resolvedPath = path.resolve(normalizedPath);
  
  if (!resolvedPath.startsWith(resolvedBase)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  
  // Get file extension for content type
  const ext = path.extname(normalizedPath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';
  
  // Read and serve file
  fs.readFile(normalizedPath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404);
        res.end('File not found');
      } else {
        res.writeHead(500);
        res.end(`Server error: ${error.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log('Press Ctrl+C to stop');
});

