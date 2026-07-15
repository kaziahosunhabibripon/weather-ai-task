import { errorCodeFromStatus, errorMessage } from "./errors";
import { buildMockUsage, buildMockWeather, presets } from "./mock-data";
import type { LocationOption, UsagePayload, WeatherPayload, WeatherUnits } from "./schemas";

const API_BASE = process.env.WEATHERAI_BASE_URL ?? "https://api.weatherai.com";
const API_KEY = process.env.WEATHERAI_API_KEY;

export class WeatherApiError extends Error {
  constructor(
    public status: number,
    public code = errorCodeFromStatus(status),
  ) {
    super(errorMessage(code));
  }
}

function rateLimitFromHeaders(headers: Headers) {
  return {
    limit: Number(headers.get("x-ratelimit-limit")) || null,
    remaining: Number(headers.get("x-ratelimit-remaining")) || null,
    reset: headers.get("x-ratelimit-reset"),
  };
}

function conditionFromCode(code: unknown) {
  const value = Number(code);
  if ([0, 1].includes(value)) return "Clear";
  if ([2, 3].includes(value)) return "Partly cloudy";
  if ([45, 48].includes(value)) return "Fog";
  if (value >= 51 && value <= 67) return "Rain";
  if (value >= 71 && value <= 77) return "Snow";
  if (value >= 80 && value <= 82) return "Rain showers";
  if (value >= 95) return "Thunderstorm";
  return "Variable conditions";
}

export async function fetchWeather(params: {
  lat: number;
  lon: number;
  units: WeatherUnits;
  days: number;
  ai: boolean;
}): Promise<WeatherPayload> {
  const location: LocationOption =
    presets.find((item) => Math.abs(item.lat - params.lat) < 0.1 && Math.abs(item.lon - params.lon) < 0.1) ??
    { id: "custom", name: "Selected location", country: "Custom", lat: params.lat, lon: params.lon };

  if (!API_KEY) return buildMockWeather(location, params.units, params.ai);

  const startedAt = performance.now();
  let response: Response | null = null;

  for (const coordinateNames of [
    ["latitude", "longitude"],
    ["lat", "lon"],
  ] as const) {
    const url = new URL("/v1/weather", API_BASE);
    url.searchParams.set(coordinateNames[0], String(params.lat));
    url.searchParams.set(coordinateNames[1], String(params.lon));
    url.searchParams.set("days", String(params.days));
    url.searchParams.set("units", params.units);
    url.searchParams.set("ai", String(params.ai));

    response = await fetch(url, {
      headers: { Authorization: `Bearer ${API_KEY}` },
      next: { revalidate: 0 },
    });

    if (response.ok || response.status !== 400) break;
  }

  if (!response?.ok) throw new WeatherApiError(response?.status ?? 503);

  const raw = await response.json();
  const now = new Date().toISOString();

  return {
    location,
    current: {
      temperature: raw.current?.temperature ?? raw.temperature ?? 0,
      feelsLike: raw.current?.feels_like ?? raw.current?.feelsLike ?? raw.current?.temperature ?? 0,
      humidity: raw.current?.humidity ?? 0,
      windSpeed: raw.current?.wind_speed ?? raw.current?.windSpeed ?? raw.current?.windspeed ?? 0,
      rainfall: raw.current?.rainfall ?? raw.current?.rain ?? raw.current?.precipitation ?? 0,
      condition: raw.current?.condition ?? raw.condition ?? conditionFromCode(raw.current?.weathercode),
      updatedAt: raw.current?.updated_at ?? raw.current?.time ?? now,
    },
    hourly: (raw.hourly ?? []).slice(0, 24).map((item: Record<string, unknown>) => ({
      time: String(item.time),
      temperature: Number(item.temperature ?? item.temp ?? 0),
      rainfall: Number(item.rainfall ?? item.rain ?? item.precipitation ?? 0),
      humidity: Number(item.humidity ?? 0),
      windSpeed: Number(item.wind_speed ?? item.windSpeed ?? item.windspeed ?? 0),
    })),
    daily: (raw.daily ?? []).slice(0, 7).map((item: Record<string, unknown>) => ({
      date: String(item.date),
      minTemp: Number(item.min_temp ?? item.minTemp ?? item.temp_min ?? 0),
      maxTemp: Number(item.max_temp ?? item.maxTemp ?? item.temp_max ?? 0),
      rainProbability: Number(item.rain_probability ?? item.rainProbability ?? item.precipitation ?? 0),
      humidity: Number(item.humidity ?? 0),
      windSpeed: Number(item.wind_speed ?? item.windSpeed ?? item.windspeed ?? 0),
      condition: String(item.condition ?? conditionFromCode(item.weathercode)),
    })),
    aiSummary: raw.ai_summary ?? raw.aiSummary,
    meta: {
      dataSource: "live",
      cacheAgeSeconds: 0,
      latencyMs: Math.round(performance.now() - startedAt),
      retryCount: 0,
      freshness: "fresh",
      rateLimit: rateLimitFromHeaders(response.headers),
    },
  };
}

export async function fetchUsage(): Promise<UsagePayload> {
  if (!API_KEY) return buildMockUsage();

  const startedAt = performance.now();
  const response = await fetch(new URL("/v1/usage", API_BASE), {
    headers: { Authorization: `Bearer ${API_KEY}` },
    next: { revalidate: 0 },
  });

  if (!response.ok) throw new WeatherApiError(response.status);
  const raw = await response.json();

  return {
    plan: raw.plan ?? "Unknown",
    requestsUsed: raw.requests_used ?? raw.requestsUsed ?? 0,
    requestsLimit: raw.requests_limit ?? raw.requestsLimit ?? 1000,
    aiRequestsUsed: raw.ai_requests_used ?? raw.aiRequestsUsed ?? 0,
    aiRequestsLimit: raw.ai_requests_limit ?? raw.aiRequestsLimit ?? 200,
    billingPeriodEnd: raw.billing_period_end ?? raw.billingPeriodEnd ?? new Date().toISOString(),
    meta: {
      dataSource: "live",
      cacheAgeSeconds: 0,
      latencyMs: Math.round(performance.now() - startedAt),
    },
  };
}
