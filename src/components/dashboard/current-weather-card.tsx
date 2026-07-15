"use client";

import { CloudRain, CloudSun, Droplets, Thermometer, Wind } from "lucide-react";
import type { WeatherPayload } from "@/lib/schemas";
import { formatTime } from "@/lib/utils";
import { Card, CardTitle } from "../ui/card";

export function CurrentWeatherCard({ weather, unitLabel }: { weather: WeatherPayload; unitLabel: string }) {
  const stats = [
    { label: "Feels like", value: `${weather.current.feelsLike}${unitLabel}`, icon: Thermometer },
    { label: "Humidity", value: `${weather.current.humidity}%`, icon: Droplets },
    { label: "Wind", value: `${weather.current.windSpeed}`, icon: Wind },
    { label: "Rainfall", value: `${weather.current.rainfall}`, icon: CloudRain },
  ];

  return (
    <Card className="relative min-h-[410px] overflow-hidden border-sky-300/20 bg-slate-950 p-0 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_42%_34%,rgba(148,163,184,0.42),transparent_10rem),radial-gradient(circle_at_58%_42%,rgba(56,189,248,0.26),transparent_14rem),linear-gradient(135deg,#111827_0%,#0f172a_45%,#020617_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-sky-500/20 to-transparent" />
      <div className="absolute left-1/2 top-24 h-32 w-64 -translate-x-1/2 rounded-full bg-slate-300/20 blur-3xl" />
      <div className="relative p-6">
      <CardTitle
        action={<span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-wide text-slate-200">{weather.meta.dataSource}</span>}
      >
        <span className="text-white">Current Weather</span>
      </CardTitle>
      <div className="mt-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm text-slate-300">{weather.location.name}, {weather.location.country}</p>
          <h2 className="mt-4 max-w-xs text-4xl font-semibold leading-tight tracking-normal text-white">{weather.current.condition}</h2>
          <p className="mt-5 text-7xl font-semibold tracking-normal">{weather.current.temperature}<span className="text-4xl">{unitLabel}</span></p>
          <p className="mt-3 text-sm text-slate-300">Updated {formatTime(weather.current.updatedAt)}</p>
        </div>
        <div className="grid h-24 w-24 place-items-center rounded-full border border-white/10 bg-white/10 shadow-2xl shadow-sky-400/20">
          <CloudSun className="h-12 w-12 text-yellow-300" />
        </div>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-white/10 bg-black/20 p-3 backdrop-blur">
            <stat.icon className="mb-2 h-4 w-4 text-sky-300" />
            <p className="text-xs text-slate-300">{stat.label}</p>
            <p className="text-lg font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 flex items-end gap-1">
        {Array.from({ length: 18 }, (_, index) => (
          <span
            key={index}
            className="w-full rounded-full bg-sky-200/70"
            style={{ height: `${12 + Math.sin(index / 2) * 10 + (index % 5) * 3}px` }}
          />
        ))}
      </div>
      </div>
    </Card>
  );
}
