import express, { Router, Request, Response } from 'express';
import axios from 'axios';
import { redis } from '../index';

const router: Router = express.Router();

// 獲取當前天氣
router.get('/current', async (req: Request, res: Response) => {
  try {
    const cached = await redis.get('weather:current');
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        lat: process.env.OPENWEATHER_LAT || 24.1801,
        lon: process.env.OPENWEATHER_LON || 120.6484,
        appid: process.env.OPENWEATHER_API_KEY,
        units: 'metric',
      },
    });

    const weatherData = {
      temperature: response.data.main.temp,
      humidity: response.data.main.humidity,
      description: response.data.weather[0].description,
      icon: response.data.weather[0].icon,
      feelsLike: response.data.main.feels_like,
      tempMin: response.data.main.temp_min,
      tempMax: response.data.main.temp_max,
      windSpeed: response.data.wind.speed,
      timestamp: new Date().toISOString(),
    };

    // 快取15分鐘
    await redis.setEx('weather:current', 900, JSON.stringify(weatherData));

    res.json(weatherData);
  } catch (error) {
    console.error('Error fetching weather:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// 獲取未來5天天氣預報
router.get('/forecast', async (req: Request, res: Response) => {
  try {
    const cached = await redis.get('weather:forecast');
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const response = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
      params: {
        lat: process.env.OPENWEATHER_LAT || 24.1801,
        lon: process.env.OPENWEATHER_LON || 120.6484,
        appid: process.env.OPENWEATHER_API_KEY,
        units: 'metric',
      },
    });

    const forecastData = response.data.list.map((item: any) => ({
      timestamp: item.dt_txt,
      temperature: item.main.temp,
      humidity: item.main.humidity,
      description: item.weather[0].description,
      windSpeed: item.wind.speed,
    }));

    // 快取1小時
    await redis.setEx('weather:forecast', 3600, JSON.stringify(forecastData));

    res.json(forecastData);
  } catch (error) {
    console.error('Error fetching forecast:', error);
    res.status(500).json({ error: 'Failed to fetch forecast data' });
  }
});

export default router;