"use client";

import { CloudRain, Droplets, TrendingUp, Wind } from "lucide-react";
import type { WeatherPayload } from "@/lib/schemas";
import { Card, CardTitle } from "../ui/card";

export function WeatherInsightsCard({ weather }: { weather: WeatherPayload }) {
  const today = weather.daily[0];
  const rainRisk = today?.rainProbability ? (today.rainProbability > 20 ? "High" : today.rainProbability > 8 ? "Moderate" : "Low") : "Low";
  const comfort = weather.current.humidity > 75 ? "Humid" : weather.current.temperature > 32 ? "Hot" : "Comfortable";
  const windNote = weather.current.windSpeed > 25 ? "Wind alert" : "Stable wind";

  const items = [
    { label: "Rain risk", value: rainRisk, detail: `${today?.rainProbability ?? weather.current.rainfall}% signal`, icon: CloudRain },
    { label: "Comfort", value: comfort, detail: `${weather.current.humidity}% humidity`, icon: Droplets },
    { label: "Wind", value: windNote, detail: `${weather.current.windSpeed} speed`, icon: Wind },
    { label: "Trend", value: today ? `${today.minTemp} / ${today.maxTemp}` : "n/a", detail: "Today min / max", icon: TrendingUp },
  ];

  return (
    <Card>
      <CardTitle>Weather Insights</CardTitle>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-3 rounded-2xl border border-white/12 bg-white/8 p-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sky-400/15 text-sky-300">
              <item.icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-400">{item.label}</p>
              <p className="text-sm font-bold text-white">{item.value}</p>
              <p className="text-xs text-slate-400">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-2xl border border-sky-300/20 bg-sky-400/8 p-4">
        <p className="text-sm font-bold text-sky-200">Operational note</p>
        <p className="mt-1 text-sm leading-6 text-slate-300">
          Data is refreshed through RTK Query while server cache protects WeatherAI quota.
        </p>
      </div>
    </Card>
  );
}
