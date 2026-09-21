'use client';

import React from 'react';
import { REGION_ZONES } from '@/lib/taiwanGeo';
import { CountyWeather, RegionZone } from '@/types/weather';
import { MapPin, Search } from 'lucide-react';

interface RegionSelectorProps {
  selectedZone: RegionZone | '全部';
  onSelectZone: (zone: RegionZone | '全部') => void;
  selectedCounty: string;
  onSelectCounty: (countyName: string) => void;
  counties: CountyWeather[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export default function RegionSelector({
  selectedZone,
  onSelectZone,
  selectedCounty,
  onSelectCounty,
  counties,
  searchTerm,
  onSearchChange,
}: RegionSelectorProps) {
  return (
    <div className="region-selector-container">
      <div className="zone-pills">
        {REGION_ZONES.map((zone) => (
          <button
            key={zone.key}
            type="button"
            className={`zone-pill ${selectedZone === zone.key ? 'active' : ''}`}
            onClick={() => onSelectZone(zone.key)}
            id={`zone-pill-${zone.key}`}
          >
            {zone.label}
          </button>
        ))}
      </div>

      <div className="selector-bar">
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="搜尋縣市名稱 (例: 臺中、花蓮...)"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
            id="county-search-input"
          />
        </div>

        <div className="county-select-wrapper">
          <MapPin size={16} className="select-icon" />
          <select
            value={selectedCounty}
            onChange={(e) => onSelectCounty(e.target.value)}
            className="county-dropdown"
            id="county-dropdown-select"
          >
            {counties.map((c) => (
              <option key={c.locationName} value={c.locationName}>
                {c.locationName} ({c.region}) - {c.current.minTemp}° ~ {c.current.maxTemp}°C
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
