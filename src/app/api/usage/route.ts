import { NextResponse } from "next/server";
import { getCache, setCache } from "@/lib/cache";
import { errorMessage } from "@/lib/errors";
import type { UsagePayload } from "@/lib/schemas";
import { fetchUsage, WeatherApiError } from "@/lib/weather-ai-client";

const USAGE_TTL = 30 * 60;

export async function GET() {
  const startedAt = performance.now();
  const cached = getCache<UsagePayload>("usage");

  if (cached && !cached.isExpired) {
    return NextResponse.json({
      ...cached.value,
      meta: {
        ...cached.value.meta,
        dataSource: "cache",
        cacheAgeSeconds: cached.ageSeconds,
        latencyMs: Math.round(performance.now() - startedAt),
      },
    });
  }

  try {
    const usage = await fetchUsage();
    const payload = {
      ...usage,
      meta: { ...usage.meta, latencyMs: Math.round(performance.now() - startedAt) },
    };
    setCache("usage", payload, USAGE_TTL);
    return NextResponse.json(payload);
  } catch (error) {
    if (cached) return NextResponse.json({ ...cached.value, meta: { ...cached.value.meta, dataSource: "cache" } });
    const status = error instanceof WeatherApiError ? error.status : 500;
    const code = error instanceof WeatherApiError ? error.code : "UNKNOWN";
    return NextResponse.json({ code, message: errorMessage(code) }, { status });
  }
}
