import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

type Props = {
  label: string;
  value: number;       // 0-100
  display?: string;    // override center label
  icon?: LucideIcon;
  hue?: "cyan" | "violet" | "amber";
};

const HUE: Record<NonNullable<Props["hue"]>, [string, string]> = {
  cyan:   ["oklch(0.85 0.18 210)", "oklch(0.55 0.20 240)"],
  violet: ["oklch(0.78 0.20 295)", "oklch(0.50 0.22 280)"],
  amber:  ["oklch(0.85 0.15 80)",  "oklch(0.65 0.20 50)"],
};

export function MetricRing({ label, value, display, icon: Icon, hue = "cyan" }: Props) {
  const [a, b] = HUE[hue];
  const gid = `mr-${label.replace(/\s+/g, "-")}-${hue}`;
  return (
    <div className="flex items-center gap-4">
      <div className="relative h-20 w-20 shrink-0">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={a} />
              <stop offset="100%" stopColor={b} />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="42" fill="none" stroke="oklch(0.78 0.18 215 / 0.12)" strokeWidth="8" />
          <motion.circle
            cx="50" cy="50" r="42" fill="none"
            stroke={`url(#${gid})`} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 42}
            initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - value / 100) }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          {Icon ? <Icon className="h-5 w-5 text-primary" /> : (
            <span className="font-display text-sm text-foreground">{Math.round(value)}</span>
          )}
        </div>
      </div>
      <div className="min-w-0">
        <p className="hud-text">{label}</p>
        <p className="truncate font-display text-2xl text-gradient-cosmic">
          {display ?? `${Math.round(value)}%`}
        </p>
      </div>
    </div>
  );
}
