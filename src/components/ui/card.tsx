import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-white/70 bg-white/72 p-5 text-slate-900 shadow-xl shadow-slate-900/8 backdrop-blur-xl",
        className,
      )}
      {...props}
    />
  );
}

export function CardTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-4 flex min-h-8 items-center justify-between gap-3">
      <h2 className="text-base font-bold text-slate-950">{children}</h2>
      {action}
    </div>
  );
}
