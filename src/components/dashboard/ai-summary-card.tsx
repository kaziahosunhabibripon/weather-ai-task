"use client";

import { Brain, CloudSun, Sparkles } from "lucide-react";
import type { WeatherPayload } from "@/lib/schemas";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

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
    <Card className="overflow-hidden">
      <div className="mb-4 flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-sky-400/15 text-sky-300">
          <Brain className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-sky-300">AI Insight</p>
          <h2 className="mt-1 text-lg font-bold leading-snug text-white">Weather Summary</h2>
          <p className="mt-1 text-sm leading-5 text-slate-400">Generate advice only when needed to protect AI quota.</p>
        </div>
      </div>
      <Button
        variant="primary"
        onClick={onGenerate}
        disabled={isFetching}
        className="mb-4 w-full justify-center whitespace-nowrap"
      >
        <Sparkles className="h-4 w-4" />
        {isFetching ? "Generating Insight" : "Generate AI Insight"}
      </Button>
      {summary ? (
        <div className="grid gap-3">
          {Object.entries(summary).map(([key, value]) => (
            <div key={key} className="rounded-2xl border border-white/12 bg-white/8 p-3">
              <p className="text-xs font-bold uppercase text-sky-300">{key.replace(/([A-Z])/g, " $1")}</p>
              <p className="mt-1 text-sm font-medium text-slate-200">{value}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-sky-300/20 bg-sky-400/8 p-4">
          <div className="mb-3 flex items-center gap-2 text-sky-200">
            <CloudSun className="h-4 w-4" />
            <span className="text-sm font-bold">Ready for analysis</span>
          </div>
          <p className="text-sm leading-6 text-slate-300">
            Normal refresh uses <code className="rounded bg-slate-950/70 px-1.5 py-0.5 text-sky-200">ai=false</code>. Click the button to request today&apos;s overview, activity advice, rain risk, agriculture note, and safety warning.
          </p>
        </div>
      )}
    </Card>
  );
}
