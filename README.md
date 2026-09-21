# Taiwan Weather GIS Web (AIoT DIC-2)

An interactive, real-time GIS web application and weather dashboard that connects to Taiwan's Central Weather Administration (CWA) Open Data API, processes and stores meteorological records in a relational database, and visualizes geospatial weather data on an interactive Leaflet map.

---

## Description

**Taiwan Weather GIS Web** is a full-stack open-data GIS platform designed to collect, validate, store, and visualize meteorological forecast data across Taiwan. By interfacing directly with the Central Weather Administration (CWA) Open Data API (`F-C0032-001`), the application normalizes 36-hour forecasts across all 22 administrative divisions, persists them into a structured database (`weather_forecasts`), and maps them onto an interactive Leaflet GIS interface.

The platform combines spatial map analysis with an analytical weather dashboard, offering real-time insights into temperature variations, precipitation probabilities, comfort indexes, and multi-period forecast trends. Built with modern security practices, it encapsulates API credentials behind server-side route handlers with built-in caching, and includes an in-app database inspector to audit stored records, fully configured for automated deployment via GitHub and Vercel.

---

## Features

- **Official CWA Open Data Integration**: Retrieves official 36-hour meteorological forecasts across all 22 Taiwan counties and municipalities using the CWA `F-C0032-001` dataset.
- **Relational Database Storage & Deduplication**:
  - Implements a standardized `weather_forecasts` table with unique constraints `(location_name, forecast_start_time)` to ensure automated upsert and deduplication.
  - Zero-configuration local database engine powered by SQLite (`data/weather.db`), with full schema compatibility for PostgreSQL and Supabase.
  - In-app **Database Inspector Modal** to view stored records, row counts, and location-filtered database queries directly in the UI.
- **Interactive Taiwan GIS Map**: Rendered using Leaflet with CartoDB Voyager and OpenStreetMap tiles, centered on Taiwan with accurate WGS84 centroid coordinates for every administrative region.
- **Adaptive Temperature Badges**: Map markers display real-time average temperatures with adaptive color indicators (≤20°C cool blue, 21–29°C comfortable green, ≥30°C warm amber) with subtle pulsing animations.
- **Bi-Directional Geospatial Synchronization**: Clicking any marker on the map smoothly pans to that region, opens an informative popup, and instantly updates the weather hero card, temperature chart, and data table.
- **Comprehensive Weather Metrics**:
  - Main temperature display with high and low bounds.
  - Precipitation probability progress indicator (PoP%).
  - CWA comfort index classification (CI).
  - 36-hour three-period forecast timeline cards.
- **Dynamic SVG Temperature Trends**: Native, high-performance SVG area and line chart comparing minimum and maximum temperature curves over time intervals.
- **Searchable & Sortable Summary Table**: Interactive data table for all 22 counties with multi-column sorting (by location, region, temperature, or rain probability) and one-click map positioning.
- **Secure Backend API & Smart Caching**:
  - `/api/weather`: Server-side API gateway protecting API keys, with an in-memory 10-minute cache (TTL) and automatic database persistence.
  - `/api/db`: Dedicated endpoint to inspect database records and table health statistics.
  - `/api/health`: Health monitoring endpoint checking server readiness and CWA configuration.
- **Modern Dark Glassmorphic Design**: Tailored CSS custom properties, responsive grid layout, micro-interactions, and typography optimized for desktop and mobile viewports.

---

## Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router) | Full-stack React framework and server-side API routes |
| **UI Library** | [React 18](https://react.dev/) | Component-driven user interface architecture |
| **Programming Language** | [TypeScript](https://www.typescriptlang.org/) | End-to-end type safety and structured schemas |
| **GIS & Mapping** | [Leaflet](https://leafletjs.com/) | Geospatial map rendering, custom HTML markers, and popups |
| **Database** | [SQLite](https://www.sqlite.org/) (`node:sqlite`) / PostgreSQL | Relational storage for weather forecast records (`weather_forecasts`) |
| **Data Provider** | [CWA Open Data Platform](https://opendata.cwa.gov.tw/) | Official Taiwan government weather dataset (`F-C0032-001`) |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, consistent vector iconography |
| **Styling** | Vanilla CSS3 (Custom Design System) | Glassmorphism, CSS variables, keyframe animations, dark theme |
| **Deployment** | [Vercel](https://vercel.com/) / [GitHub](https://github.com/) | CI/CD automation and production hosting |

---

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.17.0 or higher; v20+ recommended)
- A Central Weather Administration (CWA) Open Data API Key ([Register free here](https://opendata.cwa.gov.tw/user/authkey))

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
   *(Note for Windows PowerShell users: if script execution policies block `npm.ps1`, run `cmd /c npm install` or `npm.cmd install`)*

3. **Configure Environment Variables:**
   Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
   Open `.env.local` and set your CWA API Key:
   ```env
   CWA_API_KEY=your_actual_cwa_api_key_here
   CWA_API_BASE_URL=https://opendata.cwa.gov.tw/api/v1/rest/datastore
   NEXT_PUBLIC_MAP_TILE_URL=https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png
   ```

4. **Initialize and Seed the Database:**
   Run the database sync script to create the `weather_forecasts` table and seed records:
   ```bash
   node scripts/sync_db.mjs
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
   - Use the zone filter buttons (**全台灣**, **北部**, **中部**, **南部**, **東部**, **離島**) or the search bar to filter specific areas.
   - Click the **即時同步** (Sync) button in the header to force a fresh data fetch from the CWA API and write new records to the database.
   - Click the **氣象資料庫** (Database) button in the header to open the Database Inspector modal and review stored table rows.

2. **Backend API Endpoints:**

   - **Query Database Records:**
     ```bash
     curl http://localhost:3000/api/db
     ```

   - **Filter Database Records by County:**
     ```bash
     curl "http://localhost:3000/api/db?location=臺北市"
     ```

   - **Fetch Weather Data (with Automatic DB Persistence):**
     ```bash
     curl http://localhost:3000/api/weather
     ```

   - **Service Health Check:**
     ```bash
     curl http://localhost:3000/api/health
     ```

#### Example Database Query Response (`/api/db?location=臺北市`):
```json
{
  "success": true,
  "stats": {
    "totalRecords": 66,
    "uniqueLocations": 22,
    "databaseFile": "data/weather.db"
  },
  "count": 3,
  "data": [
    {
      "id": 1,
      "location_name": "臺北市",
      "region": "北部",
      "forecast_start_time": "2026-09-21 18:00:00",
      "forecast_end_time": "2026-09-22 06:00:00",
      "temperature": 25,
      "min_temperature": 23,
      "max_temperature": 27,
      "precipitation_probability": 10,
      "weather_description": "晴時多雲",
      "comfort_index": "舒適至悶熱",
      "latitude": 25.0375,
      "longitude": 121.5637,
      "source": "CWA F-C0032-001",
      "fetched_at": "2026-09-21T12:50:16.000Z"
    }
  ]
}
```
