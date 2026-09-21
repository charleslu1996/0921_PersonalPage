import path from 'path';
import fs from 'fs';
import { DatabaseSync } from 'node:sqlite';
import { CountyWeather } from '../types/weather';

const isVercel = process.env.VERCEL === '1';
const DB_DIR = isVercel ? path.resolve('/tmp') : path.resolve(process.cwd(), 'data');
const DB_PATH = path.resolve(DB_DIR, 'weather.db');

let dbInstance: DatabaseSync | null = null;

export function getDatabase(): DatabaseSync {
  if (!dbInstance) {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }

      dbInstance = new DatabaseSync(DB_PATH);
      initSchema(dbInstance);
    } catch (err) {
      console.warn('SQLite init warning (falling back to memory):', err);
      dbInstance = new DatabaseSync(':memory:');
      initSchema(dbInstance);
    }
  }
  return dbInstance;
}

function initSchema(db: DatabaseSync) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS weather_forecasts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      location_name TEXT NOT NULL,
      region TEXT NOT NULL,
      forecast_start_time TEXT NOT NULL,
      forecast_end_time TEXT NOT NULL,
      temperature REAL,
      min_temperature REAL NOT NULL,
      max_temperature REAL NOT NULL,
      precipitation_probability REAL DEFAULT 0,
      weather_description TEXT NOT NULL,
      comfort_index TEXT,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      source TEXT DEFAULT 'CWA F-C0032-001',
      fetched_at TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now', 'localtime')),
      CONSTRAINT uq_location_time UNIQUE (location_name, forecast_start_time)
    );

    CREATE INDEX IF NOT EXISTS idx_forecasts_location ON weather_forecasts (location_name);
    CREATE INDEX IF NOT EXISTS idx_forecasts_start_time ON weather_forecasts (forecast_start_time);
    CREATE INDEX IF NOT EXISTS idx_forecasts_region ON weather_forecasts (region);
  `);
}

export interface DbWeatherRecord {
  id?: number;
  location_name: string;
  region: string;
  forecast_start_time: string;
  forecast_end_time: string;
  temperature: number;
  min_temperature: number;
  max_temperature: number;
  precipitation_probability: number;
  weather_description: string;
  comfort_index: string;
  latitude: number;
  longitude: number;
  source?: string;
  fetched_at: string;
  created_at?: string;
}

export function saveCountyWeathersToDb(counties: CountyWeather[], fetchedAt = new Date().toISOString()): number {
  const db = getDatabase();
  const upsertStmt = db.prepare(`
    INSERT INTO weather_forecasts (
      location_name,
      region,
      forecast_start_time,
      forecast_end_time,
      temperature,
      min_temperature,
      max_temperature,
      precipitation_probability,
      weather_description,
      comfort_index,
      latitude,
      longitude,
      source,
      fetched_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )
    ON CONFLICT(location_name, forecast_start_time) DO UPDATE SET
      forecast_end_time = excluded.forecast_end_time,
      temperature = excluded.temperature,
      min_temperature = excluded.min_temperature,
      max_temperature = excluded.max_temperature,
      precipitation_probability = excluded.precipitation_probability,
      weather_description = excluded.weather_description,
      comfort_index = excluded.comfort_index,
      latitude = excluded.latitude,
      longitude = excluded.longitude,
      fetched_at = excluded.fetched_at;
  `);

  let count = 0;
  for (const county of counties) {
    for (const forecast of county.forecasts) {
      const avgTemp = Math.round((forecast.minTemp + forecast.maxTemp) / 2);
      upsertStmt.run(
        county.locationName,
        county.region,
        forecast.startTime,
        forecast.endTime,
        avgTemp,
        forecast.minTemp,
        forecast.maxTemp,
        forecast.rainProb,
        forecast.weather,
        forecast.comfort,
        county.latitude,
        county.longitude,
        'CWA F-C0032-001',
        fetchedAt
      );
      count++;
    }
  }

  return count;
}

export function queryWeatherForecastsFromDb(locationName?: string, limit = 100): DbWeatherRecord[] {
  const db = getDatabase();
  if (locationName) {
    const stmt = db.prepare(`
      SELECT * FROM weather_forecasts
      WHERE location_name = ?
      ORDER BY forecast_start_time ASC
      LIMIT ?
    `);
    return stmt.all(locationName, limit) as unknown as DbWeatherRecord[];
  } else {
    const stmt = db.prepare(`
      SELECT * FROM weather_forecasts
      ORDER BY location_name ASC, forecast_start_time ASC
      LIMIT ?
    `);
    return stmt.all(limit) as unknown as DbWeatherRecord[];
  }
}

export function getDatabaseStats() {
  const db = getDatabase();
  const totalStmt = db.prepare(`SELECT count(*) as total FROM weather_forecasts`);
  const locStmt = db.prepare(`SELECT count(DISTINCT location_name) as locations FROM weather_forecasts`);
  const latestStmt = db.prepare(`SELECT max(fetched_at) as last_sync, min(forecast_start_time) as min_time, max(forecast_end_time) as max_time FROM weather_forecasts`);

  const total = (totalStmt.get() as any)?.total || 0;
  const locations = (locStmt.get() as any)?.locations || 0;
  const latest = (latestStmt.get() as any) || {};

  return {
    totalRecords: total,
    uniqueLocations: locations,
    lastSyncAt: latest.last_sync || null,
    forecastPeriodRange: {
      start: latest.min_time || null,
      end: latest.max_time || null,
    },
    databaseFile: 'data/weather.db',
  };
}
