'use client';

import React, { useEffect, useRef } from 'react';
import { CountyWeather } from '@/types/weather';
import 'leaflet/dist/leaflet.css';

interface TaiwanMapProps {
  counties: CountyWeather[];
  selectedCounty: string;
  onSelectCounty: (countyName: string) => void;
}

export default function TaiwanMap({
  counties,
  selectedCounty,
  onSelectCounty,
}: TaiwanMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [name: string]: any }>({});

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    // Dynamic import to avoid SSR issues
    import('leaflet').then((L) => {
      if (!mapContainerRef.current) return;

      // Fix Leaflet's default icon path issues
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      // Initialize map centered on Taiwan
      const map = L.map(mapContainerRef.current, {
        center: [23.8, 120.95],
        zoom: 7.4,
        minZoom: 6,
        maxZoom: 13,
        zoomControl: false,
      });

      // Zoom control in top right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Dark/Sleek OpenStreetMap CartoDB dark tile layer
      const tileUrl =
        process.env.NEXT_PUBLIC_MAP_TILE_URL ||
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

      L.tileLayer(tileUrl, {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
      renderMarkers(L, map);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update or render markers whenever counties or selectedCounty changes
  const renderMarkers = (L: any, map: any) => {
    // Clear old markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    counties.forEach((c) => {
      const avgTemp = Math.round((c.current.minTemp + c.current.maxTemp) / 2);
      const isSelected = c.locationName === selectedCounty;

      // Determine temp color gradient class
      let tempClass = 'temp-warm';
      if (avgTemp >= 30) tempClass = 'temp-hot';
      else if (avgTemp <= 20) tempClass = 'temp-cool';

      const html = `
        <div class="custom-gis-marker ${tempClass} ${isSelected ? 'selected' : ''}">
          <div class="marker-pin">
            <span class="marker-name">${c.locationName.replace(/(市|縣)/, '')}</span>
            <span class="marker-temp">${avgTemp}°</span>
          </div>
          <div class="marker-pulse"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-leaflet-div-icon',
        html: html,
        iconSize: [64, 40],
        iconAnchor: [32, 38],
        popupAnchor: [0, -36],
      });

      const marker = L.marker([c.latitude, c.longitude], { icon: customIcon }).addTo(map);

      const popupHtml = `
        <div class="gis-popup-card">
          <div class="popup-title">${c.locationName} <span class="popup-region">(${c.region})</span></div>
          <div class="popup-weather">${c.current.weather}</div>
          <div class="popup-grid">
            <div><span class="lbl">氣溫:</span> <strong>${c.current.minTemp}°C ~ ${c.current.maxTemp}°C</strong></div>
            <div><span class="lbl">降雨率:</span> <strong>${c.current.rainProb}%</strong></div>
            <div><span class="lbl">舒適度:</span> <strong>${c.current.comfort}</strong></div>
            <div><span class="lbl">座標:</span> ${c.latitude.toFixed(2)}°N, ${c.longitude.toFixed(2)}°E</div>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { className: 'custom-gis-popup' });

      marker.on('click', () => {
        onSelectCounty(c.locationName);
      });

      markersRef.current[c.locationName] = marker;
    });
  };

  // Re-run marker styling when selectedCounty changes
  useEffect(() => {
    import('leaflet').then((L) => {
      if (mapInstanceRef.current) {
        renderMarkers(L, mapInstanceRef.current);

        // Center map smoothly on selected county
        const selected = counties.find((c) => c.locationName === selectedCounty);
        if (selected) {
          mapInstanceRef.current.panTo([selected.latitude, selected.longitude], {
            animate: true,
            duration: 0.8,
          });

          // Open popup
          const marker = markersRef.current[selected.locationName];
          if (marker) {
            marker.openPopup();
          }
        }
      }
    });
  }, [selectedCounty, counties]);

  return (
    <div className="gis-map-wrapper">
      <div className="map-toolbar">
        <div className="map-title-badge">
          <span>GIS 台灣各行政區氣象點位圖層</span>
        </div>
        <div className="map-legend">
          <span className="legend-item"><span className="legend-dot cool"></span>&le;20°C 偏涼</span>
          <span className="legend-item"><span className="legend-dot warm"></span>21-29°C 舒適</span>
          <span className="legend-item"><span className="legend-dot hot"></span>&ge;30°C 炎熱</span>
        </div>
      </div>
      <div ref={mapContainerRef} className="leaflet-map-canvas" id="taiwan-leaflet-map" />
    </div>
  );
}
