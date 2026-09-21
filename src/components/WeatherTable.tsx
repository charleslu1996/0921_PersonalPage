'use client';

import React, { useState, useMemo } from 'react';
import { CountyWeather } from '@/types/weather';
import { ArrowUpDown, CloudRain, Droplets, MapPin } from 'lucide-react';
import { getWeatherIcon } from './WeatherCard';

interface WeatherTableProps {
  counties: CountyWeather[];
  selectedCounty: string;
  onSelectCounty: (countyName: string) => void;
}

type SortField = 'location' | 'region' | 'temp' | 'rainProb';

export default function WeatherTable({
  counties,
  selectedCounty,
  onSelectCounty,
}: WeatherTableProps) {
  const [sortField, setSortField] = useState<SortField>('temp');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const sortedCounties = useMemo(() => {
    const list = [...counties];
    list.sort((a, b) => {
      let valA: any;
      let valB: any;

      if (sortField === 'location') {
        valA = a.locationName;
        valB = b.locationName;
        return sortAsc ? valA.localeCompare(valB, 'zh-Hant') : valB.localeCompare(valA, 'zh-Hant');
      } else if (sortField === 'region') {
        valA = a.region;
        valB = b.region;
        return sortAsc ? valA.localeCompare(valB, 'zh-Hant') : valB.localeCompare(valA, 'zh-Hant');
      } else if (sortField === 'temp') {
        valA = (a.current.minTemp + a.current.maxTemp) / 2;
        valB = (b.current.minTemp + b.current.maxTemp) / 2;
      } else if (sortField === 'rainProb') {
        valA = a.current.rainProb;
        valB = b.current.rainProb;
      }

      return sortAsc ? valA - valB : valB - valA;
    });
    return list;
  }, [counties, sortField, sortAsc]);

  return (
    <div className="weather-table-card">
      <div className="table-header-title">
        <div className="title-left">
          <MapPin size={18} className="text-sky-400" />
          <span>全台 22 縣市氣象綜合數據表</span>
        </div>
        <div className="title-right text-muted">
          點擊欄位進行排序 • 點擊縣市聯動 GIS 地圖
        </div>
      </div>

      <div className="table-responsive-wrapper">
        <table className="custom-weather-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('location')} className="cursor-pointer">
                <div className="th-content">
                  <span>行政區</span>
                  <ArrowUpDown size={12} />
                </div>
              </th>
              <th onClick={() => handleSort('region')} className="cursor-pointer">
                <div className="th-content">
                  <span>分區</span>
                  <ArrowUpDown size={12} />
                </div>
              </th>
              <th>天氣概況</th>
              <th onClick={() => handleSort('temp')} className="cursor-pointer">
                <div className="th-content">
                  <span>氣溫範圍</span>
                  <ArrowUpDown size={12} />
                </div>
              </th>
              <th onClick={() => handleSort('rainProb')} className="cursor-pointer">
                <div className="th-content">
                  <span>降雨機率</span>
                  <ArrowUpDown size={12} />
                </div>
              </th>
              <th>舒適度指數</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {sortedCounties.map((c) => {
              const isSelected = c.locationName === selectedCounty;
              const avgTemp = Math.round((c.current.minTemp + c.current.maxTemp) / 2);

              return (
                <tr
                  key={c.locationName}
                  className={`table-row ${isSelected ? 'row-selected' : ''}`}
                  onClick={() => onSelectCounty(c.locationName)}
                  id={`table-row-${c.locationName}`}
                >
                  <td className="font-bold text-white">
                    {c.locationName}
                  </td>
                  <td>
                    <span className="badge-region">{c.region}</span>
                  </td>
                  <td>
                    <div className="weather-inline">
                      <span className="icon-sm">{getWeatherIcon(c.current.weather)}</span>
                      <span>{c.current.weather}</span>
                    </div>
                  </td>
                  <td>
                    <div className="temp-range-inline">
                      <span className="avg-temp">{avgTemp}°C</span>
                      <span className="sub-range">
                        ({c.current.minTemp}° ~ {c.current.maxTemp}°)
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="rain-inline">
                      <Droplets size={14} className="text-sky-400" />
                      <span>{c.current.rainProb}%</span>
                    </div>
                  </td>
                  <td className="text-muted">{c.current.comfort}</td>
                  <td>
                    <button
                      type="button"
                      className="btn-inspect"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCounty(c.locationName);
                      }}
                    >
                      定位查看
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
