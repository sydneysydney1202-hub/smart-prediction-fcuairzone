import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import { createClient } from 'redis';
import { v4 as uuidv4 } from 'uuid';
import cron from 'node-cron';

// 路由
import locationsRouter from './routes/locations';
import predictionsRouter from './routes/predictions';
import submissionsRouter from './routes/submissions';
import weatherRouter from './routes/weather';

// 初始化
dotenv.config();
const app: Express = express();
const port = process.env.PORT || 5000;

// 中間件
app.use(cors());
app.use(express.json());

// 數據庫連接
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Redis 連接
export const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redis.on('error', (err) => console.error('Redis Client Error', err));
redis.connect();

// 健康檢查
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API 路由
app.use('/api/locations', locationsRouter);
app.use('/api/predictions', predictionsRouter);
app.use('/api/submissions', submissionsRouter);
app.use('/api/weather', weatherRouter);

// 錯誤處理
app.use((err: any, req: Request, res: Response) => {
  console.error(err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
  });
});

// 啟動伺服器
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
  console.log('📊 Smart Prediction API Server');
});

// 定時任務：每5分鐘更新預測
cron.schedule('*/5 * * * *', async () => {
  console.log('🔄 Updating predictions...');
  // 更新預測邏輯將在這裡實現
});

export default app;