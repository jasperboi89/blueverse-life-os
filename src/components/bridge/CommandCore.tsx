import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

type Props = {
  mission: number;   // 0-100
  finance: number;   // 0-100
  focus: number;     // 0-100
  directive?: { id: string; title: string; subtitle?: string } | null;
};

const CIRC = (r: number) => 2 * Math.PI * r;

function Ring({
  r, stroke, value, color, dashed,
}: { r: number; stroke: number; value: number; color: string; dashed?: boolean }) {
  const c = CIRC(r);
  return (
    <g>
      <circle
        cx="250" cy="250" r={r} fill="none"
        stroke="oklch(0.78 0.18 215 / 0.10)" strokeWidth={stroke}
        strokeDasharray={dashed ? "2 6" : undefined}
      />
      <motion.circle
        cx="250" cy="250" r={r} fill="none"
        stroke={color} strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: c * (1 - Math.max(0, Math.min(100, value)) / 100) }}
        transition={{ duration: 1.6, ease: "easeOut" }}
        transform="rotate(-90 250 250)"
        style={{ filter: `drop-shadow(0 0 6px ${color})` }}
      />
    </g>
  );
}

function TickMarks({ r, count = 60 }: { r: number; count?: number }) {
  const ticks = Array.from({ length: count }, (_, i) => i);
  return (
    <g opacity="0.35">
      {ticks.map((i) => {
        const angle = (i / count) * Math.PI * 2;
        const major = i % 5 === 0;
        const inner = r - (major ? 6 : 3);
        const x1 = 250 + Math.cos(angle) * inner;
        const y1 = 250 + Math.sin(angle) * inner;
        const x2 = 250 + Math.cos(angle) * r;
        const y2 = 250 + Math.sin(angle) * r;
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="oklch(0.85 0.10 215)" strokeWidth={major ? 1.2 : 0.6} />
        );
      })}
    </g>
  );
}

