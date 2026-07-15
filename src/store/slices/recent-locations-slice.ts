"use client";

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { LocationOption } from "@/lib/schemas";

type RecentLocationsState = {
  items: LocationOption[];
};

const initialState: RecentLocationsState = { items: [] };

const recentLocationsSlice = createSlice({
  name: "recentLocations",
  initialState,
  reducers: {
    rememberLocation(state, action: PayloadAction<LocationOption>) {
      state.items = [action.payload, ...state.items.filter((item) => item.id !== action.payload.id)].slice(0, 5);
    },
  },
});

export const { rememberLocation } = recentLocationsSlice.actions;
export default recentLocationsSlice.reducer;
