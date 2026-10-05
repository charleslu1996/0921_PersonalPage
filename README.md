# 台灣氣象 GIS 視覺化互動平台 (Taiwan Weather GIS Web)

> **AIoT DIC-2 專案**：結合台灣中央氣象署（CWA）開放資料 API、關聯式資料庫結構化儲存，以及 Leaflet 互動式 GIS 地理空間圖資的前後端整合天氣儀表板。
> 
> 🌐 **線上正式展示 (Live Demo)**：[https://0921-personal-page.vercel.app/](https://0921-personal-page.vercel.app/)

---

## 1. 專案名稱與簡介 (Project Title & Overview)

### 專案名稱
**Taiwan Weather GIS Web (台灣氣象空間資訊整合系統)**

### 專案簡介
本專案為一套專為台灣 22 縣市設計的 Full-Stack 開放資料 GIS 氣象監控平台。系統直接串接交通部中央氣象署（Central Weather Administration, CWA）的開放資料 API（資料集代碼：`F-C0032-001`），自動抓取全台今明 36 小時三時段之精準預報數據，並經過資料清洗、驗證與地理中心座標對應後，結構化寫入關聯式資料庫中。

前端採用 **Next.js 14 (App Router)** 與 **Leaflet GIS** 引擎，提供雙向聯動的高互動性體驗：使用者可透過直觀的地圖標記點位、即時氣溫熱度色彩、各縣市分區檢索、原生 SVG 溫差走勢圖以及內建的資料庫檢查器，全面掌握台灣各地的氣候變化。全站採用極簡現代的 Dark Glassmorphism（毛玻璃暗色系）設計風格，並完整適配行動裝置與桌面端。

---

## 2. 主要功能特色 (Key Features)

- **官方 CWA 開放資料即時串接**
  - 串接中央氣象署官方 `F-C0032-001`（一般天氣預報 - 今明 36 小時預報）資料集。
  - 解析天氣現象（`Wx`）、降雨機率（`PoP`）、最低溫度（`MinT`）、最高溫度（`MaxT`）與舒適度指數（`CI`）。
- **互動式 Leaflet GIS 台灣地圖**
  - 內嵌精準的台灣本島與外島 22 縣市 WGS84 幾何中心點位（基隆至連江馬祖）。
  - **自適應動態氣溫微章（Dynamic Weather Pin Markers）**：地圖標記根據平均氣溫自動套用情境色相（$\le 20^\circ\text{C}$ 涼爽藍、 $21\sim 29^\circ\text{C}$ 舒適綠、 $\ge 30^\circ\text{C}$ 炎熱橙），並帶有呼吸光暈特效。
  - **地理雙向連動視角（Bi-Directional Sync）**：點選地圖任意標記，視角平滑移動（`panTo`）並開啟 Popup 彈窗，同時聯動更新右側天氣焦點卡、溫度趨勢圖與下方總覽表格。
- **全縣市分區篩選與即時模糊搜尋**
  - 提供「全台灣、北部、中部、南部、東部、離島」快速分區切換標籤。
  - 支援關鍵字輸入即時篩選縣市名稱或區域。
- **多維度氣象展示與 SVG 氣溫趨勢折線圖**
  - **即時天氣焦點卡（WeatherCard）**：顯示當前最高/最低溫、降雨機率進度條、舒適度建議，以及未來三時段（36 小時）預報時間軸卡片。
  - **原生 SVG 溫度趨勢走勢圖（TemperatureChart）**：免安裝龐大第三方圖表套件，採用輕量化原生 SVG 繪製平滑曲線與微漸層色塊，直觀對比氣溫升降走勢。
- **全台 22 縣市數據總覽表（WeatherTable）**
  - 結構化呈現全台各縣市氣象資訊，支援依縣市、區域、即時氣溫與降雨機率進行多欄位即時排序。
  - 點擊任一列表行，自動定位地圖至該縣市，在手機端並具備平滑滾動至地圖的優化體驗。
- **關聯式資料庫結構化儲存與去重（Relational Database & Upsert）**
  - 設計 `weather_forecasts` 資料表，使用 `(location_name, forecast_start_time)` 複合唯一限制（Unique Constraint），落實寫入自動去重（`ON CONFLICT ... DO UPDATE`）。
  - 具備跨資料庫相容性，完美支援輕量化 SQLite 與雲端 PostgreSQL / Supabase。
- **視覺化資料庫檢查器（Database Inspector Modal）**
  - 內建前端彈窗直接查詢後端資料庫儲存狀態，可即時審查資料表記錄總數、縣市統計、最後同步時間與個別縣市之資料庫原始資料。
- **安全後端代理與記憶體智慧快取**
  - 透過 Next.js 伺服器端 Route Handler 封裝 CWA API Key，杜絕金鑰暴露於用戶端。
  - 內建 10 分鐘記憶體快取（TTL）機制與 HTTP Cache-Control header，大幅降低外部 API 請求負載。

---

## 3. 技術棧列表 (Tech Stack)

| 領域 / 層級 | 核心技術 | 說明與用途 |
| :--- | :--- | :--- |
| **前端框架** | **Next.js 14** (App Router) | 具備 SSR / Client 渲染優勢之現代全端 React 框架 |
| **UI 函式庫** | **React 18** | 元件化架構、狀態管理與響應式介面渲染 |
| **程式語言** | **TypeScript 5** | 全站嚴格型別定義（資料介面、API Payload、GIS Meta） |
| **GIS 地理圖資** | **Leaflet 1.9.4** | 輕量高相容地圖引擎、客製化 HTML/CSS Marker 與彈窗 |
| **底圖圖磚服務** | **CartoDB Voyager / OpenStreetMap** | 現代簡約高對比地圖圖磚服務 |
| **樣式與美學** | **Vanilla CSS3 (Design System)** | Dark Glassmorphism（深色毛玻璃）、CSS 自訂變數、微動畫 |
| **圖示庫** | **Lucide React** | 簡約向量 UI 圖示（溫度計、雨傘、風向、資料庫等） |
| **後端路由** | **Next.js Route Handlers** | 封裝 `/api/weather`、`/api/db` 與 `/api/health` 介面 |
| **資料庫引擎** | **SQLite (`node:sqlite`) / PostgreSQL** | 關聯式預報資料庫，支援本地 SQLite 檔案與雲端 Supabase |
| **資料來源** | **中央氣象署開放資料平台 (CWA)** | 提供官方 36 小時天氣預報公開資料集（`F-C0032-001`） |
| **版本控制與部署** | **Git / GitHub / Vercel** | 自動化 CI/CD 持續整合與全球邊緣節點託管 |

---

## 4. 專案目錄結構說明 (Directory Structure)

```text
0921_PersonalPage/
├── .env.example              # 環境變數設定範本（金鑰、API 網址、資料庫、地圖圖磚）
├── .gitignore                # Git 版本控制忽略設定（node_modules, .env.local, .db）
├── README.md                 # 專案完整技術文件（本檔案）
├── design.md                 # 系統工程規格書與分階段設計架構指引
├── next.config.mjs           # Next.js 專案設定檔（遠端地圖圖片來源宣告等）
├── package.json              # 專案依賴套件清單與啟動腳本
├── tsconfig.json             # TypeScript 嚴格編譯設定檔
│
├── data/                     # 靜態與本機資料存放區
│   ├── sample_cwa_forecast.json # CWA 官方預報離線快取/種子範例資料集
│   └── weather.db            # 本地開發時自動生成之 SQLite 資料庫檔案
│
├── db/                       # 資料庫結構與 SQL 定義
│   └── schema.sql            # 關聯式資料庫結構檔（支援 SQLite 與 PostgreSQL）
│
├── scripts/                  # 自動化建置、同步與測試輔助腳本
│   ├── sync_db.mjs           # 獨立執行之資料庫建立與氣象資料同步腳本
│   └── test_cwa.mjs          # CWA API 連線檢驗與資料拉取測試腳本
│
└── src/                      # 前後端主程式原始碼
    ├── app/                  # Next.js App Router 核心路由
    │   ├── api/              # 後端 API Route Handlers
    │   │   ├── db/route.ts       # 資料庫檢查與統計查詢 API (`/api/db`)
    │   │   ├── health/route.ts   # 系統狀態與 CWA 設定監控 API (`/api/health`)
    │   │   └── weather/route.ts  # 氣象預報抓取、快取與自動入庫 API (`/api/weather`)
    │   ├── globals.css       # 全站 Dark Glassmorphic 核心設計系統與響應式樣式
    │   ├── layout.tsx        # 根排版佈局元件與 HTML Head SEO Meta
    │   └── page.tsx          # 前端主儀表板頁面（GIS 地圖、卡片、趨勢圖與資料表整合）
    │
    ├── components/           # 模組化 UI 介面元件
    │   ├── DatabaseModal.tsx     # 視覺化資料庫審查彈窗
    │   ├── Header.tsx            # 頂部導航列（包含手動同步按鈕與資料庫入口）
    │   ├── LoadingState.tsx      # 資料加載中與錯誤重試提示元件
    │   ├── RegionSelector.tsx    # 台灣分區切換籤與關鍵字搜尋列
    │   ├── TaiwanMap.tsx         # Leaflet GIS 地圖核心元件（SSR 停用封裝）
    │   ├── TemperatureChart.tsx  # 原生 SVG 雙溫差趨勢平滑折線圖
    │   ├── WeatherCard.tsx       # 縣市當前氣象焦點卡與 36h 三時段時間軸
    │   └── WeatherTable.tsx      # 全台 22 縣市綜合資訊排序表格
    │
    ├── lib/                  # 後端核心共用商業邏輯模組
    │   ├── cwa.ts                # CWA API 請求、資料解析映射與記憶體快取
    │   ├── db.ts                 # 關聯式資料庫連線、Upsert 寫入與查詢抽象層
    │   └── taiwanGeo.ts          # 22 縣市 WGS84 座標、分區與別名對照表
    │
    └── types/                # 共通型別定義
        ├── node-sqlite.d.ts      # Node.js 原生 sqlite 模組型別定義擴充
        └── weather.ts            # 氣象資料實體、分區與 API 回傳格式介面定義
```

---

## 5. 環境變數設定指南 (Environment Variables)

專案根目錄附有 `.env.example` 檔案，本地開發時請先複製一份命名為 `.env.local`：

```bash
cp .env.example .env.local
```

### 變數詳細說明

| 環境變數 Key | 必要性 | 預設 / 範例值 | 用途說明 |
| :--- | :---: | :--- | :--- |
| `CWA_API_KEY` | **必要** | `CWA-XXXXXXXX-XXXX-...` | 交通部中央氣象署開放資料平台的授權碼。請至 [氣象署會員平台](https://opendata.cwa.gov.tw/user/authkey) 免費註冊並取得。 |
| `CWA_API_BASE_URL` | 選填 | `https://opendata.cwa.gov.tw/api/v1/rest/datastore` | CWA Open Data API 的 Datastore 服務端點網址。一般情況使用預設值即可。 |
| `DATABASE_URL` | 選填 | `postgresql://user:pass@host:5432/dbname` | 外部關聯式資料庫（如 PostgreSQL、Supabase、Neon）連線字串。若未設定，系統預設採用本地 SQLite 檔案（`data/weather.db`）進行儲存。 |
| `NEXT_PUBLIC_MAP_TILE_URL` | 選填 | `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png` 或 CartoDB 網址 | 前端 Leaflet 載入地圖底圖之圖磚伺服器網址。帶有 `NEXT_PUBLIC_` 前綴可於瀏覽器端取用。 |

> **提示**：若希望地圖呈現深色精緻質感，推薦在 `NEXT_PUBLIC_MAP_TILE_URL` 設定 CartoDB Voyager 圖磚：
> ```env
> NEXT_PUBLIC_MAP_TILE_URL=https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png
> ```

---

## 6. 本地開發與啟動步驟 (Local Installation & Setup)

### 系統環境要求
- **Node.js**：v18.17.0 以上（強烈推薦 **Node.js v20+** 以享有 Node.js 內建原生 SQLite 支援）
- **npm**：v9.0.0 以上

---

### 詳細建置步驟

#### 1. 複製專案儲存庫
```bash
git clone https://github.com/charleslu1996/0921_PersonalPage.git
cd 0921_PersonalPage
```

#### 2. 安裝相依套件
```bash
npm install
```
*(Windows PowerShell 若遇執行原則限制，可使用 `cmd /c npm install` 進行安裝)*

#### 3. 配置環境變數
建立本機環境變數檔案，並填入您的 CWA API 金鑰：
```bash
cp .env.example .env.local
```
編輯 `.env.local`：
```env
CWA_API_KEY=你的中央氣象署授權碼
CWA_API_BASE_URL=https://opendata.cwa.gov.tw/api/v1/rest/datastore
NEXT_PUBLIC_MAP_TILE_URL=https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png
```

#### 4. 初始化資料庫與執行 Schema
本專案提供多種資料庫初始化方式：

- **方式 A：使用內建腳本自動建立 SQLite 並同步種子資料（推薦）**
  ```bash
  node scripts/sync_db.mjs
  ```
  此腳本將自動讀取 `db/schema.sql` 定義在 `data/weather.db` 建立 `weather_forecasts` 資料表與索引，並將 sample 氣象預報資料寫入資料庫。

- **方式 B：外部 PostgreSQL / Supabase 資料庫**
  若您使用 Supabase 或自建 PostgreSQL，請在 SQL Editor 或 psql 命令列中載入並執行 [db/schema.sql](file:///c:/Users/amath701/.gemini/0921_PersonalPage/db/schema.sql)：
  ```bash
  psql -d "你的_DATABASE_URL" -f db/schema.sql
  ```

#### 5. 測試 CWA API 連線（選用）
在正式啟動網站前，您可透過測試腳本驗證 API 金鑰是否有效：
```bash
node scripts/test_cwa.mjs
```

#### 6. 啟動本機開發伺服器
```bash
npm run dev
```
Open your browser and navigate to: **[https://0921-personal-page.vercel.app/](https://0921-personal-page.vercel.app/)** （本機開發測試請訪問 `http://localhost:3000`）

---

### 可用 NPM 腳本

| 指令 | 說明 |
| :--- | :--- |
| `npm run dev` | 啟動 Next.js 開發熱更新伺服器（預設監聽 3000 埠） |
| `npm run build` | 編譯打包適用於生產環境之最佳化 Next.js 應用程式 |
| `npm run start` | 以生產環境模式執行編譯後的應用伺服器 |

---

### 測試 API 端點範例

在伺服器運作狀態下，可使用 `curl` 或瀏覽器直接測試後端端點：

- **氣象預報端點（支援快取與自動寫入 DB）：**
  ```bash
  curl http://localhost:3000/api/weather
  ```
- **查詢資料庫目前儲存之記錄：**
  ```bash
  curl http://localhost:3000/api/db
  ```
- **依縣市過濾資料庫記錄：**
  ```bash
  curl "http://localhost:3000/api/db?location=臺中市"
  ```
- **系統健康檢查狀態：**
  ```bash
  curl http://localhost:3000/api/health
  ```

---

## 7. 部署說明 (Deployment Guide)

本專案經過完整配置，特別針對 **Vercel** 雲端平台進行最佳化，可直接透過 GitHub 儲存庫進行一鍵自動化部署。

### Vercel 部署步驟

1. **推動程式碼至 GitHub 儲存庫**：
   確保您的專案原始碼已推播至 GitHub（例如 `main` 分支）。

2. **登入 Vercel 並建立新專案**：
   - 進入 [Vercel Dashboard](https://vercel.com/dashboard)，點擊 **"Add New..."** $\rightarrow$ **"Project"**。
   - 匯入您的 GitHub 專案儲存庫（`0921_PersonalPage`）。

3. **設定 Environment Variables（環境變數）**：
   在 Vercel 部署設定頁面的 **Environment Variables** 區塊，加入以下環境變數：
   - `CWA_API_KEY`：您的中央氣象署 API 金鑰（**務必設定**）。
   - `CWA_API_BASE_URL`：`https://opendata.cwa.gov.tw/api/v1/rest/datastore`（選填）。
   - `NEXT_PUBLIC_MAP_TILE_URL`：`https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png`（選填）。
   - `DATABASE_URL`：若串接 Supabase / 外部 PostgreSQL，請於此處設定連線網址（選填）。

4. **點擊 Deploy 開始部署**：
   - Next.js 14 會自動執行 `npm run build`，並將 App Router 與 API Route Handlers 轉為 Edge / Serverless Functions。
   - 部署完成後即可直接造訪線上正式網址：**[https://0921-personal-page.vercel.app/](https://0921-personal-page.vercel.app/)**。

---

### 雲端無伺服器 (Serverless) 部署關鍵注意事項

1. **Serverless 環境下的 SQLite 行為**
   - Vercel 之類的 Serverless 環境中，磁碟檔案系統為唯讀或暫存性（Ephemeral）。
   - 本專案後端 `src/lib/db.ts` 已內建智慧相容機制：當偵測到處於 Vercel 環境（`process.env.VERCEL === '1'`）且無持久儲存時，會自動切換將臨時 SQLite 建立於 `/tmp` 或轉為 `:memory:` 記憶體模式，保證系統不崩潰。
   - **若生產環境需要長久保留歷史氣象資料，強烈建議搭配雲端 PostgreSQL 或 Supabase**，並在 Vercel 設定 `DATABASE_URL`。

2. **Leaflet 地圖在 Next.js 的 SSR 處理**
   - Leaflet 需要存取瀏覽器專屬的 `window` 與 `document` 物件。
   - 本專案已在 `src/app/page.tsx` 中使用 `next/dynamic` 搭配 `{ ssr: false }` 引入 `TaiwanMap` 元件，避免伺服器端渲染時發生 `ReferenceError: window is not defined` 錯誤。

3. **API 強制動態更新（Force Dynamic）**
   - 在 `src/app/api/weather/route.ts` 與 `src/app/api/db/route.ts` 中皆明確宣告了 `export const dynamic = 'force-dynamic'`，防止 Next.js 在建置時將動態氣象數據快取為過期的靜態內容。

---

## 授權與資料聲明 (License & Attribution)

- **氣象資料來源**：中華民國交通部中央氣象署（Central Weather Administration, CWA）。開放資料之使用遵循「[政府資料開放授權條款](https://data.gov.tw/license)」。
- **地圖圖資版權**：底圖圖資由 &copy; [OpenStreetMap](https://www.openstreetmap.org/copyright) 與 &copy; [CARTO](https://carto.com/) 貢獻者維護。
