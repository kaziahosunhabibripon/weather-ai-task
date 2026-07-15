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
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.09)" />
              <XAxis dataKey="label" minTickGap={32} stroke="#cbd5e1" />
              <YAxis stroke="#cbd5e1" />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 12, color: "#f8fafc" }} />
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
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.09)" />
              <XAxis dataKey="label" minTickGap={32} stroke="#cbd5e1" />
              <YAxis stroke="#cbd5e1" />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 12, color: "#f8fafc" }} />
              <Legend />
              <Bar dataKey="rainfall" fill="#38bdf8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}
