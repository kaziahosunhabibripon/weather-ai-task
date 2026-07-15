import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "icon";
};

export function Button({ className, variant = "secondary", ...props }: ButtonProps) {
  const variants = {
    primary: "bg-sky-500 text-white shadow-lg shadow-sky-500/25 hover:bg-sky-400",
    secondary: "border border-white/12 bg-white/10 text-slate-100 hover:bg-white/15",
    ghost: "border border-white/12 bg-white/6 text-slate-200 hover:bg-white/12",
    icon: "grid h-10 w-10 place-items-center border border-white/12 bg-white/10 text-slate-100 hover:bg-white/15",
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
