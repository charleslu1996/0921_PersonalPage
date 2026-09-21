# AIoT DIC-2 Taiwan Weather GIS Web

## 1. Project Overview

**Project Name:** Taiwan Weather GIS Web

**Project Type:** AIoT / Open Data / GIS Web Application

**Main Goal:**\
Build a web application that collects weather data from Taiwan's Central
Weather Administration (CWA), stores the data in a database, displays
weather information on a Taiwan GIS map, and deploys the application
automatically through GitHub and Vercel.

The project will be developed in small, testable stages so that each
component can be implemented and verified independently.

------------------------------------------------------------------------

## 2. Project Objectives

1.  Connect to a CWA weather API.
2.  Retrieve government-provided weather data.
3.  Parse and validate JSON responses.
4.  Store weather data in a cloud database.
5.  Build a Taiwan-focused GIS web interface.
6.  Match weather records with geographic locations.
7.  Display weather information on an interactive map.
8.  Manage source code with Git and GitHub.
9.  Automatically deploy the web application through Vercel.
10. Provide a clear project demonstration and technical report.

------------------------------------------------------------------------

## 3. Scope

### 3.1 Included Features

-   CWA API integration
-   Weather data collection
-   JSON parsing and validation
-   Database storage and querying
-   Taiwan map visualization
-   Geographic location matching
-   Weather markers or regional map layers
-   Weather detail cards
-   Basic weather charts
-   GitHub repository management
-   Vercel deployment
-   Optional automatic weather-data updates

### 3.2 Optional Future Features

-   AI-generated weather summaries
-   Rule-based weather alerts
-   Temperature anomaly detection
-   IoT sensor integration
-   Historical weather analysis
-   User location support
-   Notification services
-   Machine-learning-based analysis

The optional features should be added only after the core system is
stable.

------------------------------------------------------------------------

## 4. Proposed Technology Stack

  -----------------------------------------------------------------------
  Layer                   Technology              Purpose
  ----------------------- ----------------------- -----------------------
  Weather data source     CWA Open Data API       Obtain official weather
                                                  data

  Data format             JSON                    Exchange and process
                                                  API data

  Data processing         Python or TypeScript    Parse and validate data

  Frontend                Next.js                 Build the web
                                                  application

  UI framework            React                   Create reusable
                                                  interface components

  Programming language    TypeScript              Add type safety to the
                                                  web application

  GIS                     Leaflet                 Display interactive
                                                  maps

  Geographic data         GeoJSON                 Represent Taiwan
                                                  geographic boundaries

  Database                PostgreSQL / Supabase   Store weather records

  Version control         Git                     Track source-code
                                                  changes

  Code hosting            GitHub                  Store and manage the
                                                  project

  Deployment              Vercel                  Host and deploy the web
                                                  application
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 5. High-Level System Architecture

``` text
                    CWA Open Data API
                            |
                            v
                   Data Collection Layer
                            |
                            v
                  JSON Parsing and Validation
                            |
                            v
                     Database Layer
                   PostgreSQL / Supabase
                            |
                            v
                      Backend API
                            |
                            v
                  Next.js Web Application
                            |
             +--------------+--------------+
             |              |              |
             v              v              v
        Weather Cards   GIS Map       Weather Charts
             |              |              |
             +--------------+--------------+
                            |
                            v
                    GitHub Repository
                            |
                            v
                     Vercel Deployment
                            |
                            v
                    Online Web Application
```

------------------------------------------------------------------------

## 6. Development Workflow

``` text
1. Study CWA API
        |
        v
2. Select a suitable weather dataset
        |
        v
3. Test the API and receive JSON
        |
        v
4. Parse and validate the data
        |
        v
5. Design and create the database
        |
        v
6. Save weather records
        |
        v
7. Build the Taiwan GIS interface
        |
        v
8. Connect the frontend to the backend/database
        |
        v
9. Test the complete application locally
        |
        v
10. Push the source code to GitHub
        |
        v
11. Connect GitHub to Vercel
        |
        v
12. Configure environment variables
        |
        v
13. Deploy and test the production website
```

------------------------------------------------------------------------

## 7. Functional Requirements

### FR-01: CWA API Connection

