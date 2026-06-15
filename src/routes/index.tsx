import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Activity } from "lucide-react";
import { CommandCore } from "@/components/bridge/CommandCore";
import { BridgeStatusBar } from "@/components/bridge/BridgeStatusBar";
import { FlagshipPanel } from "@/components/bridge/FlagshipPanel";
import { FinancialWeatherPanel } from "@/components/bridge/FinancialWeatherPanel";
import { NavigatorPanel } from "@/components/bridge/NavigatorPanel";
import { SectorPulsePanel } from "@/components/bridge/SectorPulsePanel";
import { ArchiveEchoesPanel } from "@/components/bridge/ArchiveEchoesPanel";
import { UniverseStatePanel } from "@/components/bridge/UniverseStatePanel";
import { MomentumFeed } from "@/components/bridge/MomentumFeed";
import { GlassPanel } from "@/components/shell/GlassPanel";
import { useMissions } from "@/stores/missions";
import { useFinance } from "@/stores/finance";
import { useSettings } from "@/stores/settings";
import { FINANCIAL_HEALTHS } from "@/lib/enums";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bridge · BlueVerse" },
      { name: "description", content: "Command deck. Vessel core, mission field, financial weather and navigator signal at a glance." },
      { property: "og:title", content: "Bridge · BlueVerse" },
      { property: "og:description", content: "Your starship bridge for a deliberate life." },
    ],
  }),
  component: Bridge,
});

function Bridge() {
  const missions = useMissions((s) => s.missions);
  const finance = useFinance();
  const focus = useSettings((s) => s.focusScore);
  const callSign = useSettings((s) => s.callSign);

  const active = missions.filter((m) => m.status === "Active");
  const overall = active.length
    ? Math.round(active.reduce((a, m) => a + m.progress, 0) / active.length)
    : 0;

  const financeIndex = Math.max(8, 100 - FINANCIAL_HEALTHS.indexOf(finance.health) * 22);

  const flagship = missions
    .filter((m) => m.flagship && m.status !== "Archived")
    .sort((a, b) => b.progress - a.progress)[0];

  const directive = flagship
    ? { id: flagship.id, title: flagship.name, subtitle: flagship.missionClass }
    : active[0]
    ? { id: active[0].id, title: active[0].name, subtitle: active[0].missionClass }
    : null;

  const upcoming = missions
    .filter((m) => m.dueDate && m.status !== "Archived" && m.status !== "Completed")
    .sort((a, b) => (a.dueDate! < b.dueDate! ? -1 : 1))
    .slice(0, 3);

  return (
    <div className="space-y-5">
      {/* STATUS BAR */}
      <BridgeStatusBar callSign={callSign} />

      {/* COCKPIT MAIN GRID */}
      <div className="grid gap-5 lg:grid-cols-12">
        {/* LEFT CONSOLE */}
        <div className="space-y-5 lg:col-span-3 lg:order-1">
          <FlagshipPanel />
          <FinancialWeatherPanel />
          <SectorPulsePanel />
        </div>

        {/* CENTER HERO */}
        <div className="lg:col-span-6 lg:order-2">
          <GlassPanel
            variant="hero"
            eyebrow="Vessel · Command Core"
            title="Dynamic Core"
            className="h-full"
          >
            <CommandCore
              mission={overall}
              finance={financeIndex}
              focus={focus}
              directive={directive}
            />
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <CoreStat label="Mission" value={`${overall}%`} hue="cyan" />
              <CoreStat label="Financial" value={finance.health} hue="violet" />
              <CoreStat label="Focus" value={`${focus}%`} hue="azure" />
            </div>
          </GlassPanel>
        </div>

        {/* RIGHT CONSOLE */}
        <div className="space-y-5 lg:col-span-3 lg:order-3">
          <NavigatorPanel />
          <GlassPanel eyebrow="Mission Field" title={`${active.length} Active`}>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-between"><span className="text-muted-foreground">Active</span><span className="font-display text-primary">{active.length}</span></li>
              <li className="flex items-center justify-between"><span className="text-muted-foreground">Planned</span><span className="font-display text-foreground">{missions.filter(m=>m.status==="Planned").length}</span></li>
              <li className="flex items-center justify-between"><span className="text-muted-foreground">Paused</span><span className="font-display text-foreground">{missions.filter(m=>m.status==="Paused").length}</span></li>
              <li className="flex items-center justify-between"><span className="text-muted-foreground">Completed</span><span className="font-display text-foreground">{missions.filter(m=>m.status==="Completed").length}</span></li>
            </ul>
            <Link to="/missions" className="mt-3 inline-flex items-center gap-1 text-xs font-display uppercase tracking-[0.2em] text-primary hover:underline">
              All missions <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </GlassPanel>
          <ArchiveEchoesPanel />
        </div>
      </div>

      {/* LOWER DECK */}
      <div className="grid gap-5 lg:grid-cols-3">
        <GlassPanel
          eyebrow="Momentum Stream"
          title="Recent Motion"
          action={
            <Link to="/timeline" className="text-xs font-display uppercase tracking-[0.2em] text-primary hover:underline inline-flex items-center gap-1">
              Full timeline <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
        >
          <MomentumFeed limit={5} />
        </GlassPanel>

        <GlassPanel eyebrow="Timeline Horizon" title="Approaching">
          {upcoming.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No upcoming horizons. Set a due date on a mission to chart it.
            </p>
          ) : (
            <ul className="space-y-2">
              {upcoming.map((m) => (
                <li key={m.id}>
                  <Link
                    to="/missions/$id"
                    params={{ id: m.id }}
                    className="block rounded-lg border border-primary/15 bg-primary/5 p-2.5 transition-colors hover:bg-primary/10"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm text-foreground">{m.name}</p>
                      <Activity className="h-3.5 w-3.5 shrink-0 text-primary" />
                    </div>
                    <p className="hud-text">
                      {m.dueDate ? `T-${formatDistanceToNow(new Date(m.dueDate))}` : "Unscheduled"}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </GlassPanel>

        <UniverseStatePanel />
      </div>
    </div>
  );
}

function CoreStat({
  label, value, hue,
}: { label: string; value: string; hue: "cyan" | "violet" | "azure" }) {
  const color =
    hue === "cyan" ? "oklch(0.85 0.18 210)" :
    hue === "violet" ? "oklch(0.78 0.20 295)" :
    "oklch(0.90 0.14 195)";
  return (
    <div className="rounded-xl border border-primary/15 bg-primary/5 px-2 py-2">
      <p className="hud-text">{label}</p>
      <p
        className="truncate font-display text-base"
        style={{ color, textShadow: `0 0 12px ${color}` }}
      >
        {value}
      </p>
    </div>
  );
}
