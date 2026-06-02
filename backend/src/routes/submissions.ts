import express, { Router, Request, Response } from 'express';
import { pool, redis } from '../index';
import { v4 as uuidv4 } from 'uuid';

const router: Router = express.Router();

// 提交狀態數據
router.post('/', async (req: Request, res: Response) => {
  try {
    const { locationId, crowdLevel, temperature, notes } = req.body;

    // 驗證
    if (!locationId || crowdLevel === undefined || temperature === undefined) {
      return res.status(400).json({
        message: '地點ID、人潮指數和溫度為必填項',
      });
    }

    if (crowdLevel < 0 || crowdLevel > 100) {
      return res.status(400).json({
        message: '人潮指數須在 0-100 之間',
      });
    }

    // 檢查地點是否存在
    const locationCheck = await pool.query(
      'SELECT id FROM locations WHERE id = $1',
      [locationId]
    );

    if (locationCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }

    const id = uuidv4();
    const submissionResult = await pool.query(
      `INSERT INTO location_submissions 
       (id, location_id, crowd_level, temperature, notes, user_ip)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        id,
        locationId,
        crowdLevel,
        temperature,
        notes || null,
        req.ip || 'unknown',
      ]
    );

    // 清除相關快取
    await redis.del(`predictions:${locationId}`);
    await redis.del('locations:all');

    res.status(201).json({
      id: submissionResult.rows[0].id,
      locationId: submissionResult.rows[0].location_id,
      crowdLevel: submissionResult.rows[0].crowd_level,
      temperature: submissionResult.rows[0].temperature,
      notes: submissionResult.rows[0].notes,
      timestamp: submissionResult.rows[0].submitted_at,
    });
  } catch (error) {
    console.error('Error submitting status:', error);
    res.status(500).json({ error: 'Failed to submit status' });
  }
});

// 獲取特定地點的所有提交
router.get('/location/:locationId', async (req: Request, res: Response) => {
  try {
    const { locationId } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

    const result = await pool.query(
      `SELECT id, location_id, crowd_level, temperature, notes, submitted_at, user_ip
       FROM location_submissions
       WHERE location_id = $1
       ORDER BY submitted_at DESC
       LIMIT $2`,
      [locationId, limit]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

export default router;