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
      {warning ? (
        <div className="mb-4 rounded-xl border border-amber-300/30 bg-amber-300/10 p-3 text-sm text-amber-100">
          {warning.code}: {warning.message}
        </div>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.label} className="flex min-h-16 items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-3">
            <item.icon className="h-4 w-4 text-sky-300" />
            <div>
              <p className="text-xs text-slate-400">{item.label}</p>
              <p className="text-sm font-semibold capitalize text-slate-100">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
