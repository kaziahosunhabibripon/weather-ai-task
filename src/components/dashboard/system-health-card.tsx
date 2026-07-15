"use client";

import { AlertTriangle, CheckCircle2, Clock, Database, RadioTower } from "lucide-react";
import type { WeatherPayload } from "@/lib/schemas";
import { Card, CardTitle } from "../ui/card";

export function SystemHealthCard({ weather, warning }: { weather: WeatherPayload; warning?: { code: string; message: string } }) {
  const items = [
    { label: "API status", value: warning ? "Degraded" : "Operational", icon: warning ? AlertTriangle : CheckCircle2 },
    { label: "Latency", value: `${weather.meta.latencyMs} ms`, icon: Clock },
    { label: "Cache age", value: `${weather.meta.cacheAgeSeconds}s`, icon: Database },
    { label: "Retry count", value: weather.meta.retryCount, icon: RadioTower },
    { label: "Rate limit remaining", value: weather.meta.rateLimit.remaining ?? "n/a", icon: RadioTower },
    { label: "Freshness", value: weather.meta.freshness, icon: CheckCircle2 },
  ];

  return (
    <Card>
      <CardTitle>System Health</CardTitle>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.label} className="flex min-h-16 items-center gap-3 rounded-2xl border border-white/12 bg-white/8 p-3">
            <item.icon className="h-4 w-4 text-sky-300" />
            <div>
              <p className="text-xs font-medium text-slate-400">{item.label}</p>
              <p className="text-sm font-bold capitalize text-white">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
