import type { LocationOption, UsagePayload, WeatherPayload, WeatherUnits } from "./schemas";

export const presets: LocationOption[] = [
  { id: "dhaka", name: "Dhaka", country: "Bangladesh", lat: 23.8103, lon: 90.4125 },
  { id: "nairobi", name: "Nairobi", country: "Kenya", lat: -1.2921, lon: 36.8219 },
  { id: "london", name: "London", country: "United Kingdom", lat: 51.5072, lon: -0.1276 },
];

const conditions = ["Partly cloudy", "Light rain", "Clear", "Humid", "Breezy"];

export function buildMockWeather(location: LocationOption, units: WeatherUnits, ai: boolean): WeatherPayload {
  const now = new Date();
  const base = units === "metric" ? 29 : 84;
  const hourly = Array.from({ length: 24 }, (_, index) => ({
    time: new Date(now.getTime() + index * 60 * 60 * 1000).toISOString(),
    temperature: base + Math.round(Math.sin(index / 3) * 4),
    rainfall: Number(Math.max(0, Math.sin(index / 2) * 3).toFixed(1)),
    humidity: 64 + ((index * 3) % 24),
    windSpeed: 8 + (index % 7),
  }));

  const daily = Array.from({ length: 7 }, (_, index) => ({
    date: new Date(now.getTime() + index * 24 * 60 * 60 * 1000).toISOString(),
    minTemp: base - 5 + index,
    maxTemp: base + 3 + index,
    rainProbability: 18 + ((index * 13) % 72),
    humidity: 58 + ((index * 5) % 30),
    windSpeed: 9 + index,
    condition: conditions[index % conditions.length],
  }));

  return {
    location,
    current: {
      temperature: base,
      feelsLike: base + 3,
      humidity: 72,
      windSpeed: 13,
      rainfall: 1.8,
      condition: "Humid with passing showers",
      updatedAt: now.toISOString(),
    },
    hourly,
    daily,
    aiSummary: ai
      ? {
          overview: "Warm, humid conditions with intermittent rain windows through the afternoon.",
          activityAdvice: "Plan outdoor work before midday and keep a rain buffer for commute hours.",
          rainRisk: "Moderate rain risk, highest in the late afternoon.",
          agriculture: "Good soil moisture outlook; delay spraying until winds settle.",
          safety: "Watch for slick roads during short heavy bursts of rain.",
        }
      : undefined,
    meta: {
      dataSource: "mock",
      cacheAgeSeconds: 0,
      latencyMs: 42,
      retryCount: 0,
      freshness: "fresh",
      rateLimit: { limit: 1000, remaining: 918, reset: null },
    },
  };
}

export function buildMockUsage(): UsagePayload {
  return {
    plan: "Free",
    requestsUsed: 82,
    requestsLimit: 1000,
    aiRequestsUsed: 7,
    aiRequestsLimit: 200,
    billingPeriodEnd: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
    meta: { dataSource: "mock", cacheAgeSeconds: 0, latencyMs: 35 },
  };
}
