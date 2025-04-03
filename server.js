import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import compression from 'compression';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Включаем сжатие
app.use(compression());

// Публичный API-эндпоинт для проверки
app.get('/api/hello', (req, res) => {
  res.json({ 
    message: 'Hello from API!',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV
  });
});

// Статические файлы (работает в локальной среде)
const distPath = path.join(__dirname, 'dist/public');
if (process.env.NODE_ENV !== 'production') {
  app.use(express.static(distPath));
  
  // Маршрут для всех остальных запросов - отдаем index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Локально запускаем сервер на порту 
if (!process.env.VERCEL) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

// Экспортируем приложение для Vercel
export default app; 