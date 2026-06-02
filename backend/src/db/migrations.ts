import { pool } from '../index';

async function runMigrations() {
  try {
    console.log('🔄 Running migrations...');

    // 建立 locations 表
    await pool.query(`
      CREATE TABLE IF NOT EXISTS locations (
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        latitude DECIMAL(10, 8) NOT NULL,
        longitude DECIMAL(11, 8) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Created locations table');

    // 建立 location_submissions 表
    await pool.query(`
      CREATE TABLE IF NOT EXISTS location_submissions (
        id UUID PRIMARY KEY,
        location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
        crowd_level INTEGER CHECK (crowd_level >= 0 AND crowd_level <= 100),
        temperature DECIMAL(5, 2),
        notes TEXT,
        user_ip VARCHAR(45),
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Created location_submissions table');

    // 建立索引
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_submissions_location 
      ON location_submissions(location_id);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_submissions_timestamp 
      ON location_submissions(submitted_at);
    `);
    console.log('✅ Created indexes');

    console.log('🎉 Migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}

runMigrations();