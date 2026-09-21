'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import RegionSelector from '@/components/RegionSelector';
import WeatherCard from '@/components/WeatherCard';
import TemperatureChart from '@/components/TemperatureChart';
import WeatherTable from '@/components/WeatherTable';
import { LoadingState, ErrorMessage } from '@/components/LoadingState';
import { CountyWeather, RegionZone, WeatherApiResponse } from '@/types/weather';
import { Layers } from 'lucide-react';

// Dynamic import for Leaflet GIS Map to disable SSR
const TaiwanMap = dynamic(() => import('@/components/TaiwanMap'), {
  ssr: false,
  loading: () => (
    <div className="gis-map-wrapper">
      <LoadingState message="初始化 Leaflet GIS 台灣氣象空間圖層中..." />
    </div>
  ),
});

export default function HomePage() {
  const [counties, setCounties] = useState<CountyWeather[]>([]);
  const [selectedCountyName, setSelectedCountyName] = useState<string>('臺中市');
  const [selectedZone, setSelectedZone] = useState<RegionZone | '全部'>('全部');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [updatedAt, setUpdatedAt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchWeather = useCallback(async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setIsRefreshing(true);
      else setIsLoading(true);
      setErrorMessage(null);

      const url = isManualRefresh ? '/api/weather?refresh=true' : '/api/weather';
      const res = await fetch(url);
      const json: WeatherApiResponse = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || `HTTP ${res.status}: 無法取得氣象資料`);
      }

      setCounties(json.data);
      setUpdatedAt(json.updatedAt);

      // If selected county is not in data, default to first
      if (json.data.length > 0) {
        const found = json.data.find((c) => c.locationName === selectedCountyName);
        if (!found) {
          setSelectedCountyName(json.data[0].locationName);
        }
      }
    } catch (err: any) {
      console.error('Fetch weather failed:', err);
      setErrorMessage(err.message || '連線中央氣象署 API 發生異常');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [selectedCountyName]);

  useEffect(() => {
    fetchWeather(false);
  }, []);

  // Filtered counties by zone and search query
  const filteredCounties = useMemo(() => {
    return counties.filter((c) => {
      const matchZone = selectedZone === '全部' || c.region === selectedZone;
      const matchSearch =
        searchTerm.trim() === '' ||
        c.locationName.includes(searchTerm.trim()) ||
        c.region.includes(searchTerm.trim());
      return matchZone && matchSearch;
    });
  }, [counties, selectedZone, searchTerm]);

  // Selected County Object
  const selectedCounty = useMemo(() => {
    return (
      counties.find((c) => c.locationName === selectedCountyName) ||
      counties[0] ||
      null
    );
  }, [counties, selectedCountyName]);

  return (
    <div className="app-wrapper">
      <Header
        updatedAt={updatedAt}
        onRefresh={() => fetchWeather(true)}
        isRefreshing={isRefreshing}
      />

      <main className="main-container">
        {isLoading ? (
          <LoadingState message="正在連線台灣中央氣象署 (CWA) 獲取 22 縣市最新預報數據..." />
        ) : errorMessage ? (
          <ErrorMessage
            message={errorMessage}
            onRetry={() => fetchWeather(true)}
          />
        ) : (
          <>
            {/* Filter Bar */}
            <RegionSelector
              selectedZone={selectedZone}
              onSelectZone={(zone) => {
                setSelectedZone(zone);
                // Optionally pick the first county in the new zone
                if (zone !== '全部') {
                  const firstInZone = counties.find((c) => c.region === zone);
                  if (firstInZone) setSelectedCountyName(firstInZone.locationName);
                }
              }}
              selectedCounty={selectedCountyName}
              onSelectCounty={(name) => setSelectedCountyName(name)}
              counties={filteredCounties}
              searchTerm={searchTerm}
              onSearchChange={(val) => setSearchTerm(val)}
            />

            {/* Main Interactive Grid: Left GIS Map, Right Detail & Chart */}
            <div className="dashboard-grid">
              {/* Left Column: Interactive GIS Leaflet Map */}
              <div className="map-column">
                <TaiwanMap
                  counties={filteredCounties}
                  selectedCounty={selectedCountyName}
                  onSelectCounty={(name) => setSelectedCountyName(name)}
                />
              </div>

              {/* Right Column: Hero Weather Card & Temperature Curve */}
              <div className="detail-column">
                <WeatherCard county={selectedCounty} />
                <TemperatureChart county={selectedCounty} />
              </div>
            </div>

            {/* Bottom Section: 22 Counties Summary Table */}
            <div className="table-section">
              <WeatherTable
                counties={filteredCounties}
                selectedCounty={selectedCountyName}
                onSelectCounty={(name) => {
                  setSelectedCountyName(name);
                  // Scroll smoothly to map on mobile
                  if (typeof window !== 'undefined' && window.innerWidth < 768) {
                    window.scrollTo({ top: 180, behavior: 'smooth' });
                  }
                }}
              />
            </div>
          </>
        )}
      </main>

      <footer className="site-footer">
        <div className="footer-links">
          <a
            href="https://opendata.cwa.gov.tw/"
            target="_blank"
            rel="noreferrer"
          >
            中央氣象署開放資料平台 (CWA Open Data)
          </a>
          <span>•</span>
          <a
            href="https://github.com/charleslu1996/0921_PersonalPage"
            target="_blank"
            rel="noreferrer"
          >
            GitHub Repository
          </a>
          <span>•</span>
          <a
            href="https://leafletjs.com/"
            target="_blank"
            rel="noreferrer"
          >
            Leaflet GIS
          </a>
        </div>
        <p>
          AIoT DIC-2 Taiwan Weather GIS Web Application &copy; 2026. 開放資料規範遵循政府資料開放授權條款。
        </p>
      </footer>
    </div>
  );
}
