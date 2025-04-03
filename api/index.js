import express from 'express';

const app = express();

// API Routes
app.get('/api/hello', (req, res) => {
  res.json({
    message: 'Hello from Vercel API!',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// Здоровье сервера
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', time: new Date().toISOString() });
});

// Экспортируем по Vercel Serverless Function convention
export default app; 