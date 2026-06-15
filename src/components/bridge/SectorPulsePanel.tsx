import { GlassPanel } from "@/components/shell/GlassPanel";
import { SECTORS } from "@/lib/enums";
import { useMissions } from "@/stores/missions";

export function SectorPulsePanel() {
  const missions = useMissions((s) => s.missions);
  const counts = SECTORS.map((s) => ({
    sector: s,
    count: missions.filter((m) => m.domain === s && m.status !== "Archived").length,
  }));
  const max = Math.max(1, ...counts.map((c) => c.count));

  return (
    <GlassPanel eyebrow="Sector Pulse" title="Mission Field">
      <ul className="grid grid-cols-4 gap-2">
        {counts.map(({ sector, count }) => {
          const intensity = count / max;
          return (
            <li key={sector} className="flex flex-col items-center gap-1.5 rounded-lg border border-primary/15 bg-primary/5 p-2">
              <span
                className="block rounded-full"
                style={{
                  width: 14 + intensity * 14,
                  height: 14 + intensity * 14,
                  background: count
                    ? "radial-gradient(circle, oklch(0.85 0.18 215), oklch(0.55 0.22 280))"
                    : "oklch(0.40 0.04 270 / 0.6)",
                  boxShadow: count ? "0 0 12px oklch(0.78 0.18 215 / 0.8)" : "none",
                }}
              />
              <span className="hud-text truncate text-[9px]">{sector}</span>
              <span className="font-display text-xs text-foreground">{count}</span>
            </li>
          );
        })}
      </ul>
    </GlassPanel>
  );
}
