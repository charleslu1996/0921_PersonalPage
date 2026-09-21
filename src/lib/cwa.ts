import { CountyWeather, WeatherForecastPeriod } from '../types/weather';
import { getLocationMeta } from './taiwanGeo';

interface CwaTimeElement {
  startTime: string;
  endTime: string;
  parameter: {
    parameterName: string;
    parameterValue?: string;
    parameterUnit?: string;
  };
}

interface CwaWeatherElement {
  elementName: string;
  time: CwaTimeElement[];
}

interface CwaLocation {
  locationName: string;
  weatherElement: CwaWeatherElement[];
}

interface CwaApiResponse {
  success: string;
  result?: {
    resource_id: string;
    fields: Array<{ id: string; type: string }>;
  };
  records: {
    datasetDescription: string;
    location: CwaLocation[];
  };
}

// In-memory cache to respect API rate limits
let cachedData: {
  timestamp: number;
  datasetDescription: string;
  data: CountyWeather[];
} | null = null;

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

export async function fetchCwaForecasts(forceRefresh = false): Promise<{
  datasetDescription: string;
  updatedAt: string;
  data: CountyWeather[];
}> {
  const now = Date.now();
  if (!forceRefresh && cachedData && now - cachedData.timestamp < CACHE_TTL_MS) {
    return {
      datasetDescription: cachedData.datasetDescription,
      updatedAt: new Date(cachedData.timestamp).toISOString(),
      data: cachedData.data,
    };
  }

  const apiKey = process.env.CWA_API_KEY;
  if (!apiKey) {
    throw new Error('CWA_API_KEY is not configured in server environment variables.');
  }

  const baseUrl = process.env.CWA_API_BASE_URL || 'https://opendata.cwa.gov.tw/api/v1/rest/datastore';
  const url = `${baseUrl}/F-C0032-001?Authorization=${apiKey}&format=JSON`;

  const response = await fetch(url, {
    next: { revalidate: 600 },
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`CWA API responded with HTTP status ${response.status}: ${response.statusText}`);
  }

  const rawJson = (await response.json()) as CwaApiResponse;
  if (rawJson.success !== 'true') {
    throw new Error(`CWA API returned failure status`);
  }

  const locations = rawJson.records?.location || [];
  const normalized: CountyWeather[] = locations.map((loc) => {
    const meta = getLocationMeta(loc.locationName);

    // Map weather elements by elementName
    const elementMap: Record<string, CwaTimeElement[]> = {};
    for (const elem of loc.weatherElement) {
      elementMap[elem.elementName] = elem.time || [];
    }

    const wxTimes = elementMap['Wx'] || [];
    const popTimes = elementMap['PoP'] || [];
    const minTTimes = elementMap['MinT'] || [];
    const maxTTimes = elementMap['MaxT'] || [];
    const ciTimes = elementMap['CI'] || [];

    // Length of periods (typically 3 periods for 36-hour forecast)
    const periodCount = Math.max(wxTimes.length, popTimes.length, minTTimes.length, 1);
    const forecasts: WeatherForecastPeriod[] = [];

    for (let i = 0; i < periodCount; i++) {
      const wx = wxTimes[i]?.parameter?.parameterName || '多雲';
      const wxCode = wxTimes[i]?.parameter?.parameterValue || '01';
      const pop = parseInt(popTimes[i]?.parameter?.parameterName || '0', 10);
      const minTemp = parseFloat(minTTimes[i]?.parameter?.parameterName || '22');
      const maxTemp = parseFloat(maxTTimes[i]?.parameter?.parameterName || '28');
      const comfort = ciTimes[i]?.parameter?.parameterName || '舒適';

      forecasts.push({
        startTime: wxTimes[i]?.startTime || new Date().toISOString(),
        endTime: wxTimes[i]?.endTime || new Date().toISOString(),
        weather: wx,
        weatherCode: wxCode,
        rainProb: isNaN(pop) ? 0 : pop,
        minTemp: isNaN(minTemp) ? 22 : minTemp,
        maxTemp: isNaN(maxTemp) ? 28 : maxTemp,
        comfort: comfort,
      });
    }

    return {
      locationName: loc.locationName,
      region: meta.region,
      latitude: meta.lat,
      longitude: meta.lng,
      forecasts: forecasts,
      current: forecasts[0] || {
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        weather: '晴天',
        weatherCode: '01',
        rainProb: 10,
        minTemp: 22,
        maxTemp: 28,
        comfort: '舒適',
      },
    };
  });

  cachedData = {
    timestamp: now,
    datasetDescription: rawJson.records?.datasetDescription || '三十六小時天氣預報',
    data: normalized,
  };

  return {
    datasetDescription: cachedData.datasetDescription,
    updatedAt: new Date(now).toISOString(),
    data: normalized,
  };
}
