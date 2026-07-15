"use client";

import { Activity } from "lucide-react";
import type { UsagePayload } from "@/lib/schemas";
import { formatDate, percent } from "@/lib/utils";
import { Card, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";

export function UsageCard({ usage }: { usage: UsagePayload }) {
  return (
    <Card>
      <CardTitle action={<span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase text-slate-300">{usage.meta.dataSource}</span>}>
        API Usage
      </CardTitle>
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-sky-400/15 text-sky-300">
          <Activity className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-400">Current plan</p>
          <p className="font-bold text-white">{usage.plan}</p>
        </div>
      </div>
      <div className="mt-5 space-y-4">
        <div>
          <div className="mb-2 flex justify-between text-sm font-medium text-slate-300">
            <span>Requests</span>
            <span>{usage.requestsUsed} / {usage.requestsLimit}</span>
          </div>
          <Progress value={percent(usage.requestsUsed, usage.requestsLimit)} />
        </div>
        <div>
          <div className="mb-2 flex justify-between text-sm font-medium text-slate-300">
            <span>AI requests</span>
            <span>{usage.aiRequestsUsed} / {usage.aiRequestsLimit}</span>
          </div>
          <Progress value={percent(usage.aiRequestsUsed, usage.aiRequestsLimit)} />
        </div>
      </div>
      <p className="mt-5 text-xs font-medium text-slate-400">Billing period ends {formatDate(usage.billingPeriodEnd)}</p>
    </Card>
  );
}
