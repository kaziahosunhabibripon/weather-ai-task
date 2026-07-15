"use client";

import { Bell, CloudSun, RefreshCw, Search, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { LocationPresets } from "@/components/location/location-presets";
import { LocationSearch } from "@/components/location/location-search";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { FieldLabel, SelectControl } from "@/components/ui/field";
import { Toast, type ToastState } from "@/components/ui/toast";
import { useGetUsageQuery, useGetWeatherQuery } from "@/store/api/weather-api";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSimulation, setUnits } from "@/store/slices/preferences-slice";
import { CurrentWeatherCard } from "./current-weather-card";
import { DailyForecast } from "./daily-forecast";
import { HourlyChart } from "./hourly-chart";
import { SystemHealthCard } from "./system-health-card";
import { UsageCard } from "./usage-card";
import { WeatherInsightsCard } from "./weather-insights-card";

const simulations = [
  ["none", "No simulation"],
  ["invalid_coordinates", "Invalid coordinates"],
  ["invalid_key", "Invalid API key"],
  ["quota", "Quota exceeded"],
  ["upstream", "Upstream 500"],
  ["unavailable", "Service unavailable"],
  ["offline", "Network offline"],
];

function getErrorMessage(error: unknown) {
  if (typeof error === "object" && error && "data" in error) {
    const data = (error as { data?: unknown }).data;
    if (typeof data === "object" && data && "message" in data) {
      return String((data as { message: unknown }).message);
    }
  }

  return "Please check the selected location, API status, or simulation mode.";
}

export function DashboardShell() {
  const dispatch = useAppDispatch();
  const { selectedLocation, units, refreshSeconds, simulation } = useAppSelector((state) => state.preferences);
  const [dismissedToastKey, setDismissedToastKey] = useState("");
  const unitLabel = units === "metric" ? "C" : "F";
  const queryArgs = useMemo(
    () => ({
      lat: selectedLocation.lat,
      lon: selectedLocation.lon,
      units,
      name: selectedLocation.name,
      country: selectedLocation.country,
      simulate: simulation,
    }),
    [selectedLocation.country, selectedLocation.lat, selectedLocation.lon, selectedLocation.name, units, simulation],
  );

  const weatherQuery = useGetWeatherQuery(queryArgs, { pollingInterval: refreshSeconds * 1000 });
  const usageQuery = useGetUsageQuery(undefined, { pollingInterval: 30_000 });

  const weather = weatherQuery.data;
  const alertToast: ToastState | null = weather?.warning
    ? {
        title: weather.warning.code.replaceAll("_", " "),
        message: weather.warning.message,
        tone: "warning",
      }
    : weatherQuery.error
      ? {
          title: "Weather request failed",
          message: getErrorMessage(weatherQuery.error),
          tone: "error",
        }
      : null;
  const alertToastKey = alertToast ? `${alertToast.title}:${alertToast.message}` : "";

  return (
    <main className="min-h-screen text-slate-100">
      {alertToast && alertToastKey !== dismissedToastKey ? (
        <Toast toast={alertToast} onClose={() => setDismissedToastKey(alertToastKey)} />
      ) : null}
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 rounded-2xl border border-white/12 bg-slate-950/70 p-4 shadow-2xl shadow-black/25 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-sky-400/15 text-sky-300">
              <CloudSun className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-sky-300">WeatherOps</p>
              <h1 className="mt-0.5 text-xl font-bold tracking-normal text-white sm:text-2xl">Weather monitoring console</h1>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="hidden h-10 min-w-72 items-center gap-2 rounded-xl border border-white/12 bg-slate-950/80 px-3 text-sm font-medium text-slate-400 lg:flex">
              <Search className="h-4 w-4" />
              Search city or address
            </div>
            <Button variant="icon" title="Notifications" className="px-0">
              <Bell className="h-4 w-4" />
            </Button>
          <Button
            variant="primary"
            onClick={() => weatherQuery.refetch()}
          >
            <RefreshCw className="h-4 w-4" />
            Manual refresh
          </Button>
          </div>
        </header>

        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-5">
            <Card>
              <CardTitle>Location & Controls</CardTitle>
              <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_240px]">
                <div className="space-y-4">
                  <LocationSearch />
                  <LocationPresets />
                </div>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                  <FieldLabel>
                    Units
                    <SelectControl
                      value={units}
                      onChange={(event) => dispatch(setUnits(event.target.value as "metric" | "imperial"))}
                    >
                      <option value="metric">Metric</option>
                      <option value="imperial">Imperial</option>
                    </SelectControl>
                  </FieldLabel>
                  <FieldLabel>
                    Error simulation
                    <SelectControl
                      value={simulation}
                      onChange={(event) => dispatch(setSimulation(event.target.value))}
                    >
                      {simulations.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </SelectControl>
                  </FieldLabel>
                </div>
              </div>
            </Card>

            {weatherQuery.isLoading ? <Card>Loading weather data...</Card> : null}
            {weatherQuery.error ? <Card className="border-red-400/30 bg-red-500/10 text-red-100">Weather request failed. Try a cached location or clear simulation.</Card> : null}
            {weather ? (
              <>
                <CurrentWeatherCard weather={weather} unitLabel={unitLabel} />
                <HourlyChart hourly={weather.hourly} />
              </>
            ) : null}
          </div>

          <aside className="space-y-5">
            {usageQuery.data ? <UsageCard usage={usageQuery.data} /> : <Card>Loading usage...</Card>}
            {weather ? <SystemHealthCard weather={weather} warning={weather.warning} /> : null}
            {weather ? <WeatherInsightsCard weather={weather} /> : null}
          </aside>
        </section>
        {weather ? <DailyForecast daily={weather.daily} unitLabel={unitLabel} /> : null}
        <footer className="rounded-2xl border border-white/12 bg-slate-950/60 px-5 py-4 text-sm text-slate-400 shadow-xl shadow-black/20 backdrop-blur-xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-sky-300" />
              <span className="font-semibold text-slate-200">WeatherOps Dashboard</span>
              <span>API usage, cache health, and weather intelligence console.</span>
            </div>
            <span>Built with Next.js, RTK Query, Recharts, and WeatherAI.</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
