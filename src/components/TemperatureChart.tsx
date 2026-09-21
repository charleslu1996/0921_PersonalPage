'use client';

import React from 'react';
import { CountyWeather } from '@/types/weather';
import { TrendingUp, BarChart3 } from 'lucide-react';

interface TemperatureChartProps {
  county: CountyWeather | null;
}

export default function TemperatureChart({ county }: TemperatureChartProps) {
  if (!county || !county.forecasts || county.forecasts.length === 0) {
    return null;
  }

  const forecasts = county.forecasts;
  const temps = forecasts.flatMap((f) => [f.minTemp, f.maxTemp]);
  const minBound = Math.min(...temps) - 2;
  const maxBound = Math.max(...temps) + 2;
  const range = maxBound - minBound || 1;

  const chartWidth = 500;
  const chartHeight = 160;
  const paddingX = 50;
  const paddingY = 25;

  const getX = (index: number) => {
    if (forecasts.length <= 1) return chartWidth / 2;
    return paddingX + (index * (chartWidth - paddingX * 2)) / (forecasts.length - 1);
  };

  const getY = (temp: number) => {
    return chartHeight - paddingY - ((temp - minBound) / range) * (chartHeight - paddingY * 2);
  };

  // Build SVG paths for max and min temperatures
  const maxPoints = forecasts.map((f, i) => `${getX(i)},${getY(f.maxTemp)}`).join(' ');
  const minPoints = forecasts.map((f, i) => `${getX(i)},${getY(f.minTemp)}`).join(' ');

  return (
    <div className="temperature-chart-card">
      <div className="chart-header">
        <div className="chart-title">
          <TrendingUp size={16} className="text-amber-400" />
          <span>{county.locationName} • 36小時氣溫走勢圖</span>
        </div>
        <div className="chart-legend">
          <span className="legend-indicator max">最高溫 (°C)</span>
          <span className="legend-indicator min">最低溫 (°C)</span>
        </div>
      </div>

      <div className="svg-container">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="chart-svg"
          preserveAspectRatio="none"
        >
          {/* Subtle horizontal grid lines */}
          <line
            x1={paddingX}
            y1={paddingY}
            x2={chartWidth - paddingX}
            y2={paddingY}
            stroke="rgba(255,255,255,0.08)"
            strokeDasharray="4"
          />
          <line
            x1={paddingX}
            y1={chartHeight / 2}
            x2={chartWidth - paddingX}
            y2={chartHeight / 2}
            stroke="rgba(255,255,255,0.08)"
            strokeDasharray="4"
          />
          <line
            x1={paddingX}
            y1={chartHeight - paddingY}
            x2={chartWidth - paddingX}
            y2={chartHeight - paddingY}
            stroke="rgba(255,255,255,0.08)"
            strokeDasharray="4"
          />

          {/* Connect Min/Max area */}
          <polygon
            points={`${forecasts.map((f, i) => `${getX(i)},${getY(f.maxTemp)}`).join(' ')} ${[
              ...forecasts,
            ]
              .reverse()
              .map((f, i) => `${getX(forecasts.length - 1 - i)},${getY(f.minTemp)}`)
              .join(' ')}`}
            fill="url(#tempGradient)"
            opacity="0.25"
          />

          <defs>
            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Polyline for MaxTemp */}
          <polyline
            fill="none"
            stroke="#f59e0b"
            strokeWidth="3"
            points={maxPoints}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Polyline for MinTemp */}
          <polyline
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3"
            points={minPoints}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {forecasts.map((f, i) => {
            const x = getX(i);
            const yMax = getY(f.maxTemp);
            const yMin = getY(f.minTemp);
            const start = new Date(f.startTime);
            const timeStr = `${start.getHours().toString().padStart(2, '0')}:00`;

            return (
              <g key={i}>
                {/* Max Dot */}
                <circle cx={x} cy={yMax} r="5" fill="#f59e0b" stroke="#1e293b" strokeWidth="2" />
                <text x={x} y={yMax - 8} textAnchor="middle" fill="#f59e0b" fontSize="11" fontWeight="bold">
                  {f.maxTemp}°
                </text>

                {/* Min Dot */}
                <circle cx={x} cy={yMin} r="5" fill="#38bdf8" stroke="#1e293b" strokeWidth="2" />
                <text x={x} y={yMin + 16} textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">
                  {f.minTemp}°
                </text>

                {/* Time Label */}
                <text x={x} y={chartHeight - 4} textAnchor="middle" fill="#94a3b8" fontSize="10">
                  {timeStr}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
