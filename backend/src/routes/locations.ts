import express, { Router, Request, Response } from 'express';
import { pool, redis } from '../index';
import { v4 as uuidv4 } from 'uuid';

const router: Router = express.Router();

// 獲取所有地點
router.get('/', async (req: Request, res: Response) => {
  try {
    // 嘗試從快取獲取
    const cached = await redis.get('locations:all');
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const result = await pool.query(
      `SELECT id, name, latitude, longitude, created_at 
       FROM locations 
       ORDER BY name ASC`
    );

    // 為每個地點獲取最新狀態
    const locationsWithStatus = await Promise.all(
      result.rows.map(async (loc) => {
        const statusResult = await pool.query(
          `SELECT crowd_level, temperature, submitted_at
           FROM location_submissions
           WHERE location_id = $1
           ORDER BY submitted_at DESC
           LIMIT 1`,
          [loc.id]
        );

        const status = statusResult.rows[0];
        return {
          id: loc.id,
          name: loc.name,
          latitude: parseFloat(loc.latitude),
          longitude: parseFloat(loc.longitude),
          crowdLevel: status?.crowd_level || 0,
          temperature: status?.temperature || 25,
          timestamp: status?.submitted_at || new Date().toISOString(),
        };
      })
    );

    // 快取5分鐘
    await redis.setEx(
      'locations:all',
      300,
      JSON.stringify(locationsWithStatus)
    );

    res.json(locationsWithStatus);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});

// 新增地點
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, latitude, longitude } = req.body;

    if (!name || latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        message: '地點名稱、緯度和經度為必填項',
      });
    }

    const id = uuidv4();
    const result = await pool.query(
      `INSERT INTO locations (id, name, latitude, longitude) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [id, name, latitude, longitude]
    );

    // 清除快取
    await redis.del('locations:all');

    res.status(201).json({
      id: result.rows[0].id,
      name: result.rows[0].name,
      latitude: parseFloat(result.rows[0].latitude),
      longitude: parseFloat(result.rows[0].longitude),
      crowdLevel: 0,
      temperature: 25,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error adding location:', error);
    res.status(500).json({ error: 'Failed to add location' });
  }
});

// 獲取特定地點
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM locations WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }

    res.json({
      id: result.rows[0].id,
      name: result.rows[0].name,
      latitude: parseFloat(result.rows[0].latitude),
      longitude: parseFloat(result.rows[0].longitude),
    });
  } catch (error) {
    console.error('Error fetching location:', error);
    res.status(500).json({ error: 'Failed to fetch location' });
  }
});

export default router;