The system shall connect to a selected CWA API endpoint.

Requirements:

-   Store the API endpoint in configuration.
-   Store the API key securely in environment variables.
-   Send an HTTP request.
-   Check the HTTP response status.
-   Handle request failures and timeouts.
-   Record useful error messages for debugging.

### FR-02: Weather Data Collection

The system shall retrieve weather information from the CWA API.

Potential fields include:

-   Region or location name
-   Forecast date and time
-   Temperature
-   Minimum temperature
-   Maximum temperature
-   Weather description
-   Precipitation probability
-   Latitude
-   Longitude
-   Data update time

The exact fields depend on the selected CWA dataset.

### FR-03: JSON Parsing and Validation

The system shall:

-   Parse the API response as JSON.
-   Confirm that required fields exist.
-   Handle missing or null values.
-   Convert values to appropriate data types.
-   Reject invalid records.
-   Record parsing errors when necessary.

### FR-04: Database Storage

The system shall save validated weather records in a database.

Requirements:

-   Use a structured relational schema.
-   Include location and time information.
-   Support data retrieval by location.
-   Support data retrieval by date or time.
-   Reduce duplicate records.
-   Store timestamps for tracking updates.

### FR-05: GIS Visualization

The system shall display a Taiwan-focused interactive map.

Requirements:

-   Display a map centered on Taiwan.
-   Support zooming and panning.
-   Display geographic boundaries when available.
-   Match weather data with geographic coordinates.
-   Display weather markers or regional information.
-   Show details when a marker or region is selected.

### FR-06: Web Dashboard

The dashboard shall provide:

-   Project title and navigation
-   Region selection
-   Current or forecast weather cards
-   Interactive Taiwan map
-   Weather details
-   Optional temperature chart
-   Data update timestamp
-   Basic loading and error states

### FR-07: GitHub Integration

The project shall:

-   Use a Git repository.
-   Maintain meaningful commit messages.
-   Include a README file.
-   Include a `.gitignore` file.
-   Never commit API keys, passwords, or private credentials.

### FR-08: Vercel Deployment

The project shall:

-   Connect the GitHub repository to Vercel.
-   Configure the required environment variables.
-   Build the application successfully.
-   Deploy the production version.
-   Support automatic deployment after approved GitHub changes.

------------------------------------------------------------------------

## 8. Database Design

### 8.1 Suggested Table: `weather_forecasts`

  Column                      Suggested Type     Description
  --------------------------- ------------------ ----------------------------------
  id                          BIGSERIAL / UUID   Primary key
  location_name               TEXT               Region or location name
  forecast_time               TIMESTAMP          Forecast time
  temperature                 NUMERIC            Temperature value
  min_temperature             NUMERIC            Minimum temperature
  max_temperature             NUMERIC            Maximum temperature
  precipitation_probability   NUMERIC            Probability of precipitation
  weather_description         TEXT               Weather condition
  latitude                    NUMERIC            Geographic latitude
  longitude                   NUMERIC            Geographic longitude
  source                      TEXT               Data source identifier
  fetched_at                  TIMESTAMP          Time when the data was collected
  created_at                  TIMESTAMP          Record creation time

The final schema must be adjusted to match the selected CWA API
response.

### 8.2 Data Quality Rules

-   Location names must not be empty.
-   Forecast time must use a consistent timezone policy.
-   Numeric values must be validated.
-   Latitude must be between -90 and 90.
-   Longitude must be between -180 and 180.
-   Duplicate records should be controlled using a suitable unique
    constraint.
-   Missing values should be handled explicitly.

------------------------------------------------------------------------

## 9. GIS Design

### 9.1 Geographic Data

The GIS component may use:

-   Taiwan administrative-area GeoJSON
-   Weather-station coordinates
-   Regional centroids
-   CWA location identifiers
-   OpenStreetMap-compatible map tiles, subject to usage policies

### 9.2 Location Matching

Weather data must be matched with geographic information using a
reliable identifier or mapping table.

Possible matching methods:

1.  Match by official location name.
2.  Match by CWA location identifier.
3.  Match by weather-station identifier.
4.  Match by latitude and longitude.

A simple city-center marker should not be treated as a complete
representation of all locations within a city.

### 9.3 Map Interactions

