"use client";

import { CloudSun, Droplets, Wind } from "lucide-react";
import type { DailyPoint } from "@/lib/schemas";
import { formatDate } from "@/lib/utils";
import { Card, CardTitle } from "../ui/card";

export function DailyForecast({ daily, unitLabel }: { daily: DailyPoint[]; unitLabel: string }) {
  return (
    <Card>
      <CardTitle>Seven-Day Forecast</CardTitle>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-7">
        {daily.map((day, index) => (
          <div
            key={day.date}
            className={`min-h-40 rounded-2xl border p-3 ${
              index === 0
                ? "border-sky-300/50 bg-sky-300/15 text-white"
                : "border-white/10 bg-black/25 text-slate-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-100">{formatDate(day.date)}</p>
              <CloudSun className="h-5 w-5 text-amber-500" />
            </div>
            <p className="mt-3 text-xl font-semibold">
              {day.minTemp}{unitLabel} / {day.maxTemp}{unitLabel}
            </p>
            <p className="mt-1 min-h-10 text-sm text-slate-400">{day.condition}</p>
            <div className="mt-3 space-y-1 text-xs text-slate-300">
              <p className="flex items-center gap-1"><Droplets className="h-3.5 w-3.5" /> Rain {day.rainProbability}%</p>
              <p className="flex items-center gap-1"><Droplets className="h-3.5 w-3.5" /> Humidity {day.humidity}%</p>
              <p className="flex items-center gap-1"><Wind className="h-3.5 w-3.5" /> Wind {day.windSpeed}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
