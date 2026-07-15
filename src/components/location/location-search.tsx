"use client";

import { Crosshair, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { LocationOption } from "@/lib/schemas";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setLocation } from "@/store/slices/preferences-slice";
import { rememberLocation } from "@/store/slices/recent-locations-slice";

const catalog: LocationOption[] = [
  { id: "chittagong", name: "Chittagong", country: "Bangladesh", lat: 22.3569, lon: 91.7832 },
  { id: "new-york", name: "New York", country: "United States", lat: 40.7128, lon: -74.006 },
  { id: "tokyo", name: "Tokyo", country: "Japan", lat: 35.6762, lon: 139.6503 },
  { id: "sydney", name: "Sydney", country: "Australia", lat: -33.8688, lon: 151.2093 },
];

export function LocationSearch() {
  const [query, setQuery] = useState("");
  const dispatch = useAppDispatch();
  const recent = useAppSelector((state) => state.recentLocations.items);
  const matches = useMemo(
    () => catalog.filter((item) => item.name.toLowerCase().includes(query.toLowerCase())).slice(0, 4),
    [query],
  );

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
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search city"
            className="h-10 w-full rounded-xl border border-white/10 bg-black/25 pl-9 pr-3 text-sm text-slate-100 outline-none ring-sky-400 placeholder:text-slate-500 focus:ring-2"
          />
        </label>
        <button
          type="button"
          onClick={useBrowserLocation}
          title="Use browser location"
          className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-black/25 text-slate-200 hover:bg-white/10"
        >
          <Crosshair className="h-4 w-4" />
        </button>
      </div>
      {query ? (
        <div className="grid gap-2 sm:grid-cols-2">
          {matches.map((item) => (
            <button
              key={item.id}
              onClick={() => choose(item)}
              className="rounded-xl border border-white/10 bg-white/8 px-3 py-2 text-left text-sm hover:bg-white/12"
              type="button"
            >
              <span className="font-medium text-slate-100">{item.name}</span>
              <span className="block text-xs text-slate-400">{item.country}</span>
            </button>
          ))}
        </div>
      ) : null}
      {recent.length ? (
        <div className="flex flex-wrap gap-2 text-xs">
          {recent.map((item) => (
            <button key={item.id} onClick={() => choose(item)} className="rounded-lg bg-white/10 px-2 py-1 text-slate-300" type="button">
              {item.name}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
