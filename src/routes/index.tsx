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
import { useMissions } from "@/stores/missions";
import { useFinance } from "@/stores/finance";
import { useSettings } from "@/stores/settings";
import { FINANCIAL_HEALTHS } from "@/lib/enums";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bridge · BlueVerse" },
      { name: "description", content: "Step into your cinematic command lounge. Vessel, navigator, missions and momentum — calm, spacious, alive." },
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
    <div className="mx-auto w-full max-w-[1600px] space-y-14 px-6 pt-10 pb-48 sm:px-10 sm:pt-14 lg:px-14">
      {/* 1 · CINEMATIC HEADER */}
      <BridgeStatusBar callSign={callSign} />

      {/* 2 · HERO */}
      <div className="cockpit-stage">
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

      {/* 3 · CONSOLE ROW — curved cockpit panes */}
      <div className="cockpit-stage grid gap-8 pt-6 lg:grid-cols-3">
        <div
          className="holo-pane drift-a"
          style={{ ["--pane-ry" as any]: "7deg", transformOrigin: "right center" }}
        >
          <FlagshipPanel />
        </div>
        <div
          className="holo-pane drift-b"
          style={{ ["--pane-ry" as any]: "0deg", transform: "translateZ(14px)" }}
        >
          <NavigatorPanel />
        </div>
        <div
          className="holo-pane drift-c"
          style={{ ["--pane-ry" as any]: "-7deg", transformOrigin: "left center" }}
        >
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
                  <FieldRow label="Planned" value={missions.filter((m) => m.status === "Planned").length} />
                  <FieldRow label="Paused" value={missions.filter((m) => m.status === "Paused").length} />
                  <FieldRow label="Completed" value={missions.filter((m) => m.status === "Completed").length} />
                </ul>
                <Link
                  to="/missions"
                  className="mt-5 inline-flex items-center gap-1.5 text-[13px] text-primary hover:underline"
                >
                  All missions <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </>
            )}
          </GlassPanel>
        </div>
      </div>

      {/* 4 · FINANCE WIDE */}
      <div className="cockpit-stage pt-6">
        <div className="holo-pane drift-b" style={{ ["--pane-ry" as any]: "0deg" }}>
          <FinancialWeatherPanel />
        </div>
      </div>

      {/* 5 · LOWER DECK */}
      <div className="cockpit-stage grid gap-8 pt-6 lg:grid-cols-3">
        <div
          className="holo-pane drift-a"
          style={{ ["--pane-ry" as any]: "5deg", transformOrigin: "right center" }}
        >
          <GlassPanel
            eyebrow="Momentum Stream"
            title="Recent Motion"
            action={
              <Link
                to="/timeline"
                className="inline-flex items-center gap-1.5 text-[12px] text-primary hover:underline"
              >
                Timeline <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            }
          >
            <MomentumFeed limit={5} />
          </GlassPanel>
        </div>

        <div
          className="holo-pane drift-c"
          style={{ ["--pane-ry" as any]: "0deg", transform: "translateZ(18px)" }}
        >
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
                      <p className="mt-1.5 text-[12px] text-muted-foreground">
                        {m.dueDate ? `In ${formatDistanceToNow(new Date(m.dueDate))}` : "Unscheduled"}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </GlassPanel>
        </div>

        <div
          className="holo-pane drift-b"
          style={{ ["--pane-ry" as any]: "-5deg", transformOrigin: "left center" }}
        >
          <ArchiveEchoesPanel />
        </div>
      </div>
    </div>

  );
}

function FieldRow({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <li className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
      <span className="text-[13px] text-muted-foreground">{label}</span>
      <span className={`font-display text-xl ${accent ? "text-primary" : "text-foreground"}`}>
        {value}
      </span>
    </li>
  );
}

function EmptyState({
  icon, title, hint, cta,
}: {
  icon: React.ReactNode;
  title: string;
  hint: string;
  cta?: { to: string; label: string };
}) {
  return (
    <div className="flex flex-col items-start gap-3 py-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/25 bg-primary/10">
        {icon}
      </div>
      <p className="font-display text-base text-foreground">{title}</p>
      <p className="text-[14px] text-muted-foreground">{hint}</p>
      {cta && (
        <Link
          to={cta.to}
          className="mt-1 inline-flex items-center gap-1.5 text-[13px] text-primary hover:underline"
        >
          {cta.label} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}
