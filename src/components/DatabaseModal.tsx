'use client';

import React, { useState, useEffect } from 'react';
import { Database, X, RefreshCw, CheckCircle2, HardDrive } from 'lucide-react';
import { DbWeatherRecord } from '@/lib/db';

interface DatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DatabaseModal({ isOpen, onClose }: DatabaseModalProps) {
  const [records, setRecords] = useState<DbWeatherRecord[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<string>('');

  const fetchDbData = async (location = '') => {
    try {
      setLoading(true);
      const url = location ? `/api/db?location=${encodeURIComponent(location)}` : '/api/db';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setRecords(data.data);
        setStats(data.stats);
      }
    } catch (e) {
      console.error('Failed to load DB data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDbData(selectedLocation);
    }
  }, [isOpen, selectedLocation]);

  if (!isOpen) return null;

  return (
    <div className="db-modal-backdrop" onClick={onClose}>
      <div className="db-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="db-modal-header">
          <div className="db-modal-title">
            <Database className="text-cyan-400" size={22} />
            <div>
              <h3>氣象資料庫紀錄 (Database: weather_forecasts)</h3>
              <p>依據 design.md Section 8 標準規格儲存之氣象觀測與預報資料庫</p>
            </div>
          </div>
          <button className="db-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Stats Summary Cards */}
        {stats && (
          <div className="db-stats-bar">
            <div className="db-stat-item">
              <span className="lbl">資料表名稱</span>
              <span className="val highlight">weather_forecasts</span>
            </div>
            <div className="db-stat-item">
              <span className="lbl">總預報紀錄數</span>
              <span className="val">{stats.totalRecords} 筆</span>
            </div>
            <div className="db-stat-item">
              <span className="lbl">涵蓋行政區</span>
              <span className="val">{stats.uniqueLocations} 縣市</span>
            </div>
            <div className="db-stat-item">
              <span className="lbl">資料庫檔案</span>
              <span className="val">{stats.databaseFile}</span>
            </div>
            <div className="db-stat-item">
              <button
                className="btn-db-refresh"
                onClick={() => fetchDbData(selectedLocation)}
                disabled={loading}
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                <span>重新整理</span>
              </button>
            </div>
          </div>
        )}

        {/* Filter bar */}
        <div className="db-filter-bar">
          <input
            type="text"
            placeholder="過濾特定縣市 (例: 臺北市、高雄市)..."
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="db-search-input"
          />
          <span className="db-record-count">顯示 {records.length} 筆資料</span>
        </div>

        {/* Records Table */}
        <div className="db-table-scroll">
          <table className="db-data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>縣市名稱</th>
                <th>分區</th>
                <th>預報起始時間</th>
                <th>氣溫 (均/低/高)</th>
                <th>降雨率</th>
                <th>天氣狀況</th>
                <th>舒適度</th>
                <th>資料來源</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={`${r.id}-${r.location_name}-${r.forecast_start_time}`}>
                  <td className="text-muted">#{r.id}</td>
                  <td className="font-bold text-white">{r.location_name}</td>
                  <td><span className="badge-region">{r.region}</span></td>
                  <td className="text-time">{r.forecast_start_time}</td>
                  <td>
                    <span className="text-white font-bold">{r.temperature}°C</span>{' '}
                    <span className="text-muted text-xs">({r.min_temperature}°~{r.max_temperature}°)</span>
                  </td>
                  <td className="text-cyan font-bold">{r.precipitation_probability}%</td>
                  <td>{r.weather_description}</td>
                  <td className="text-muted">{r.comfort_index}</td>
                  <td className="text-muted text-xs">{r.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
