import { createFileRoute, Link } from "@tanstack/react-router";
import { GlassPanel } from "@/components/shell/GlassPanel";
import { Vessel } from "@/components/bridge/Vessel";
import { useMissions } from "@/stores/missions";
import { SECTORS } from "@/lib/enums";

export const Route = createFileRoute("/observatory")({
  head: () => ({
    meta: [
      { title: "Observatory · BlueVerse" },
      { name: "description", content: "A visual overview of your vessel, sectors, missions, and legacy." },
      { property: "og:title", content: "Observatory · BlueVerse" },
      { property: "og:description", content: "See your life laid out across the universe." },
    ],
  }),
  component: Observatory,
});

function Observatory() {
  const missions = useMissions((s) => s.missions);
  const active = missions.filter((m) => m.status === "Active");
  const overall = active.length ? Math.round(active.reduce((a, m) => a + m.progress, 0) / active.length) : 0;

  const bySector = SECTORS.map((s) => {
    const inSector = missions.filter((m) => m.domain === s);
    const avg = inSector.length ? Math.round(inSector.reduce((a, m) => a + m.progress, 0) / inSector.length) : 0;
    return { sector: s, count: inSector.length, level: avg };
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="hud-text">Observatory</p>
        <h1 className="font-display text-3xl text-gradient-cosmic sm:text-4xl">The Universe</h1>
        <p className="text-sm text-muted-foreground">A bird's-eye view of the vessel and the territory ahead.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <GlassPanel eyebrow="Vessel" title="Current Form">
          <Vessel progress={overall} label="Overall Resonance" />
        </GlassPanel>

        <GlassPanel eyebrow="Universe Map" title="Active Constellation">
          <UniverseMap />
          <p className="mt-2 text-xs text-muted-foreground">{/* future: adaptive */} Universe evolution rendering arrives in a future phase.</p>
        </GlassPanel>
      </div>

      <GlassPanel eyebrow="Sectors" title="Life Sectors">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {bySector.map(({ sector, count, level }) => (
            <Link key={sector} to="/missions" className="block">
              <div className="rounded-xl border border-primary/15 bg-primary/5 p-3 hover:bg-primary/10">
                <p className="hud-text">{count} mission{count === 1 ? "" : "s"}</p>
                <p className="font-display text-lg text-foreground">{sector}</p>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-primary/15">
                  <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: `${level}%` }} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Domain level · {level}</p>
              </div>
            </Link>
          ))}
        </div>
      </GlassPanel>

      <GlassPanel eyebrow="Legacy" title="Banner Placeholders">
        <div className="grid gap-3 sm:grid-cols-3">
          {["First Voyage", "Storm Survived", "Era Closed"].map((t) => (
            <div key={t} className="flex h-24 items-center justify-center rounded-xl border border-dashed border-primary/30 bg-primary/5">
              <p className="hud-text text-primary">{t}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">{/* future: adaptive */} Earned banners will populate as you complete legacy-class arcs.</p>
      </GlassPanel>
    </div>
  );
}

function UniverseMap() {
  const missions = useMissions((s) => s.missions.filter((m) => m.status === "Active").slice(0, 9));
  const cx = 150, cy = 110;
  return (
    <svg viewBox="0 0 300 220" className="h-auto w-full">
      <defs>
        <radialGradient id="sun" cx="50%" cy="50%">
          <stop offset="0%" stopColor="oklch(0.92 0.10 210)" />
          <stop offset="100%" stopColor="oklch(0.50 0.20 280 / 0)" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r="60" fill="url(#sun)" />
      <circle cx={cx} cy={cy} r="18" fill="oklch(0.85 0.18 210)" />
      {missions.map((m, i) => {
        const angle = (i / Math.max(missions.length, 1)) * Math.PI * 2;
        const r = 70 + (i % 3) * 18;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        return (
          <g key={m.id}>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="oklch(0.78 0.18 215 / 0.18)" />
            <circle cx={x} cy={y} r={4 + (m.progress / 100) * 4} fill="oklch(0.78 0.20 295)" />
            <text x={x + 6} y={y + 3} fontSize="6" fill="oklch(0.85 0.05 230)" fontFamily="Orbitron">
              {m.name.slice(0, 16)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
