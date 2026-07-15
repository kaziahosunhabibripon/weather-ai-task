import { cn } from "@/lib/utils";

export function FieldLabel({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("text-sm font-semibold text-slate-300", className)} {...props} />;
}

export function SelectControl(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "mt-1 h-10 w-full rounded-xl border border-white/12 bg-slate-950/80 px-3 text-sm font-medium text-slate-100 outline-none ring-sky-400 focus:ring-2",
        props.className,
      )}
    />
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-10 w-full rounded-xl border border-white/12 bg-slate-950/80 px-3 text-sm font-medium text-slate-100 outline-none ring-sky-400 placeholder:text-slate-500 focus:ring-2",
        props.className,
      )}
    />
  );
}
