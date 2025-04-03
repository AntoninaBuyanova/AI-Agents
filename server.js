import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import compression from 'compression';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Включаем сжатие
app.use(compression());

// Статические файлы
const distPath = path.join(__dirname, 'dist/public');
app.use(express.static(distPath));

// API маршруты
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from API!' });
});

// Маршрут для всех остальных запросов - отдаем index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Проверяем, запущено ли приложение через Vercel или локально
if (process.env.VERCEL) {
  // На Vercel, экспортируем приложение
  export default app;
} else {
  // Локально, запускаем сервер на порту
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
} 