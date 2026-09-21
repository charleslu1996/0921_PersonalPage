# Taiwan Weather GIS Web (AIoT DIC-2)

An interactive, real-time GIS web application and weather dashboard built for Taiwan's Central Weather Administration (CWA) Open Data, developed with Next.js, TypeScript, and Leaflet.

---

## Description

**Taiwan Weather GIS Web** is a full-stack open-data GIS platform designed to collect, validate, and visualize meteorological forecast data across Taiwan. By interfacing directly with the Central Weather Administration (CWA) Open Data API, the application normalizes 36-hour forecasts across all 22 administrative divisions and maps them onto an interactive Leaflet GIS interface.

The platform combines geospatial visualization with analytical dashboard cards, offering instant insights into temperature ranges, precipitation probabilities, comfort indexes, and multi-period forecast trends. Built with security and scalability in mind, it encapsulates API credentials behind Next.js server-side route handlers with built-in caching, ready for continuous deployment through GitHub and Vercel.

---

## Features

- **Official CWA Open Data Integration**: Retrieves real-time 36-hour meteorological forecasts across all 22 Taiwan counties and municipalities using the CWA `F-C0032-001` dataset.
- **Interactive Taiwan GIS Map**: Rendered with Leaflet and CartoDB/OpenStreetMap tiles, centered on Taiwan with customized WGS84 coordinate pins for every administrative region.
- **Dynamic Temperature Badges**: Map markers display real-time average temperatures with adaptive color indicators (≤20°C cool blue, 21–29°C comfortable green, ≥30°C warm amber) and pulsing focal animations.
- **Bi-Directional Geospatial Linkage**: Clicking any marker on the map pans smoothly to that region, opens an informative popup, and immediately updates the weather hero cards and charts.
- **Comprehensive Weather Metrics**:
  - Main temperature display with high/low bounds.
  - Precipitation probability progress indicator (PoP%).
  - CWA comfort index classification (CI).
  - 36-hour three-period forecast timeline cards.
- **SVG Temperature Trend Visualization**: Native, high-performance SVG area and line chart comparing minimum and maximum temperature curves over time periods.
- **22-County Sortable Summary Table**: Searchable and multi-column sortable table (by region, temperature, or rain probability) with direct "Locate" interaction.
- **Secure Backend API & Smart Caching**:
  - `/api/weather`: Server-side API gateway protecting API keys, with an in-memory 10-minute cache (TTL) to avoid exceeding CWA rate limits.
  - `/api/health`: Health monitoring endpoint checking server status and CWA configuration.
- **Modern Dark Glassmorphic Design**: Tailored CSS custom properties, responsive grid layout, micro-interactions, and typography optimized for desktop and mobile viewports.

---

## Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router) | Full-stack React framework and server-side API routes |
| **UI Library** | [React 18](https://react.dev/) | Component-driven user interface architecture |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | End-to-end type safety and structured schemas |
| **GIS & Mapping** | [Leaflet](https://leafletjs.com/) | Geospatial map rendering, custom HTML markers, and popups |
| **Data Provider** | [CWA Open Data Platform](https://opendata.cwa.gov.tw/) | Official Taiwan government weather dataset (`F-C0032-001`) |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, consistent vector iconography |
| **Styling** | Vanilla CSS3 (Custom Design System) | Glassmorphism, CSS variables, keyframe animations, dark theme |
| **Deployment** | [Vercel](https://vercel.com/) / [GitHub](https://github.com/) | CI/CD automation and production hosting |

---

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.17.0 or higher; v20+ recommended)
- A Central Weather Administration (CWA) Open Data API Key ([Register here](https://opendata.cwa.gov.tw/user/authkey))

### Setup Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/charleslu1996/0921_PersonalPage.git
   cd 0921_PersonalPage
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```
   *(Note for Windows PowerShell users: if script execution policies block `npm`, run `cmd /c npm install` or `npm.cmd install`)*

3. **Configure Environment Variables:**
   Copy the example environment file and insert your CWA API Key:
   ```bash
   cp .env.example .env.local
   ```
   Open `.env.local` and add your key:
   ```env
   CWA_API_KEY=your_actual_cwa_api_key_here
   CWA_API_BASE_URL=https://opendata.cwa.gov.tw/api/v1/rest/datastore
   NEXT_PUBLIC_MAP_TILE_URL=https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png
   ```

---

## Usage

### Running Locally

- **Development Server:**
  ```bash
  npm run dev
  ```
  Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

- **Production Build & Execution:**
  ```bash
  npm run build
  npm start
  ```

---

### Application Features & Examples

1. **Interactive GIS Dashboard (`http://localhost:3000`):**
   - Click any county pin on the Taiwan map (e.g., **臺中市**, **花蓮縣**, or **高雄市**) to inspect local conditions and view the temperature trend graph.
   - Use the zone filter buttons (**全台灣**, **北部**, **中部**, **南部**, **東部**, **離島**) or the search bar to locate specific areas.
   - Click the **即時同步** (Sync) button in the header to force a fresh data fetch from the CWA API.

2. **Backend API Endpoints:**
   - **All 22 Counties Weather Data:**
     ```bash
     curl http://localhost:3000/api/weather
     ```
   - **Filter by Specific County:**
     ```bash
     curl "http://localhost:3000/api/weather?location=臺中市"
     ```
   - **Force Cache Refresh:**
     ```bash
     curl "http://localhost:3000/api/weather?refresh=true"
     ```
   - **Service Health Check:**
     ```bash
     curl http://localhost:3000/api/health
     ```

#### Example API Response (`/api/weather?location=臺中市`):
```json
{
  "success": true,
  "datasetDescription": "三十六小時天氣預報",
  "updatedAt": "2026-09-21T12:23:55.000Z",
  "data": [
    {
      "locationName": "臺中市",
      "region": "中部",
      "latitude": 24.1627,
      "longitude": 120.6473,
      "current": {
        "startTime": "2026-09-21T18:00:00+08:00",
        "endTime": "2026-09-22T06:00:00+08:00",
        "weather": "晴時多雲",
        "weatherCode": "02",
        "rainProb": 10,
        "minTemp": 24,
        "maxTemp": 29,
        "comfort": "舒適至悶熱"
      },
      "forecasts": [ ... ]
    }
  ]
}
```
