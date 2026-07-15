import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "icon";
};

export function Button({ className, variant = "secondary", ...props }: ButtonProps) {
  const variants = {
    primary: "bg-sky-500 text-white shadow-lg shadow-sky-500/25 hover:bg-sky-600",
    secondary: "border border-slate-200 bg-white/80 text-slate-900 hover:bg-white",
    ghost: "border border-slate-200 bg-white/45 text-slate-700 hover:bg-white/70",
    icon: "grid h-10 w-10 place-items-center border border-slate-200 bg-white/65 text-slate-700 hover:bg-white",
  };

  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold outline-none ring-sky-400 transition disabled:pointer-events-none disabled:opacity-60 focus-visible:ring-2",
        variants[variant],
        className,
      )}
      type="button"
      {...props}
    />
  );
}
