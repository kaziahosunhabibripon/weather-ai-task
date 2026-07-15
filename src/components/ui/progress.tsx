import { cn } from "@/lib/utils";

export function Progress({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("h-2 overflow-hidden rounded-full bg-white/12", className)}>
      <div className="h-full rounded-full bg-sky-500 transition-all" style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  );
}
