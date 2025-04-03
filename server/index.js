// Simple Express server as a placeholder until we fix TypeScript compilation
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3000;

// Log environment for debugging
console.log('Environment:', {
  cwd: process.cwd(),
  dirname: __dirname,
  nodeVersion: process.version
});

// Basic middleware
app.use(express.json());

// Serve static files from the client's dist folder if it exists
const clientDistPath = path.join(__dirname, '..', 'dist', 'public');
if (fs.existsSync(clientDistPath)) {
  console.log('Serving static files from:', clientDistPath);
  app.use(express.static(clientDistPath));
}

// Basic route
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Fallback route
app.get('*', (req, res) => {
  res.json({ message: 'Server is running, but route not found' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 