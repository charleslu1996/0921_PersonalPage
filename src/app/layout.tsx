import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Taiwan Weather GIS Web | AIoT DIC-2 台灣即時氣象空間資訊平台',
  description:
    '整合台灣中央氣象署 (CWA) 開放資料與 Leaflet 互動式 GIS 地圖，提供全台 22 縣市即時氣候、36小時天氣預報、氣溫走勢圖與空間分佈視覺化。',
  keywords: [
    'Taiwan Weather',
    'GIS',
    '中央氣象署',
    'CWA API',
    'Leaflet',
    '氣象地圖',
    'Next.js',
    '台灣天氣',
  ],
  authors: [{ name: 'Taiwan Weather GIS Team' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
