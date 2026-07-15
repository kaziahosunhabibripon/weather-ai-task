"use client";

import { Crosshair, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { presets } from "@/lib/mock-data";
import type { LocationOption } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/field";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setLocation } from "@/store/slices/preferences-slice";
import { rememberLocation } from "@/store/slices/recent-locations-slice";

const catalog: LocationOption[] = [
  ...presets,
  { id: "chittagong", name: "Chittagong", country: "Bangladesh", lat: 22.3569, lon: 91.7832 },
  { id: "dinajpur", name: "Dinajpur", country: "Bangladesh", lat: 25.6279, lon: 88.6332 },
  { id: "new-york", name: "New York", country: "United States", lat: 40.7128, lon: -74.006 },
  { id: "tokyo", name: "Tokyo", country: "Japan", lat: 35.6762, lon: 139.6503 },
  { id: "sydney", name: "Sydney", country: "Australia", lat: -33.8688, lon: 151.2093 },
  { id: "paris", name: "Paris", country: "France", lat: 48.8566, lon: 2.3522 },
  { id: "dubai", name: "Dubai", country: "United Arab Emirates", lat: 25.2048, lon: 55.2708 },
  { id: "singapore", name: "Singapore", country: "Singapore", lat: 1.3521, lon: 103.8198 },
  { id: "toronto", name: "Toronto", country: "Canada", lat: 43.6532, lon: -79.3832 },
];

export function LocationSearch() {
  const [query, setQuery] = useState("");
  const [remoteMatches, setRemoteMatches] = useState<LocationOption[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const dispatch = useAppDispatch();
  const recent = useAppSelector((state) => state.recentLocations.items);
  const isGlobalSearchEnabled = query.trim().length >= 2;
  const localMatches = useMemo(
    () => catalog.filter((item) => item.name.toLowerCase().includes(query.toLowerCase())).slice(0, 4),
    [query],
  );
  const matches = useMemo(() => {
    const merged = [...localMatches, ...(isGlobalSearchEnabled ? remoteMatches : [])];
    return merged.filter((item, index) => merged.findIndex((match) => match.id === item.id) === index).slice(0, 8);
  }, [isGlobalSearchEnabled, localMatches, remoteMatches]);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(`/api/geocode?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });
        const data = (await response.json()) as { results?: LocationOption[] };
        setRemoteMatches(data.results ?? []);
      } catch {
        if (!controller.signal.aborted) setRemoteMatches([]);
      } finally {
        if (!controller.signal.aborted) setIsSearching(false);
      }
    }, 250);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  function choose(location: LocationOption) {
    dispatch(setLocation(location));
    dispatch(rememberLocation(location));
    setQuery("");
  }

  function useBrowserLocation() {
    navigator.geolocation?.getCurrentPosition((position) => {
      choose({
        id: "browser-location",
        name: "Current location",
        country: "Browser GPS",
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      });
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <label className="relative block flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <TextInput
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && matches[0]) choose(matches[0]);
            }}
            placeholder="Search city or address"
            className="pl-9"
          />
        </label>
        <Button
          variant="icon"
          onClick={useBrowserLocation}
          title="Use browser location"
          className="px-0"
        >
          <Crosshair className="h-4 w-4" />
        </Button>
      </div>
      {query ? (
        <div className="grid gap-2 sm:grid-cols-2">
          {matches.map((item) => (
            <button
              key={item.id}
              onClick={() => choose(item)}
              className="rounded-xl border border-white/12 bg-white/8 px-3 py-2 text-left text-sm hover:bg-white/12"
              type="button"
            >
              <span className="font-semibold text-white">{item.name}</span>
              <span className="block text-xs text-slate-400">{item.country}</span>
              <span className="mt-1 block font-mono text-[11px] text-sky-300">
                {item.lat.toFixed(4)}, {item.lon.toFixed(4)}
              </span>
            </button>
          ))}
          {isGlobalSearchEnabled && isSearching ? (
            <div className="rounded-xl border border-white/12 bg-white/8 px-3 py-2 text-sm font-medium text-slate-300">
              Searching locations...
            </div>
          ) : null}
          {!matches.length && !isSearching ? (
            <div className="rounded-xl border border-white/12 bg-white/8 px-3 py-2 text-sm font-medium text-slate-300">
              No location match found. Try a city, area, or full address with country.
            </div>
          ) : null}
        </div>
      ) : null}
      {recent.length ? (
        <div className="flex flex-wrap gap-2 text-xs">
          {recent.map((item) => (
            <button key={item.id} onClick={() => choose(item)} className="rounded-lg bg-white/10 px-2 py-1 font-medium text-slate-200" type="button">
              {item.name}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
