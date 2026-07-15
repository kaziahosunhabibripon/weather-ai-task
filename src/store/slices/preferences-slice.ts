"use client";

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { presets } from "@/lib/mock-data";
import type { LocationOption, WeatherUnits } from "@/lib/schemas";

type PreferencesState = {
  selectedLocation: LocationOption;
  units: WeatherUnits;
  theme: "light" | "dark";
  refreshSeconds: number;
  simulation: string;
};

const initialState: PreferencesState = {
  selectedLocation: presets[0],
  units: "metric",
  theme: "light",
  refreshSeconds: 30,
  simulation: "none",
};

const preferencesSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    setLocation(state, action: PayloadAction<LocationOption>) {
      state.selectedLocation = action.payload;
    },
    setUnits(state, action: PayloadAction<WeatherUnits>) {
      state.units = action.payload;
    },
    setSimulation(state, action: PayloadAction<string>) {
      state.simulation = action.payload;
    },
  },
});

export const { setLocation, setUnits, setSimulation } = preferencesSlice.actions;
export default preferencesSlice.reducer;
