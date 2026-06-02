import express, { Router, Request, Response } from 'express';
import { pool, redis } from '../index';

const router: Router = express.Router();

// 獲取位置的預測
router.get('/:locationId', async (req: Request, res: Response) => {
  try {
    const { locationId } = req.params;

    // 檢查快取
    const cached = await redis.get(`predictions:${locationId}`);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // 獲取最近1小時的歷史數據
    const historicalData = await pool.query(
      `SELECT crowd_level, temperature, submitted_at
       FROM location_submissions
       WHERE location_id = $1
         AND submitted_at > NOW() - INTERVAL '1 hour'
       ORDER BY submitted_at ASC`,
      [locationId]
    );

    // 簡單的線性預測（實際應用應使用更複雜的算法）
    const predictions = generatePredictions(historicalData.rows);

    // 快取10分鐘
    await redis.setEx(
      `predictions:${locationId}`,
      600,
      JSON.stringify(predictions)
    );

    res.json(predictions);
  } catch (error) {
    console.error('Error fetching predictions:', error);
    res.status(500).json({ error: 'Failed to fetch predictions' });
  }
});

function generatePredictions(
  historicalData: any[]
): Array<{
  time: string;
  crowdPrediction: number;
  temperaturePrediction: number;
  alert?: string;
}> {
  const predictions = [];
  const now = new Date();

  // 如果沒有歷史數據，返回基礎預測
  if (historicalData.length === 0) {
    for (let i = 1; i <= 12; i++) {
      const time = new Date(now.getTime() + i * 5 * 60000);
      predictions.push({
        time: time.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
        crowdPrediction: 50,
        temperaturePrediction: 25,
      });
    }
    return predictions;
  }

  // 計算平均值和趨勢
  const avgCrowd =
    historicalData.reduce((sum: number, d: any) => sum + d.crowd_level, 0) /
    historicalData.length;
  const avgTemp =
    historicalData.reduce((sum: number, d: any) => sum + d.temperature, 0) /
    historicalData.length;

  // 計算趨勢
  const crowdTrend =
    historicalData.length > 1
      ? (historicalData[historicalData.length - 1].crowd_level -
          historicalData[0].crowd_level) /
        (historicalData.length - 1)
      : 0;

  const tempTrend =
    historicalData.length > 1
      ? (historicalData[historicalData.length - 1].temperature -
          historicalData[0].temperature) /
        (historicalData.length - 1)
      : 0;

  // 生成未來12個5分鐘時間點的預測
  for (let i = 1; i <= 12; i++) {
    const time = new Date(now.getTime() + i * 5 * 60000);
    const crowdPrediction = Math.max(
      0,
      Math.min(100, avgCrowd + crowdTrend * i)
    );
    const temperaturePrediction = Math.max(
      15,
      Math.min(40, avgTemp + tempTrend * i)
    );

    const prediction: any = {
      time: time.toLocaleTimeString('zh-TW', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      crowdPrediction: Math.round(crowdPrediction),
      temperaturePrediction: Math.round(temperaturePrediction * 10) / 10,
    };

    // 添加警報
    if (crowdPrediction > 80) {
      prediction.alert = `⚠️ 預計在 ${prediction.time} 人潮將達到 ${Math.round(crowdPrediction)}%`;
    }

    predictions.push(prediction);
  }

  return predictions;
}

export default router;