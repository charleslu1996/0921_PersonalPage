import fs from 'fs';
import path from 'path';
import { DatabaseSync } from 'node:sqlite';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_PATH = path.resolve(DATA_DIR, 'weather.db');
const SAMPLE_JSON_PATH = path.resolve(DATA_DIR, 'sample_cwa_forecast.json');

// Ensure data directory
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

console.log('=== Initializing Weather Database ===');
console.log(`Database File: ${DB_PATH}`);

const db = new DatabaseSync(DB_PATH);

// 1. Create table according to design.md Section 8
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

console.log('Table `weather_forecasts` verified/created successfully.');

// 2. Read CWA forecast data
let rawJson;
if (fs.existsSync(SAMPLE_JSON_PATH)) {
  console.log(`Loading forecast data from: ${SAMPLE_JSON_PATH}...`);
  rawJson = JSON.parse(fs.readFileSync(SAMPLE_JSON_PATH, 'utf8'));
} else {
  console.error('Error: sample_cwa_forecast.json not found.');
  process.exit(1);
}

// 3. Coordinate reference table for all 22 counties
const GEO_COORDS = {
  '基隆市': { region: '北部', lat: 25.1276, lng: 121.7392 },
  '臺北市': { region: '北部', lat: 25.0375, lng: 121.5637 },
  '新北市': { region: '北部', lat: 25.0117, lng: 121.4658 },
  '桃園市': { region: '北部', lat: 24.9936, lng: 121.3010 },
  '新竹市': { region: '北部', lat: 24.8138, lng: 120.9675 },
  '新竹縣': { region: '北部', lat: 24.8387, lng: 121.0177 },
  '苗栗縣': { region: '中部', lat: 24.5602, lng: 120.8214 },
  '臺中市': { region: '中部', lat: 24.1627, lng: 120.6473 },
  '彰化縣': { region: '中部', lat: 24.0754, lng: 120.5445 },
  '南投縣': { region: '中部', lat: 23.9609, lng: 120.9719 },
  '雲林縣': { region: '中部', lat: 23.7092, lng: 120.4313 },
  '嘉義市': { region: '南部', lat: 23.4800, lng: 120.4491 },
  '嘉義縣': { region: '南部', lat: 23.4518, lng: 120.2559 },
  '臺南市': { region: '南部', lat: 22.9997, lng: 120.2270 },
  '高雄市': { region: '南部', lat: 22.6273, lng: 120.3014 },
  '屏東縣': { region: '南部', lat: 22.6828, lng: 120.4908 },
  '宜蘭縣': { region: '東部', lat: 24.7570, lng: 121.7530 },
  '花蓮縣': { region: '東部', lat: 23.9912, lng: 121.6196 },
  '臺東縣': { region: '東部', lat: 22.7583, lng: 121.1444 },
  '澎湖縣': { region: '離島', lat: 23.5712, lng: 119.5793 },
  '金門縣': { region: '離島', lat: 24.4492, lng: 118.3766 },
  '連江縣': { region: '離島', lat: 26.1505, lng: 119.9499 }
};

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

const fetchedAt = new Date().toISOString();
let totalInserted = 0;

const locations = rawJson.records?.location || [];
console.log(`Processing ${locations.length} locations...`);

for (const loc of locations) {
  const locName = loc.locationName;
  const geo = GEO_COORDS[locName] || { region: '中部', lat: 23.97, lng: 120.98 };

  const elemMap = {};
  for (const elem of loc.weatherElement) {
    elemMap[elem.elementName] = elem.time || [];
  }

  const wx = elemMap['Wx'] || [];
  const pop = elemMap['PoP'] || [];
  const minT = elemMap['MinT'] || [];
  const maxT = elemMap['MaxT'] || [];
  const ci = elemMap['CI'] || [];

  const count = Math.max(wx.length, pop.length, minT.length);

  for (let i = 0; i < count; i++) {
    const startTime = wx[i]?.startTime || new Date().toISOString();
    const endTime = wx[i]?.endTime || new Date().toISOString();
    const weatherDesc = wx[i]?.parameter?.parameterName || '多雲';
    const rainProb = parseInt(pop[i]?.parameter?.parameterName || '0', 10);
    const minTemp = parseFloat(minT[i]?.parameter?.parameterName || '22');
    const maxTemp = parseFloat(maxT[i]?.parameter?.parameterName || '28');
    const avgTemp = Math.round((minTemp + maxTemp) / 2);
    const comfort = ci[i]?.parameter?.parameterName || '舒適';

    upsertStmt.run(
      locName,
      geo.region,
      startTime,
      endTime,
      avgTemp,
      isNaN(minTemp) ? 22 : minTemp,
      isNaN(maxTemp) ? 28 : maxTemp,
      isNaN(rainProb) ? 0 : rainProb,
      weatherDesc,
      comfort,
      geo.lat,
      geo.lng,
      'CWA F-C0032-001',
      fetchedAt
    );
    totalInserted++;
  }
}

console.log(`Successfully stored ${totalInserted} forecast records into Database!`);

// Query verification
const countRow = db.prepare('SELECT count(*) as total, count(DISTINCT location_name) as locs FROM weather_forecasts').get();
console.log(`\n=== Database Status ===`);
console.log(`Total Records: ${countRow.total}`);
console.log(`Unique Locations: ${countRow.locs}`);

const sampleRows = db.prepare('SELECT id, location_name, region, forecast_start_time, temperature, min_temperature, max_temperature, weather_description FROM weather_forecasts LIMIT 5').all();
console.log('\nSample Records from DB:');
console.table(sampleRows);
