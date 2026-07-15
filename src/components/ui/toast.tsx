"use client";

import { AlertTriangle, CheckCircle2, X } from "lucide-react";
import { Button } from "./button";

export type ToastState = {
  title: string;
  message: string;
  tone?: "error" | "warning" | "success";
};

export function Toast({ toast, onClose }: { toast: ToastState; onClose: () => void }) {
  const isError = toast.tone === "error";
  const Icon = isError ? AlertTriangle : CheckCircle2;

  return (
    <div className="fixed right-4 top-4 z-50 w-[calc(100vw-2rem)] max-w-sm rounded-2xl border border-white/12 bg-slate-950/95 p-4 text-slate-100 shadow-2xl shadow-black/40 backdrop-blur-xl">
      <div className="flex gap-3">
        <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${isError ? "bg-red-500/15 text-red-300" : "bg-amber-400/15 text-amber-200"}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-white">{toast.title}</p>
          <p className="mt-1 text-sm leading-5 text-slate-300">{toast.message}</p>
        </div>
        <Button variant="ghost" onClick={onClose} className="h-8 w-8 shrink-0 rounded-lg px-0" title="Dismiss alert">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
