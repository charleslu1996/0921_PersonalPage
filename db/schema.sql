-- ==============================================================================
-- AIoT DIC-2 Taiwan Weather GIS Web - Database Schema
-- Compatible with PostgreSQL (Supabase / Neon) and SQLite
-- ==============================================================================

CREATE TABLE IF NOT EXISTS weather_forecasts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    location_name VARCHAR(50) NOT NULL,
    region VARCHAR(20) NOT NULL,
    forecast_start_time TEXT NOT NULL,
    forecast_end_time TEXT NOT NULL,
    temperature NUMERIC,
    min_temperature NUMERIC NOT NULL,
    max_temperature NUMERIC NOT NULL,
    precipitation_probability NUMERIC DEFAULT 0,
    weather_description TEXT NOT NULL,
    comfort_index VARCHAR(100),
    latitude NUMERIC NOT NULL,
    longitude NUMERIC NOT NULL,
    source VARCHAR(50) DEFAULT 'CWA F-C0032-001',
    fetched_at TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_location_time UNIQUE (location_name, forecast_start_time)
);

-- Indices for rapid querying by location and time
CREATE INDEX IF NOT EXISTS idx_forecasts_location ON weather_forecasts (location_name);
CREATE INDEX IF NOT EXISTS idx_forecasts_start_time ON weather_forecasts (forecast_start_time);
CREATE INDEX IF NOT EXISTS idx_forecasts_region ON weather_forecasts (region);