Users should be able to:

-   Zoom and pan around Taiwan.
-   Select a weather marker.
-   View location-specific weather information.
-   Switch between available weather indicators.
-   View a legend for temperature or other displayed values.

------------------------------------------------------------------------

## 10. API and Backend Design

### Suggested Endpoints

``` text
GET /api/weather
GET /api/weather?location=Taichung
GET /api/weather?date=YYYY-MM-DD
GET /api/locations
GET /api/health
```

These are proposed endpoint examples. The final endpoint structure may
change during implementation.

### Backend Responsibilities

-   Validate request parameters.
-   Retrieve data from the database.
-   Return consistent JSON responses.
-   Handle errors safely.
-   Protect secret credentials.
-   Avoid exposing private configuration values.

------------------------------------------------------------------------

## 11. Frontend Component Design

Suggested component structure:

``` text
components/
├── Header.tsx
├── WeatherCard.tsx
├── RegionSelector.tsx
├── TaiwanMap.tsx
├── WeatherPopup.tsx
├── TemperatureChart.tsx
├── WeatherTable.tsx
├── LoadingState.tsx
└── ErrorMessage.tsx
```

### Component Responsibilities

-   `Header`: Project title and navigation.
-   `WeatherCard`: Display key weather values.
-   `RegionSelector`: Allow users to select a location.
-   `TaiwanMap`: Render the GIS map.
-   `WeatherPopup`: Display details for a selected location.
-   `TemperatureChart`: Display temperature trends.
-   `WeatherTable`: Display structured weather records.
-   `LoadingState`: Show loading feedback.
-   `ErrorMessage`: Show understandable error messages.

------------------------------------------------------------------------

## 12. Security Requirements

-   Store API keys in environment variables.
-   Do not commit `.env` files containing secrets.
-   Use `.env.example` for documenting required variables.
-   Do not expose private database credentials in client-side code.
-   Validate all user-provided query parameters.
-   Apply appropriate database access rules.
-   Review CWA API usage restrictions and terms.
-   Review map-tile provider requirements and attribution rules.

Example `.env.example`:

``` env
CWA_API_KEY=your_cwa_api_key
DATABASE_URL=your_database_connection_string
NEXT_PUBLIC_MAP_TILE_URL=your_map_tile_url
```

The actual `.env` file must remain local or be configured securely in
Vercel.

------------------------------------------------------------------------

## 13. Local Development Plan

### Phase 1: API Prototype

Deliverables:

-   CWA API endpoint selected
-   API key configured locally
-   Successful API request
-   Example JSON response saved for development
-   Data fields documented

### Phase 2: Data Processing

Deliverables:

-   JSON parser
-   Data validation functions
-   Normalized weather records
-   Error handling

### Phase 3: Database

Deliverables:

-   Database created
-   Weather table created
-   Insert operation completed
-   Query operation completed
-   Duplicate handling implemented

### Phase 4: GIS Web

Deliverables:

-   Next.js application created
-   Taiwan map displayed
-   GeoJSON integrated if required
-   Weather locations displayed
-   Weather details shown on selection

### Phase 5: Integration

Deliverables:

-   Frontend connected to backend
-   Database records displayed
-   Loading states implemented
-   Error states implemented
-   Local end-to-end testing completed

### Phase 6: Deployment

Deliverables:

-   GitHub repository updated
-   Vercel project connected
-   Environment variables configured
-   Production build successful
-   Online website tested

------------------------------------------------------------------------

## 14. Automated Data Update Design

Automatic data collection and automatic website deployment are different
processes.

### 14.1 Weather Data Update

``` text
Scheduled Trigger
        |
        v
Call CWA API
        |
        v
Validate JSON
        |
        v
Save or update database records
        |
        v
Website reads updated data
```

Possible scheduling options include:

-   A scheduled cloud function
-   A supported Vercel Cron configuration
-   An external scheduler
-   A separate backend service

The selected method must be checked against the deployment platform's
current limits and configuration requirements.

### 14.2 Website Deployment

``` text
Developer changes code
        |
        v
Git commit
        |
        v
Git push
        |
        v
GitHub repository
        |
        v
Vercel build
        |
        v
Production deployment
```

