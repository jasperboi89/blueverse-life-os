import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Activity, Sparkles } from "lucide-react";
import { BridgeStatusBar } from "@/components/bridge/BridgeStatusBar";
import { CinematicHero } from "@/components/bridge/CinematicHero";
import { FlagshipPanel } from "@/components/bridge/FlagshipPanel";
import { FinancialWeatherPanel } from "@/components/bridge/FinancialWeatherPanel";
import { NavigatorPanel } from "@/components/bridge/NavigatorPanel";
import { ArchiveEchoesPanel } from "@/components/bridge/ArchiveEchoesPanel";
import { MomentumFeed } from "@/components/bridge/MomentumFeed";
import { GlassPanel } from "@/components/shell/GlassPanel";
import { EmptyState } from "@/components/shell/form";
import { useMissions, activeMissions, flagshipMission } from "@/stores/missions";
import { useFinance } from "@/stores/finance";
import { useSettings } from "@/stores/settings";
import { financialHealthToIndex } from "@/lib/enums";
import { pageHead } from "@/lib/seo";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead(
      "Bridge · BlueVerse",
      "Step into your cinematic command lounge. Vessel, navigator, missions and momentum — calm, spacious, alive.",
      "Your starship bridge for a deliberate life.",
    ),
  component: Bridge,
});

function Bridge() {
  const missions = useMissions((s) => s.missions);
  const finance = useFinance();
  const focus = useSettings((s) => s.focusScore);
  const callSign = useSettings((s) => s.callSign);

  const active = activeMissions(missions);
  const overall = active.length
    ? Math.round(active.reduce((a, m) => a + m.progress, 0) / active.length)
    : 0;
  const financeIndex = financialHealthToIndex(finance.health);

  const flagship = flagshipMission(missions);

  const directiveLine = flagship
    ? `Course set: ${flagship.name}`
    : active[0]
      ? `Underway: ${active[0].name}`
      : "Awaiting your first flagship. Set your course.";

  const upcoming = missions
    .filter((m) => m.dueDate && m.status !== "Archived" && m.status !== "Completed")
    .sort((a, b) => (a.dueDate! < b.dueDate! ? -1 : 1))
    .slice(0, 3);

  return (
    <div className="bridge-command-wrap">
      <BridgeStatusBar callSign={callSign} />

      <section className="bridge-spatial-stage" aria-label="BlueVerse Bridge spatial cockpit">
        <div className="bridge-main-deck">
          <aside
            className="bridge-side-column bridge-side-column-left"
            aria-label="Left cockpit panes"
          >
            <FlagshipPanel />
            <FinancialWeatherPanel />
          </aside>

          <div className="bridge-center-column" aria-label="Central command view">
            <CinematicHero
              directive={directiveLine}
              mission={overall}
              finance={{
                label: finance.health,
                caption: `Weather · ${finance.weather}. ${financeIndex}% index.`,
              }}
              focus={focus}
              missionCaption={
                active.length
                  ? `${active.length} active mission${active.length === 1 ? "" : "s"} underway`
                  : "No active missions yet"
              }
              focusCaption="Tune in Settings · adjust as the day unfolds"
            />
          </div>

          <aside
            className="bridge-side-column bridge-side-column-right"
            aria-label="Right cockpit panes"
          >
            <NavigatorPanel />
            <GlassPanel eyebrow="Mission Field" title={`${active.length} Active`}>
              {missions.length === 0 ? (
                <EmptyState
                  icon={<Sparkles className="h-5 w-5 text-primary" />}
                  title="Mission field is clear."
                  hint="Plot your first mission to chart a course."
                  cta={{ to: "/missions", label: "Open Missions" }}
                />
              ) : (
                <>
                  <ul className="grid grid-cols-2 gap-3 text-[15px]">
                    <FieldRow label="Active" value={active.length} accent />
                    <FieldRow
                      label="Planned"
                      value={missions.filter((m) => m.status === "Planned").length}
                    />
                    <FieldRow
                      label="Paused"
                      value={missions.filter((m) => m.status === "Paused").length}
                    />
                    <FieldRow
                      label="Completed"
                      value={missions.filter((m) => m.status === "Completed").length}
                    />
                  </ul>
                  <Link
                    to="/missions"
                    className="mt-5 inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                  >
                    All missions <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </>
              )}
            </GlassPanel>
          </aside>
        </div>

        <div className="bridge-lower-deck-organized" aria-label="Lower cockpit deck">
          <GlassPanel
            eyebrow="Momentum Stream"
            title="Recent Motion"
            action={
              <Link
                to="/timeline"
                className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
              >
                Timeline <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            }
          >
            <MomentumFeed limit={5} />
          </GlassPanel>

          <GlassPanel eyebrow="Timeline Horizon" title="Approaching">
            {upcoming.length === 0 ? (
              <EmptyState
                icon={<Activity className="h-5 w-5 text-primary" />}
                title="Horizon clear."
                hint="Chart a due date on a mission to set a waypoint."
                cta={{ to: "/missions", label: "Set Waypoint" }}
              />
            ) : (
              <ul className="space-y-3">
                {upcoming.map((m) => (
                  <li key={m.id}>
                    <Link
                      to="/missions/$id"
                      params={{ id: m.id }}
                      className="block rounded-xl border border-primary/15 bg-primary/5 px-4 py-3 transition-colors hover:bg-primary/10"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-[15px] text-foreground">{m.name}</p>
                        <Activity className="h-4 w-4 shrink-0 text-primary" />
                      </div>
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        {m.dueDate
                          ? `In ${formatDistanceToNow(new Date(m.dueDate))}`
                          : "Unscheduled"}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </GlassPanel>

          <ArchiveEchoesPanel />
        </div>
      </section>
    </div>
  );
}

function FieldRow({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <li className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`font-display text-xl ${accent ? "text-primary" : "text-foreground"}`}>
        {value}
      </span>
    </li>
  );
}
