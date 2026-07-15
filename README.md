# WeatherOps Dashboard

AI-powered weather monitoring and API usage console built for the assignment brief.

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
- On-demand AI weather insight using `ai=true`
- Normal polling with `ai=false` to protect AI quota
- Location search, browser geolocation, recent locations, and quick presets
- Metric/imperial switch
- API usage card with request and AI request progress bars
- System health panel with latency, cache age, retry count, rate-limit metadata, and freshness
- Error simulation for invalid coordinates, invalid API key, quota exceeded, upstream server error, service unavailable, and network offline

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

## Validate

```bash
npm run lint
npm run build
```
