import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { GlassPanel } from "@/components/shell/GlassPanel";
import { useMissions } from "@/stores/missions";

export function UniverseStatePanel() {
  const missions = useMissions((s) => s.missions);
  const active = missions.filter((m) => m.status !== "Archived").slice(0, 14);

  return (
    <GlassPanel
      eyebrow="Universe State"
      title="Constellation"
      action={
        <Link to="/observatory" className="text-xs font-display uppercase tracking-[0.2em] text-primary hover:underline inline-flex items-center gap-1">
          Observatory <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      }
    >
      <div className="relative h-32 overflow-hidden rounded-xl border border-primary/15 bg-[radial-gradient(circle_at_30%_30%,oklch(0.30_0.18_270/0.5),transparent_60%),radial-gradient(circle_at_70%_70%,oklch(0.30_0.18_220/0.4),transparent_60%)]">
        <svg viewBox="0 0 300 130" className="absolute inset-0 h-full w-full">
          {active.map((m, i) => {
            const x = 20 + ((i * 47) % 260);
            const y = 20 + ((i * 31) % 90);
            const r = 2 + (m.progress / 100) * 4;
            return (
              <g key={m.id}>
                <circle cx={x} cy={y} r={r}
                  fill="oklch(0.85 0.18 215)"
                  style={{ filter: "drop-shadow(0 0 6px oklch(0.78 0.18 215 / 0.9))" }} />
                {i > 0 && (() => {
                  const px = 20 + (((i - 1) * 47) % 260);
                  const py = 20 + (((i - 1) * 31) % 90);
                  return (
                    <line x1={px} y1={py} x2={x} y2={y}
                      stroke="oklch(0.78 0.18 215 / 0.25)" strokeWidth="0.6" />
                  );
                })()}
              </g>
            );
          })}
          {active.length === 0 && (
            <text x="150" y="68" textAnchor="middle"
              className="font-display" style={{ fontSize: 9, fill: "oklch(0.70 0.05 240)", letterSpacing: 2 }}>
              UNCHARTED · BEGIN A MISSION
            </text>
          )}
        </svg>
      </div>
      <p className="mt-2 hud-text">{active.length} stars · {missions.filter((m) => m.status === "Active").length} burning</p>
    </GlassPanel>
  );
}
