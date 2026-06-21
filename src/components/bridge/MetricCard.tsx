import { cn } from "@/lib/utils";

type Hue = "cyan" | "violet" | "azure";

const HUE: Record<Hue, { color: string; ring: string }> = {
  cyan:   { color: "oklch(0.88 0.18 210)", ring: "oklch(0.78 0.18 215 / 0.45)" },
  violet: { color: "oklch(0.82 0.20 295)", ring: "oklch(0.68 0.22 295 / 0.45)" },
  azure:  { color: "oklch(0.90 0.14 195)", ring: "oklch(0.78 0.16 200 / 0.45)" },
};

type Props = {
  label: string;
  value: string;
  caption?: string;
  progress?: number; // 0-100
  hue?: Hue;
  className?: string;
};

export function MetricCard({ label, value, caption, progress, hue = "cyan", className }: Props) {
  const h = HUE[hue];
  return (
    <div
      className={cn(
        "glass-panel relative overflow-hidden rounded-2xl px-5 py-4",
        className,
      )}
      style={{ borderColor: h.ring }}
    >
      <p className="text-[13px] font-medium text-muted-foreground">{label}</p>
      <p
        className="mt-2 font-display text-[34px] leading-none tracking-tight"
        style={{ color: h.color, textShadow: `0 0 22px ${h.color}` }}
      >
        {value}
      </p>
      {typeof progress === "number" && (
        <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full"
            style={{
              width: `${Math.max(0, Math.min(100, progress))}%`,
              background: `linear-gradient(90deg, ${h.color}, oklch(0.70 0.20 280))`,
              boxShadow: `0 0 14px ${h.color}`,
            }}
          />
        </div>
      )}
      {caption && (
        <p className="mt-3 text-[13px] text-muted-foreground/90">{caption}</p>
      )}
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-40 blur-2xl"
        style={{ background: h.color }}
      />
    </div>
  );
}
