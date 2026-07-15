"use client";

import { Brain, Sparkles } from "lucide-react";
import type { WeatherPayload } from "@/lib/schemas";
import { Card, CardTitle } from "../ui/card";

export function AiSummaryCard({
  weather,
  onGenerate,
  isFetching,
}: {
  weather: WeatherPayload;
  onGenerate: () => void;
  isFetching: boolean;
}) {
  const summary = weather.aiSummary;

  return (
    <Card>
      <CardTitle
        action={
          <button
            onClick={onGenerate}
            disabled={isFetching}
            className="inline-flex h-9 items-center gap-2 rounded-xl bg-sky-400 px-3 text-sm font-semibold text-slate-950 disabled:opacity-60"
            type="button"
          >
            <Sparkles className="h-4 w-4" />
            {isFetching ? "Generating" : "Generate AI Insight"}
          </button>
        }
      >
        AI Weather Summary
      </CardTitle>
      {summary ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {Object.entries(summary).map(([key, value]) => (
            <div key={key} className="rounded-2xl border border-white/10 bg-black/20 p-3">
              <p className="text-xs font-semibold uppercase text-sky-300">{key.replace(/([A-Z])/g, " $1")}</p>
              <p className="mt-1 text-sm text-slate-200">{value}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex min-h-36 items-center gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 text-slate-300">
          <Brain className="h-8 w-8 text-sky-300" />
          <p className="text-sm">Normal refresh uses <code>ai=false</code> to protect the AI quota. Generate only when needed.</p>
        </div>
      )}
    </Card>
  );
}
