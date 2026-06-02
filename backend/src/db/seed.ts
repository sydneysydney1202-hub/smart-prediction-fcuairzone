import { pool } from '../index';
import { v4 as uuidv4 } from 'uuid';

const seedData = [
  {
    name: '📚 圖書館',
    latitude: 24.1808,
    longitude: 120.6480,
  },
  {
    name: '🍽️ 學生餐廳',
    latitude: 24.1805,
    longitude: 120.6485,
  },
  {
    name: '🏃 運動中心',
    latitude: 24.1795,
    longitude: 120.6490,
  },
  {
    name: '🎓 教學大樓 A',
    latitude: 24.1820,
    longitude: 120.6475,
  },
  {
    name: '💻 資訊大樓',
    latitude: 24.1815,
    longitude: 120.6488,
  },
  {
    name: '🛏️ 宿舍區',
    latitude: 24.1790,
    longitude: 120.6495,
  },
];

async function seed() {
  try {
    console.log('🌱 Seeding database...');

    for (const location of seedData) {
      const id = uuidv4();
      
      // 插入地點
      await pool.query(
        `INSERT INTO locations (id, name, latitude, longitude)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (name) DO NOTHING`,
        [id, location.name, location.latitude, location.longitude]
      );

      // 獲取插入的 ID（或者如果已存在則獲取現有的 ID）
      const result = await pool.query(
        'SELECT id FROM locations WHERE name = $1',
        [location.name]
      );
      const locationId = result.rows[0].id;

      // 插入示例提交數據
      for (let i = 0; i < 5; i++) {
        const crowdLevel = Math.floor(Math.random() * 100);
        const temperature = 20 + Math.random() * 10;
        const timestamp = new Date(
          new Date().getTime() - (5 - i) * 10 * 60000
        );

        await pool.query(
          `INSERT INTO location_submissions 
           (id, location_id, crowd_level, temperature, submitted_at)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            uuidv4(),
            locationId,
            crowdLevel,
            temperature,
            timestamp,
          ]
        );
      }

      console.log(`✅ Seeded ${location.name}`);
    }

    console.log('🎉 Seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seed();