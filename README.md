# WeatherOps Dashboard

WeatherOps is a production-style weather monitoring and API usage dashboard built for a full-stack assignment. It demonstrates WeatherAI API consumption, server-side quota protection, client-side state management, cache metadata, error resilience, and a polished operational UI.

## Live Capabilities

- Current weather overview with temperature, feels-like, humidity, wind, rainfall, condition, update time, and data source.
- Seven-day forecast with selectable forecast cards.
- Hourly Recharts visualizations for temperature, rainfall, humidity, and wind speed.
- Global city/address search that resolves user input to latitude and longitude before requesting weather data.
- Browser geolocation, quick presets, and recent location history.
- Metric/imperial unit switching.
- API usage dashboard with current plan, used quota, remaining quota, AI quota, billing period, and progress bars.
- System health panel with API status, latency, cache age, retry count, rate-limit metadata, freshness, last successful fetch, and last failed fetch.
- Professional toast alerts for invalid coordinates, invalid API key, quota exceeded, upstream errors, service unavailable, offline simulation, and cached fallback warnings.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Redux Toolkit
- RTK Query
- Recharts
- Zod
- Lucide React

## WeatherAI Integration

WeatherAI requests are never made directly from the browser. The frontend calls local Next.js route handlers, and those server routes attach the WeatherAI API key.

WeatherAI expects latitude and longitude query parameters and a Bearer token header:

```bash
curl "https://api.weather-ai.co/v1/weather?lat=-1.2921&lon=36.8219" \
  -H "Authorization: Bearer wai_your_key_here"
```

In this project, store only the raw key in `.env.local`:

```bash
WEATHERAI_API_KEY=wai_your_key_here
WEATHERAI_BASE_URL=https://api.weather-ai.co
```

The server adds:

```http
Authorization: Bearer ${WEATHERAI_API_KEY}
```

If no API key is configured, the app falls back to realistic mock weather and usage data so the UI can still be reviewed.

## Caching Mechanism

WeatherOps uses two layers of caching:

1. RTK Query browser cache  
   Keeps client UI responsive, avoids unnecessary client refetch work, and handles loading/error state.

2. Next.js server route memory cache  
   Protects WeatherAI request quota by preventing every frontend poll from becoming an upstream API call.

Cache TTLs:

| Data type | Cache TTL | Purpose |
| --- | ---: | --- |
| Weather data | 60 minutes | Protects the 1,000 monthly request quota |
| Usage data | 30 minutes | Avoids repeated `/v1/usage` calls |
| AI summary data | 6 hours | Protects limited AI request quota |
| Geocode results | 24 hours | Speeds up repeated city/address lookup |

Frontend polling is set to 30 seconds, but the server cache means WeatherAI is not called every 30 seconds.

Each weather response includes cache metadata:

- `dataSource`: `live`, `cache`, or `mock`
- `cacheAgeSeconds`
- `latencyMs`
- `freshness`: `fresh` or `fallback`
- `rateLimit.limit`
- `rateLimit.remaining`
- `rateLimit.reset`
- `lastSuccessfulFetch`
- `lastFailedFetch`

## Request Flow

```text
User searches address/city
  -> /api/geocode resolves lat/lon
  -> Redux stores selected location
  -> RTK Query calls /api/weather
  -> Next.js route validates query with Zod
  -> Server cache is checked
  -> WeatherAI request is made with Bearer token if cache misses
  -> Response is normalized
  -> Cache metadata is attached
  -> Dashboard renders weather, charts, usage, and health state
```

## API Routes

| Route | Responsibility |
| --- | --- |
| `/api/weather` | Validates coordinates, checks cache, calls WeatherAI, normalizes response, handles fallback and simulated errors |
| `/api/usage` | Calls WeatherAI usage endpoint or returns mock usage, with 30-minute cache |
| `/api/geocode` | Converts city/address input into latitude and longitude using geocoding providers plus local fallbacks |
| `/api/health` | Returns basic local app health/configuration status |

## Error Handling

The app normalizes WeatherAI and simulated errors into a consistent UI flow.

Handled states:

- `400` invalid coordinates
- `401` invalid/missing API key
- `403` forbidden or plan limitation
- `429` quota exceeded
- `500` upstream server error
- `503` service unavailable
- network/offline simulation
- cached fallback active

Errors appear as toast alerts instead of raw inline blocks, while System Health remains clean and status-oriented.

## Location Search

The location search supports:

- Global city names
- Full addresses
- Local Bangladesh area fallbacks such as Dinajpur and Mirpur
- Browser current location
- Recent locations
- Quick presets

Search results display the resolved latitude and longitude before selection. After selection, WeatherAI is called using those coordinates.

## Assignment Coverage

- Current weather overview: implemented
- Seven-day forecast: implemented
- Hourly forecast charts: implemented with Recharts
- Location search and presets: implemented
- Browser location: implemented
- Unit switch: implemented
- API usage dashboard: implemented
- System health panel: implemented
- Server cache separate from RTK Query cache: implemented
- Error simulation and resilience states: implemented
- Toast-based professional error UI: implemented

Note: the AI summary card was intentionally removed from the UI after design review. Normal weather requests still use `ai=false` to preserve AI quota.

## Project Structure

```text
src/
  app/
    api/
      geocode/route.ts
      health/route.ts
      usage/route.ts
      weather/route.ts
    dashboard/page.tsx
    page.tsx
  components/
    dashboard/
    location/
    ui/
  lib/
    cache.ts
    errors.ts
    mock-data.ts
    schemas.ts
    weather-ai-client.ts
  store/
    api/weather-api.ts
    slices/
    provider.tsx
    store.ts
```

## Setup

```bash
npm install
cp .env.example .env.local
```

Set your key:

```bash
WEATHERAI_API_KEY=wai_your_key_here
WEATHERAI_BASE_URL=https://api.weather-ai.co
```

Run locally:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
http://localhost:3000/dashboard
```

## Validation

```bash
npm run lint
npm run build
```

Both commands should pass before submission.

## Deployment Notes

This project is Vercel-ready. Configure the same environment variables in the Vercel project settings:

- `WEATHERAI_API_KEY`
- `WEATHERAI_BASE_URL`

No database, authentication, Firebase, WebSocket, or background worker is required for this assignment scope.
