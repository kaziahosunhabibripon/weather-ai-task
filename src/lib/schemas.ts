import { z } from "zod";

export const coordinatesSchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lon: z.coerce.number().min(-180).max(180),
  units: z.enum(["metric", "imperial"]).default("metric"),
  days: z.coerce.number().int().min(1).max(7).default(7),
  ai: z.coerce.boolean().default(false),
  simulate: z.string().optional(),
});

export type WeatherUnits = z.infer<typeof coordinatesSchema>["units"];

export type LocationOption = {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
};

export type HourlyPoint = {
  time: string;
  temperature: number;
  rainfall: number;
  humidity: number;
  windSpeed: number;
};

export type DailyPoint = {
  date: string;
  minTemp: number;
  maxTemp: number;
  rainProbability: number;
  humidity: number;
  windSpeed: number;
  condition: string;
};

export type WeatherPayload = {
  location: LocationOption;
  current: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    rainfall: number;
    condition: string;
    updatedAt: string;
  };
  hourly: HourlyPoint[];
  daily: DailyPoint[];
  aiSummary?: {
    overview: string;
    activityAdvice: string;
    rainRisk: string;
    agriculture: string;
    safety: string;
  };
  meta: {
    dataSource: "cache" | "live" | "mock";
    cacheAgeSeconds: number;
    latencyMs: number;
    retryCount: number;
    freshness: "fresh" | "stale" | "fallback";
    rateLimit: {
      limit: number | null;
      remaining: number | null;
      reset: string | null;
    };
  };
};

export type UsagePayload = {
  plan: string;
  requestsUsed: number;
  requestsLimit: number;
  aiRequestsUsed: number;
  aiRequestsLimit: number;
  billingPeriodEnd: string;
  meta: {
    dataSource: "cache" | "live" | "mock";
    cacheAgeSeconds: number;
    latencyMs: number;
  };
};
