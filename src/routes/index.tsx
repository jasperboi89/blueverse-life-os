import { createFileRoute, Link } from "@tanstack/react-router";
import { Target, Wallet, Brain, ArrowRight } from "lucide-react";
import { Vessel } from "@/components/bridge/Vessel";
import { MetricRing } from "@/components/bridge/MetricRing";
import { MomentumFeed } from "@/components/bridge/MomentumFeed";
import { GlassPanel } from "@/components/shell/GlassPanel";
import { useMissions } from "@/stores/missions";
import { useFinance } from "@/stores/finance";
import { useSettings } from "@/stores/settings";
import { FINANCIAL_HEALTHS, WEATHER_GRADIENT } from "@/lib/enums";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bridge · BlueVerse" },
      { name: "description", content: "Command deck. Your daily signal, mission progress, and momentum at a glance." },
      { property: "og:title", content: "Bridge · BlueVerse" },
      { property: "og:description", content: "Command deck. Your daily signal at a glance." },
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

  const financeIndex =
    100 - (FINANCIAL_HEALTHS.indexOf(finance.health) * 22);

  const flagships = missions.filter((m) => m.flagship && m.status !== "Archived").slice(0, 3);
  const upcomingBills = [...finance.bills].sort((a, b) => a.dueDay - b.dueDay).slice(0, 3);
  const totalDue = upcomingBills.reduce((a, b) => a + b.amount, 0);

  return (
    <div className="space-y-6">
      {/* Greeting header */}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
        <div className="min-w-0">
          <p className="hud-text">Stardate {new Date().toISOString().slice(0, 10)}</p>
          <h1 className="truncate font-display text-3xl text-gradient-cosmic sm:text-5xl">
            Welcome aboard, {callSign}.
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            The bridge is calibrated. {active.length} active mission{active.length === 1 ? "" : "s"}, momentum is steady.
          </p>
        </div>
      </div>

      {/* Vessel + Core Metrics */}
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <GlassPanel eyebrow="Vessel · Command Core" title="Dynamic Core">
          <Vessel progress={overall} />
          <p className="mt-2 text-center text-xs text-muted-foreground">
            {/* future: adaptive — replace with real-time core diagnostics */}
            Core resonance synchronized to active mission field.
          </p>
        </GlassPanel>

        <div className="space-y-4">
          <GlassPanel eyebrow="Core Metric" title="Mission Progress">
            <MetricRing label="Across active missions" value={overall} icon={Target} hue="cyan" />
          </GlassPanel>
          <GlassPanel eyebrow="Core Metric" title="Financial Health">
            <MetricRing label={finance.health} value={Math.max(8, financeIndex)} display={finance.health} icon={Wallet} hue="violet" />
          </GlassPanel>
          <GlassPanel eyebrow="Core Metric" title="Focus">
            <MetricRing label="Today's signal" value={focus} icon={Brain} hue="amber" />
          </GlassPanel>
        </div>
      </div>

      {/* Active missions + finance snapshot */}
      <div className="grid gap-6 lg:grid-cols-3">
        <GlassPanel
          className="lg:col-span-2"
          eyebrow="Mission Command"
          title="Active Flagships"
          action={
            <Button asChild variant="ghost" size="sm" className="text-primary">
              <Link to="/missions">All <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          }
        >
          {flagships.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No flagship missions yet.{" "}
              <Link to="/missions" className="text-primary underline">Declare one.</Link>
            </p>
          ) : (
            <ul className="space-y-3">
              {flagships.map((m) => (
                <li key={m.id}>
                  <Link
                    to="/missions/$id"
                    params={{ id: m.id }}
                    className="block rounded-xl border border-primary/15 bg-primary/5 p-3 transition-colors hover:bg-primary/10"
                  >
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-display text-foreground">{m.name}</p>
                        <p className="hud-text">{m.missionClass} · {m.difficulty} · {m.domain}</p>
                      </div>
                      <span className="hud-text text-primary">{m.progress}%</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-primary/15">
                      <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${m.progress}%` }} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </GlassPanel>

        <GlassPanel
          eyebrow="Financial Command"
          title="Snapshot"
          action={
            <Button asChild variant="ghost" size="sm" className="text-primary">
              <Link to="/finance">Open <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          }
        >
          <div className={cn("mb-3 rounded-xl bg-gradient-to-br p-3", WEATHER_GRADIENT[finance.weather])}>
            <p className="hud-text">Weather</p>
            <p className="font-display text-2xl text-foreground">{finance.weather}</p>
          </div>
          <ul className="space-y-2 text-sm">
            {upcomingBills.length === 0 && <li className="text-muted-foreground">No bills logged.</li>}
            {upcomingBills.map((b) => (
              <li key={b.id} className="flex items-center justify-between">
                <span className="text-foreground">{b.name}</span>
                <span className="text-muted-foreground">Day {b.dueDay} · ${b.amount.toLocaleString()}</span>
              </li>
            ))}
          </ul>
          {upcomingBills.length > 0 && (
            <p className="mt-3 hud-text">Upcoming due ≈ ${totalDue.toLocaleString()}</p>
          )}
        </GlassPanel>
      </div>

      {/* Timeline preview + momentum */}
      <div className="grid gap-6 lg:grid-cols-2">
        <GlassPanel
          eyebrow="Timeline"
          title="Recent Signal"
          action={
            <Button asChild variant="ghost" size="sm" className="text-primary">
              <Link to="/timeline">Full timeline <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          }
        >
          <MomentumFeed limit={5} />
        </GlassPanel>
        <GlassPanel eyebrow="Momentum" title="Progress Field">
          <MomentumFeed limit={8} />
        </GlassPanel>
      </div>
    </div>
  );
}
