# WeatherOps Dashboard

Weather monitoring and API usage console built for the assignment brief.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Redux Toolkit + RTK Query
- Recharts
- Zod
- Lucide React

## Features

- Current weather overview with source metadata
- Seven-day forecast cards
- Hourly temperature, humidity, wind, and rainfall charts
- Global city search with geocoding, browser geolocation, recent locations, and quick presets
- Metric/imperial switch
- API usage card with request and AI request progress bars
- System health panel with latency, cache age, retry count, rate-limit metadata, freshness, last successful fetch, and last failed fetch
- Error simulation for invalid coordinates, invalid API key, quota exceeded, upstream server error, service unavailable, and network offline
- Professional toast alerts for API errors and cached fallback warnings

## Requirement Coverage

- Current weather: temperature, feels like, humidity, wind, rainfall, condition, updated time, and data source
- Forecast: seven-day minimum/maximum temperature, rain signal, humidity, wind, and condition
- Charts: Recharts line/bar visualizations for hourly temperature, rainfall, humidity, and wind
- Location: global city search, browser location, recent locations, quick presets, and unit switch
- Usage: current plan, request usage, remaining quota, AI quota, billing period, and progress bars
- Health: API status, latency, cache age, retry count, rate limit, freshness, last success, and last failure
- Resilience: normalized 400, 401, 403, 429, 500, 503, offline, and cached fallback handling

Note: the AI summary card was intentionally removed from the UI after design review. Normal weather polling still uses `ai=false` to avoid unnecessary AI quota usage.

## API Strategy

Frontend polling runs through RTK Query every 30 seconds. The Next.js route handlers protect WeatherAI quota with server-side memory caching:

- Weather cache: 60 minutes
- Usage cache: 30 minutes
- AI summary cache: 6 hours

The app runs without a key using realistic mock data. Add a real key to call WeatherAI:

```bash
cp .env.example .env.local
```

Then set:

```bash
WEATHERAI_API_KEY=your_key_here
WEATHERAI_BASE_URL=https://api.weatherai.com
```

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

The same dashboard is also available at `http://localhost:3000/dashboard`.

## Validate

```bash
npm run lint
npm run build
```
