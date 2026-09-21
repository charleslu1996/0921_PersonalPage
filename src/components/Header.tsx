'use client';

import React, { useState, useEffect } from 'react';
import { CloudSun, RefreshCw, Activity, ShieldCheck, Clock, Database } from 'lucide-react';

interface HeaderProps {
  updatedAt?: string;
  onRefresh: () => void;
  isRefreshing: boolean;
  onOpenDb?: () => void;
}

export default function Header({ updatedAt, onRefresh, isRefreshing, onOpenDb }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('zh-TW', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedUpdate = updatedAt
    ? new Date(updatedAt).toLocaleTimeString('zh-TW', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '--:--';

  return (
    <header className="site-header">
      <div className="header-left">
        <div className="brand-badge">
          <CloudSun className="brand-icon" size={28} />
          <div>
            <h1 className="brand-title">Taiwan Weather GIS Web</h1>
            <p className="brand-subtitle">AIoT DIC-2 • 台灣即時氣象空間資訊儀表板</p>
          </div>
        </div>
      </div>

      <div className="header-right">
        <div className="status-pill online">
          <Activity size={14} className="pulse-icon" />
          <span>CWA API 連線正常</span>
        </div>

        <div className="time-display">
          <Clock size={14} />
          <span>{currentTime || 'Loading...'} (UTC+8)</span>
        </div>

        <div className="update-tag">
          <span>氣象發布: {formattedUpdate}</span>
        </div>

        {onOpenDb && (
          <button
            onClick={onOpenDb}
            className="btn-open-db"
            title="檢視本地氣象資料庫紀錄 (weather_forecasts)"
            id="btn-open-database"
          >
            <Database size={16} />
            <span>氣象資料庫</span>
          </button>
        )}

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className={`refresh-btn ${isRefreshing ? 'spinning' : ''}`}
          title="重新整理氣象資料"
          id="btn-refresh-weather"
        >
          <RefreshCw size={16} />
          <span>{isRefreshing ? '更新中...' : '即時同步'}</span>
        </button>
      </div>
    </header>
  );
}
