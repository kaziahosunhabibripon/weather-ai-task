"use client";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { UsagePayload, WeatherPayload, WeatherUnits } from "@/lib/schemas";

export const weatherApi = createApi({
  reducerPath: "weatherApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Weather", "Usage"],
  endpoints: (builder) => ({
    getWeather: builder.query<
      WeatherPayload & { warning?: { code: string; message: string } },
      { lat: number; lon: number; units: WeatherUnits; name?: string; country?: string; ai?: boolean; simulate?: string }
    >({
      query: ({ lat, lon, units, name, country, ai = false, simulate = "none" }) => ({
        url: "weather",
        params: { lat, lon, units, days: 7, ai, name, country, ...(simulate !== "none" ? { simulate } : {}) },
      }),
      providesTags: ["Weather"],
    }),
    getUsage: builder.query<UsagePayload, void>({
      query: () => "usage",
      providesTags: ["Usage"],
    }),
  }),
});

export const { useGetUsageQuery, useGetWeatherQuery, useLazyGetWeatherQuery } = weatherApi;