------------------------------------------------------------------------

## 15. Testing Plan

### 15.1 API Tests

-   Valid API key
-   Invalid API key
-   Network failure
-   Timeout
-   Empty response
-   Unexpected JSON structure

### 15.2 Data Tests

-   Required fields exist
-   Numeric fields are valid
-   Date and time are consistent
-   Duplicate records are controlled
-   Missing values are handled

### 15.3 GIS Tests

-   Taiwan map loads correctly
-   Markers appear at expected locations
-   Location matching is correct
-   Popup information matches the selected record
-   Map remains usable on different screen sizes

### 15.4 Deployment Tests

-   Production build succeeds
-   Environment variables are available
-   API requests work in production
-   Database connection works
-   No secrets are exposed in browser code
-   Website works on desktop and mobile

------------------------------------------------------------------------

## 16. Project Milestones

  -----------------------------------------------------------------------
  Milestone                           Completion Criteria
  ----------------------------------- -----------------------------------
  M1: API Research                    Dataset selected and API tested

  M2: Data Collection                 JSON data retrieved successfully

  M3: Data Processing                 Validated records created

  M4: Database                        Records stored and queried

  M5: GIS Prototype                   Taiwan map displayed

  M6: Web Integration                 Weather data shown on the map

  M7: GitHub                          Source code and documentation
                                      uploaded

  M8: Vercel                          Website deployed successfully

  M9: Final Testing                   Core features verified

  M10: Presentation                   Screenshots, architecture, and
                                      results documented
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 17. Expected Final Result

The final application should allow users to:

1.  Open the Taiwan Weather GIS website.
2.  View weather information collected from the CWA API.
3.  Select a region or location.
4.  View weather information on an interactive Taiwan map.
5.  Review weather details and optional charts.
6.  Access the deployed application through a Vercel URL.

The project should clearly document:

-   Data sources
-   System architecture
-   Database design
-   GIS implementation
-   Deployment process
-   Testing results
-   Known limitations
-   Future improvements

------------------------------------------------------------------------

## 18. Risks and Limitations

### API Limitations

-   API rate limits may apply.
-   Data availability depends on the selected CWA dataset.
-   API response structures may change.
-   Forecast data and observed data have different meanings.

### GIS Limitations

-   Location names may not match directly.
-   Geographic boundaries may require additional processing.
-   Map providers may have usage limits or attribution requirements.

### Deployment Limitations

-   Serverless functions have execution and resource limits.
-   Local SQLite files are not suitable as the primary persistent
    database for a typical serverless production deployment.
-   Scheduled data collection requires separate planning.
-   Database access and environment variables must be configured for
    production.

------------------------------------------------------------------------

## 19. Future Improvements

After the core system is completed, the following features may be added:

1.  AI-generated weather summaries
2.  Rule-based weather alerts
3.  Historical weather trend analysis
4.  Temperature anomaly detection
5.  IoT sensor integration
6.  Weather comparison between regions
7.  Mobile-responsive improvements
8.  User-selected favorite locations
9.  Data export in CSV format
10. Dashboard performance optimization

------------------------------------------------------------------------

## 20. Definition of Done

The project is considered complete when:

-   [ ] A valid CWA API dataset is selected.
-   [ ] Weather data can be retrieved successfully.
-   [ ] JSON data is parsed and validated.
-   [ ] Weather records are saved in a database.
-   [ ] The Taiwan GIS map loads successfully.
-   [ ] Weather information is displayed at the correct location.
-   [ ] The web application works locally.
-   [ ] The code is pushed to GitHub.
-   [ ] Vercel deployment succeeds.
-   [ ] Production environment variables are configured.
-   [ ] Core features are tested.
-   [ ] Project documentation is completed.
-   [ ] The final project can be demonstrated.

------------------------------------------------------------------------

## 21. Recommended First Task

Start with the following task before building the database or GIS
interface:

1.  Visit the CWA Open Data platform.
2.  Select one weather dataset.
3.  Read its API documentation.
4.  Obtain an API key.
5.  Test the API request.
6.  Save one example JSON response.
7.  Identify the location, time, temperature, and geographic fields.

Once the API response is understood, the database and GIS design can be
implemented with fewer assumptions.
