const http = require('http');
const fs = require('fs');
const path = require('path');

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
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.woff2': 'application/font-woff2'
};

// Recursive function to scan directory for images
function scanDirectoryForImages(dirPath, basePath = '') {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const images = [];
  
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      const relativePath = basePath ? `${basePath}/${entry.name}` : entry.name;
      
      if (entry.isDirectory()) {
        // Skip Archived directory
        if (entry.name === 'Archived') {
          continue;
        }
        // Recursively scan subdirectories
        const subImages = scanDirectoryForImages(fullPath, relativePath);
        images.push(...subImages);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (imageExtensions.includes(ext)) {
          // Return path with leading slash
          images.push(`/images/${relativePath}`);
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error);
  }
  
  return images;
}

// Recursive function to scan directory for videos
function scanDirectoryForVideos(dirPath, basePath = '') {
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
  const videos = [];
  
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      const relativePath = basePath ? `${basePath}/${entry.name}` : entry.name;
      
      if (entry.isDirectory()) {
        // Recursively scan subdirectories
        const subVideos = scanDirectoryForVideos(fullPath, relativePath);
        videos.push(...subVideos);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (videoExtensions.includes(ext)) {
          // Return path with leading slash
          videos.push(`/videos/${relativePath}`);
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error);
  }
  
  return videos;
}

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  // API endpoint to list all images
  if (req.url.startsWith('/api/images') && req.method === 'GET') {
    const imagesDir = path.join(BASE_DIR, 'images');
    const allImages = scanDirectoryForImages(imagesDir);
    
    // Filter based on query parameter
    const urlParams = new URL(req.url, `http://${req.headers.host}`);
    const filter = urlParams.searchParams.get('filter');
    
    let filteredImages = allImages;
    
    if (filter === 'gallery') {
      // Only Gallery images
      filteredImages = allImages.filter(img => img.includes('/images/Gallery/'));
    } else if (filter === 'non-gallery') {
      // Everything except Gallery and Archived
      filteredImages = allImages.filter(img => 
        !img.includes('/images/Gallery/') && !img.includes('/images/Archived/')
      );
    } else {
      // Default: exclude Archived
      filteredImages = allImages.filter(img => !img.includes('/images/Archived/'));
    }
    
    res.writeHead(200, { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify(filteredImages), 'utf-8');
    return;
  }

  // API endpoint to list all videos
  if (req.url.startsWith('/api/videos') && req.method === 'GET') {
    const videosDir = path.join(BASE_DIR, 'videos');
    const allVideos = scanDirectoryForVideos(videosDir);
    
    // Filter based on query parameter
    const urlParams = new URL(req.url, `http://${req.headers.host}`);
    const filter = urlParams.searchParams.get('filter');
    
    let filteredVideos = allVideos;
    
    if (filter === 'gallery') {
      // Only Gallery videos
      filteredVideos = allVideos.filter(vid => vid.includes('/videos/Gallery/'));
    } else {
      // Default: all videos
      filteredVideos = allVideos;
    }
    
    res.writeHead(200, { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify(filteredVideos), 'utf-8');
    return;
  }

  // Decode URL-encoded paths (e.g., %20 -> space)
  let decodedUrl = decodeURIComponent(req.url);
  
  let filePath = decodedUrl;
  if (filePath === '/') {
    filePath = '/index.html';
  }

  // Remove leading slash and join with BASE_DIR
  if (filePath.startsWith('/')) {
    filePath = filePath.substring(1);
  }
  
  filePath = path.join(BASE_DIR, filePath);

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        console.log(`❌ File not found: ${filePath}`);
        console.log(`   Requested URL: ${req.url}`);
        console.log(`   Decoded URL: ${decodedUrl}`);
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(`<h1>404 - File Not Found</h1><p>Looking for: ${filePath}</p>`, 'utf-8');
      } else {
        console.log(`❌ Server Error: ${error.code} for ${filePath}`);
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`, 'utf-8');
      }
    } else {
      console.log(`✅ Serving: ${filePath}`);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Base directory: ${BASE_DIR}`);
  console.log(`Test file exists: ${require('fs').existsSync(path.join(BASE_DIR, 'images', 'Gallary', 'Projects', 'Keystone', 'Ackermans', 'Keystone 2.webp'))}`);
  console.log('Press Ctrl+C to stop the server');
});

