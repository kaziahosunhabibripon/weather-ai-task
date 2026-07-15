"use client";

import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { HourlyPoint } from "@/lib/schemas";
import { formatTime } from "@/lib/utils";
import { Card, CardTitle } from "../ui/card";

export function HourlyChart({ hourly }: { hourly: HourlyPoint[] }) {
  const data = hourly.map((point) => ({ ...point, label: formatTime(point.time) }));

  return (
    <Card>
      <CardTitle>Hourly Forecast</CardTitle>
      <div className="grid gap-5 xl:grid-cols-2">
        <div className="h-72 min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.1)" />
              <XAxis dataKey="label" minTickGap={32} stroke="#475569" />
              <YAxis stroke="#475569" />
              <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12, color: "#0f172a" }} />
              <Legend />
              <Line type="monotone" dataKey="temperature" stroke="#facc15" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="humidity" stroke="#38bdf8" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="windSpeed" stroke="#a78bfa" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="h-72 min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.1)" />
              <XAxis dataKey="label" minTickGap={32} stroke="#475569" />
              <YAxis stroke="#475569" />
              <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12, color: "#0f172a" }} />
              <Legend />
              <Bar dataKey="rainfall" fill="#38bdf8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}
