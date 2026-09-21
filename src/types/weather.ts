export type RegionZone = '北部' | '中部' | '南部' | '東部' | '離島';

export interface WeatherForecastPeriod {
  startTime: string;
  endTime: string;
  weather: string;
  weatherCode: string;
  rainProb: number; // PoP (%)
  minTemp: number; // MinT (°C)
  maxTemp: number; // MaxT (°C)
  comfort: string; // CI
}

export interface CountyWeather {
  locationName: string;
  region: RegionZone;
  latitude: number;
  longitude: number;
  forecasts: WeatherForecastPeriod[];
  current: WeatherForecastPeriod;
}

export interface WeatherApiResponse {
  success: boolean;
  datasetDescription: string;
  updatedAt: string;
  data: CountyWeather[];
  error?: string;
}

export interface HealthResponse {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  cwaConfigured: boolean;
  version: string;
}
