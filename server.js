import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverPath = path.join(__dirname, 'server', 'index.ts');

console.log('Starting server from:', serverPath);
console.log('File exists:', fs.existsSync(serverPath));

try {
  // List files in the server directory
  const serverDir = path.join(__dirname, 'server');
  console.log('Server directory contents:', fs.readdirSync(serverDir));

  // Use tsx to run the TypeScript file directly
  const server = spawn('npx', ['tsx', serverPath], {
    stdio: 'inherit',
    env: process.env
  });

  server.on('error', (err) => {
    console.error('Failed to start server:', err);
  });

  process.on('SIGINT', () => {
    server.kill();
    process.exit();
  });
} catch (error) {
  console.error('Error starting server:', error);
} 