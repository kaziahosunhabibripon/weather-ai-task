"use client";

import { configureStore } from "@reduxjs/toolkit";
import { weatherApi } from "./api/weather-api";
import preferencesReducer from "./slices/preferences-slice";
import recentLocationsReducer from "./slices/recent-locations-slice";

export const store = configureStore({
  reducer: {
    preferences: preferencesReducer,
    recentLocations: recentLocationsReducer,
    [weatherApi.reducerPath]: weatherApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(weatherApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