export function CommandCore({ mission, finance, focus, directive }: Props) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[640px]">
      {/* Ambient halo */}
      <div
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, oklch(0.55 0.22 270 / 0.40), transparent 65%)",
          filter: "blur(28px)",
        }}
      />
      {/* Faint particle dust — static for SSR safety */}
      <div
        className="pointer-events-none absolute inset-0 rounded-full opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, oklch(0.95 0.05 210 / 0.6) 0.5px, transparent 1px)," +
            "radial-gradient(circle at 70% 60%, oklch(0.85 0.10 210 / 0.5) 0.5px, transparent 1px)," +
            "radial-gradient(circle at 40% 80%, oklch(0.78 0.20 290 / 0.5) 0.5px, transparent 1px)," +
            "radial-gradient(circle at 85% 20%, oklch(0.95 0.05 210 / 0.5) 0.5px, transparent 1px)",
          backgroundSize: "120px 120px, 180px 180px, 140px 140px, 200px 200px",
        }}
      />

      {/* Counter-rotating decorative rings */}
      <motion.div
        className="absolute inset-[3%] rounded-full border border-primary/15"
        animate={{ rotate: 360 }}
        transition={{ duration: 90, ease: "linear", repeat: Infinity }}
      >
        <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
        <span className="absolute top-1/2 -right-1 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_8px_var(--accent)]" />
      </motion.div>
      <motion.div
        className="absolute inset-[9%] rounded-full border border-accent/15"
        animate={{ rotate: -360 }}
        transition={{ duration: 120, ease: "linear", repeat: Infinity }}
      >
        <span className="absolute -top-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_8px_var(--accent)]" />
      </motion.div>

      <svg viewBox="0 0 500 500" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="ring-mission" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.88 0.18 210)" />
            <stop offset="100%" stopColor="oklch(0.62 0.22 240)" />
          </linearGradient>
          <linearGradient id="ring-finance" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.78 0.20 295)" />
            <stop offset="100%" stopColor="oklch(0.50 0.22 280)" />
          </linearGradient>
          <linearGradient id="ring-focus" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.90 0.14 195)" />
            <stop offset="100%" stopColor="oklch(0.70 0.20 220)" />
          </linearGradient>
          <radialGradient id="core-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.95 0.10 210 / 0.95)" />
            <stop offset="40%" stopColor="oklch(0.65 0.22 260 / 0.7)" />
            <stop offset="100%" stopColor="oklch(0.30 0.20 280 / 0)" />
          </radialGradient>
          <linearGradient id="vessel-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.96 0.04 210)" />
            <stop offset="100%" stopColor="oklch(0.60 0.20 250)" />
          </linearGradient>
        </defs>

        <TickMarks r={228} />
        <Ring r={220} stroke={6} value={mission} color="url(#ring-mission)" />
        <Ring r={188} stroke={5} value={finance} color="url(#ring-finance)" dashed />
        <Ring r={158} stroke={4} value={focus}   color="url(#ring-focus)" />

        {/* Ring labels */}
        <g className="font-display" style={{ fontSize: 9, letterSpacing: 2, fill: "oklch(0.85 0.10 215)" }}>
          <text x="250" y="18" textAnchor="middle">MISSION PROGRESS</text>
          <text x="250" y="492" textAnchor="middle">FOCUS</text>
          <text x="6" y="254" textAnchor="start">FINANCIAL</text>
          <text x="494" y="254" textAnchor="end">HEALTH</text>
        </g>

        {/* Core glow */}
        <circle cx="250" cy="250" r="110" fill="url(#core-grad)">
          <animate attributeName="r" values="108;116;108" dur="5s" repeatCount="indefinite" />
        </circle>

        {/* Holographic personal vessel — elegant arrow-craft with swept wings & engine glow */}
        <g transform="translate(250 250)">
          {/* engine trail glow */}
          <ellipse cx="0" cy="68" rx="22" ry="40" fill="oklch(0.78 0.18 215 / 0.35)" style={{ filter: "blur(8px)" }} />
          <ellipse cx="0" cy="58" rx="10" ry="22" fill="oklch(0.95 0.08 210 / 0.55)" style={{ filter: "blur(4px)" }} />
          {/* swept wings */}
          <path
            d="M -78 32 Q -40 28 -14 12 L -14 36 Q -42 44 -78 50 Z"
            fill="url(#vessel-grad)" opacity="0.55"
            stroke="oklch(0.88 0.10 210 / 0.7)" strokeWidth="0.8"
          />
          <path
            d="M 78 32 Q 40 28 14 12 L 14 36 Q 42 44 78 50 Z"
            fill="url(#vessel-grad)" opacity="0.55"
            stroke="oklch(0.88 0.10 210 / 0.7)" strokeWidth="0.8"
          />
          {/* fuselage — slim arrowhead */}
          <path
            d="M 0 -86 L 18 6 L 14 44 L 0 56 L -14 44 L -18 6 Z"
            fill="url(#vessel-grad)"
            stroke="oklch(0.96 0.08 210)" strokeWidth="1"
            style={{ filter: "drop-shadow(0 0 14px oklch(0.78 0.18 215 / 0.85))" }}
          />
          {/* cockpit canopy */}
          <ellipse cx="0" cy="-18" rx="5" ry="14" fill="oklch(0.95 0.08 210)" opacity="0.9" />
          {/* center spine */}
          <path d="M 0 -86 L 0 56" stroke="oklch(1 0 0 / 0.5)" strokeWidth="0.6" />
          {/* wing tip lights */}
          <circle cx="-78" cy="44" r="2.2" fill="oklch(0.95 0.08 210)">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="2.4s" repeatCount="indefinite" />
          </circle>
          <circle cx="78" cy="44" r="2.2" fill="oklch(0.78 0.22 295)">
            <animate attributeName="opacity" values="1;0.4;1" dur="2.4s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Inner HUD ring */}
        <circle cx="250" cy="250" r="128" fill="none"
          stroke="oklch(0.85 0.18 215 / 0.25)" strokeWidth="0.6" strokeDasharray="1 3" />
      </svg>

      {/* Floating Active Directive chip */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[6%] flex justify-center">
        <Link
          to={directive ? "/missions/$id" : "/missions"}
          params={directive ? { id: directive.id } : undefined}
          className="pointer-events-auto glass-panel holo-border group inline-flex max-w-[80%] items-center gap-3 rounded-full px-4 py-2 transition-transform hover:scale-[1.02]"
        >
          <span className="hud-text text-primary">Active Directive</span>
          <span className="h-3 w-px bg-primary/30" />
          <span className="min-w-0 truncate text-sm text-foreground">
            {directive?.title ?? "Declare your flagship mission"}
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
