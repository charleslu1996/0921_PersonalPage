'use client';

import React from 'react';
import { CountyWeather } from '@/types/weather';
import {
  Sun,
  CloudRain,
  CloudSun,
  Cloud,
  Droplets,
  Thermometer,
  Wind,
  Smile,
  Calendar,
  Compass,
} from 'lucide-react';

interface WeatherCardProps {
  county: CountyWeather | null;
}

export function getWeatherIcon(weatherDesc: string) {
  if (weatherDesc.includes('雨') || weatherDesc.includes('陣雨') || weatherDesc.includes('雷')) {
    return <CloudRain className="weather-svg rainy" size={40} />;
  }
  if (weatherDesc.includes('晴') && weatherDesc.includes('雲')) {
    return <CloudSun className="weather-svg partly-cloudy" size={40} />;
  }
  if (weatherDesc.includes('晴')) {
    return <Sun className="weather-svg sunny" size={40} />;
  }
  if (weatherDesc.includes('陰') || weatherDesc.includes('多雲')) {
    return <Cloud className="weather-svg cloudy" size={40} />;
  }
  return <Wind className="weather-svg windy" size={40} />;
}

export default function WeatherCard({ county }: WeatherCardProps) {
  if (!county) {
    return (
      <div className="weather-card empty">
        <p>請選擇左側地圖或上方縣市以檢視氣象詳情</p>
      </div>
    );
  }

  const { locationName, region, latitude, longitude, current, forecasts } = county;

  return (
    <div className="weather-card-container">
      <div className="current-weather-hero">
        <div className="hero-header">
          <div>
            <div className="location-tag">
              <span className="region-badge">{region}</span>
              <span className="coord-text">
                {latitude.toFixed(2)}°N, {longitude.toFixed(2)}°E
              </span>
            </div>
            <h2 className="location-name">{locationName}</h2>
          </div>
          <div className="hero-icon-box">{getWeatherIcon(current.weather)}</div>
        </div>

        <div className="temp-hero-row">
          <div className="temp-main">
            <span className="temp-number">
              {Math.round((current.minTemp + current.maxTemp) / 2)}
            </span>
            <span className="temp-unit">°C</span>
          </div>

          <div className="temp-range-box">
            <div className="range-item">
              <span className="label">最低氣溫</span>
              <span className="val low">{current.minTemp}°C</span>
            </div>
            <div className="range-divider"></div>
            <div className="range-item">
              <span className="label">最高氣溫</span>
              <span className="val high">{current.maxTemp}°C</span>
            </div>
          </div>
        </div>

        <div className="weather-desc-pill">
          <span>{current.weather}</span>
        </div>

        <div className="metric-grid">
          <div className="metric-box">
            <div className="metric-header">
              <Droplets size={16} className="metric-icon rain" />
              <span>降雨機率</span>
            </div>
            <div className="metric-value">{current.rainProb}%</div>
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill rain"
                style={{ width: `${Math.min(current.rainProb, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="metric-box">
            <div className="metric-header">
              <Smile size={16} className="metric-icon comfort" />
              <span>舒適度指數</span>
            </div>
            <div className="metric-value text-comfort">{current.comfort}</div>
            <div className="comfort-tag">官方 CWA 指標</div>
          </div>

          <div className="metric-box">
            <div className="metric-header">
              <Compass size={16} className="metric-icon compass" />
              <span>地理分區</span>
            </div>
            <div className="metric-value">{region}行政區</div>
            <div className="comfort-tag">台灣氣象站網</div>
          </div>
        </div>
      </div>

      {/* 36-Hour 3-Period Forecast Timeline */}
      <div className="forecast-timeline-box">
        <div className="timeline-title">
          <Calendar size={16} />
          <span>今明 36 小時預報時段</span>
        </div>
        <div className="periods-list">
          {forecasts.map((f, idx) => {
            const start = new Date(f.startTime);
            const timeLabel = `${start.getMonth() + 1}/${start.getDate()} ${start
              .getHours()
              .toString()
              .padStart(2, '0')}:00`;

            return (
              <div key={idx} className="period-card">
                <div className="period-time">{timeLabel}</div>
                <div className="period-icon">{getWeatherIcon(f.weather)}</div>
                <div className="period-temp">
                  {f.minTemp}° ~ {f.maxTemp}°C
                </div>
                <div className="period-condition">{f.weather}</div>
                <div className="period-pop">💧 {f.rainProb}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
