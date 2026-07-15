"use client";

import { MapPin } from "lucide-react";
import { presets } from "@/lib/mock-data";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setLocation } from "@/store/slices/preferences-slice";
import { rememberLocation } from "@/store/slices/recent-locations-slice";

export function LocationPresets() {
  const dispatch = useAppDispatch();
  const selected = useAppSelector((state) => state.preferences.selectedLocation);

  return (
    <div className="flex flex-wrap gap-2">
      {presets.map((preset) => (
        <button
          key={preset.id}
          onClick={() => {
            dispatch(setLocation(preset));
            dispatch(rememberLocation(preset));
          }}
          className={`inline-flex h-9 items-center gap-2 rounded-xl border px-3 text-sm font-medium ${
            selected.id === preset.id
              ? "border-sky-300 bg-sky-100 text-sky-800"
              : "border-slate-200 bg-white/75 text-slate-700 hover:bg-white"
          }`}
          type="button"
        >
          <MapPin className="h-4 w-4" />
          {preset.name}
        </button>
      ))}
    </div>
  );
}
