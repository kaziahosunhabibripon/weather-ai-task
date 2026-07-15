import { NextResponse } from "next/server";
import { getCache, setCache } from "@/lib/cache";
import { errorCodeFromStatus, errorMessage, type ApiErrorCode } from "@/lib/errors";
import { coordinatesSchema, type WeatherPayload } from "@/lib/schemas";
import { fetchWeather, WeatherApiError } from "@/lib/weather-ai-client";

const WEATHER_TTL = 60 * 60;
const AI_TTL = 6 * 60 * 60;

const simulationStatus: Record<string, number> = {
  invalid_coordinates: 400,
  invalid_key: 401,
  quota: 429,
  upstream: 500,
  unavailable: 503,
  offline: 0,
};

export async function GET(request: Request) {
  const startedAt = performance.now();
  const parsed = coordinatesSchema.safeParse(Object.fromEntries(new URL(request.url).searchParams));

  if (!parsed.success) {
    return NextResponse.json(
      { code: "INVALID_COORDINATES", message: errorMessage("INVALID_COORDINATES") },
      { status: 400 },
    );
  }

  const params = parsed.data;
  const simulatedStatus = params.simulate ? simulationStatus[params.simulate] : undefined;
  const key = `weather:v2:${params.lat}:${params.lon}:${params.units}:${params.days}:${params.ai}`;
  const cached = getCache<WeatherPayload>(key);

  if (simulatedStatus !== undefined) {
    const code: ApiErrorCode = simulatedStatus === 0 ? "NETWORK_OFFLINE" : errorCodeFromStatus(simulatedStatus);
    if (cached) {
      return NextResponse.json({
        ...cached.value,
        meta: {
          ...cached.value.meta,
          dataSource: "cache",
          cacheAgeSeconds: cached.ageSeconds,
          latencyMs: Math.round(performance.now() - startedAt),
          freshness: "fallback",
        },
        warning: { code, message: errorMessage(code) },
      });
    }

    return NextResponse.json({ code, message: errorMessage(code) }, { status: simulatedStatus || 503 });
  }

  if (cached && !cached.isExpired) {
    return NextResponse.json({
      ...cached.value,
      meta: {
        ...cached.value.meta,
        dataSource: "cache",
        cacheAgeSeconds: cached.ageSeconds,
        latencyMs: Math.round(performance.now() - startedAt),
        freshness: "fresh",
      },
    });
  }

  try {
    const weather = await fetchWeather(params);
    const payload = {
      ...weather,
      meta: { ...weather.meta, latencyMs: Math.round(performance.now() - startedAt) },
    };
    setCache(key, payload, params.ai ? AI_TTL : WEATHER_TTL);
    return NextResponse.json(payload);
  } catch (error) {
    if (cached) {
      return NextResponse.json({
        ...cached.value,
        meta: {
          ...cached.value.meta,
          dataSource: "cache",
          cacheAgeSeconds: cached.ageSeconds,
          latencyMs: Math.round(performance.now() - startedAt),
          freshness: "fallback",
        },
      });
    }

    const status = error instanceof WeatherApiError ? error.status : 500;
    const code = error instanceof WeatherApiError ? error.code : "UNKNOWN";
    return NextResponse.json({ code, message: errorMessage(code) }, { status });
  }
}
