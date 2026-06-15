import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Activity, Sparkles } from "lucide-react";
import { CommandCore } from "@/components/bridge/CommandCore";
import { BridgeStatusBar } from "@/components/bridge/BridgeStatusBar";
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
      { name: "description", content: "Your cinematic command deck. Vessel, mission field, financial weather and navigator signal at a glance." },
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

  const directiveLine = flagship
    ? `Course set: ${flagship.name}.`
    : active[0]
    ? `Underway: ${active[0].name}.`
    : "Awaiting first flagship. Set your course.";

  const upcoming = missions
    .filter((m) => m.dueDate && m.status !== "Archived" && m.status !== "Completed")
    .sort((a, b) => (a.dueDate! < b.dueDate! ? -1 : 1))
    .slice(0, 3);

  return (
    <div className="mx-auto w-full max-w-[1680px] space-y-8 pb-32">
      {/* STATUS BAR */}
      <BridgeStatusBar callSign={callSign} />

      {/* MAIN COCKPIT */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* LEFT CONSOLE */}
        <div className="space-y-8 lg:col-span-3 lg:order-1">
          <FlagshipPanel />
          <FinancialWeatherPanel />
        </div>

        {/* HERO CENTERPIECE */}
        <div className="lg:col-span-6 lg:order-2">
          <GlassPanel
            variant="hero"
            eyebrow="Vessel · Command Core"
            title="Personal Starship"
            className="h-full"
          >
            <CommandCore
              mission={overall}
              finance={financeIndex}
              focus={focus}
              directive={directive}
            />

            {/* Three large readable metric cards */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <CoreStat label="Mission Progress" value={`${overall}%`} hue="cyan" />
              <CoreStat label="Financial Health" value={finance.health} hue="violet" />
              <CoreStat label="Focus" value={`${focus}%`} hue="azure" />
            </div>

            {/* Dynamic directive */}
            <p className="mt-6 text-center font-display text-xl text-gradient-flare sm:text-2xl">
              {directiveLine}
            </p>
          </GlassPanel>
        </div>

        {/* RIGHT CONSOLE */}
        <div className="space-y-8 lg:col-span-3 lg:order-3">
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
                <ul className="space-y-2.5 text-[15px]">
                  <FieldRow label="Active" value={active.length} accent />
                  <FieldRow label="Planned" value={missions.filter((m) => m.status === "Planned").length} />
                  <FieldRow label="Paused" value={missions.filter((m) => m.status === "Paused").length} />
                  <FieldRow label="Completed" value={missions.filter((m) => m.status === "Completed").length} />
                </ul>
                <Link
                  to="/missions"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-display uppercase tracking-[0.22em] text-primary hover:underline"
                >
                  All missions <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </>
            )}
          </GlassPanel>
        </div>
      </div>

      {/* LOWER DECK — 3 wide panels */}
      <div className="grid gap-8 lg:grid-cols-3">
        <GlassPanel
          eyebrow="Momentum Stream"
          title="Recent Motion"
          action={
            <Link
              to="/timeline"
              className="inline-flex items-center gap-1.5 text-xs font-display uppercase tracking-[0.22em] text-primary hover:underline"
            >
              Full timeline <ArrowRight className="h-3.5 w-3.5" />
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
                    className="block rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 transition-colors hover:bg-primary/10"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate text-[15px] text-foreground">{m.name}</p>
                      <Activity className="h-4 w-4 shrink-0 text-primary" />
                    </div>
                    <p className="hud-text mt-1.5">
                      {m.dueDate ? `T- ${formatDistanceToNow(new Date(m.dueDate))}` : "Unscheduled"}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </GlassPanel>

        <ArchiveEchoesPanel />
      </div>
    </div>
  );
}

function FieldRow({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <li className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-display text-lg ${accent ? "text-primary" : "text-foreground"}`}>
        {value}
      </span>
    </li>
  );
}

function CoreStat({
  label, value, hue,
}: { label: string; value: string; hue: "cyan" | "violet" | "azure" }) {
  const color =
    hue === "cyan" ? "oklch(0.88 0.18 210)" :
    hue === "violet" ? "oklch(0.80 0.20 295)" :
    "oklch(0.90 0.14 195)";
  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-4 text-center">
      <p className="hud-text">{label}</p>
      <p
        className="mt-2 truncate font-display text-2xl sm:text-[28px]"
        style={{ color, textShadow: `0 0 14px ${color}` }}
      >
        {value}
      </p>
    </div>
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
      <p className="text-sm text-muted-foreground">{hint}</p>
      {cta && (
        <Link
          to={cta.to}
          className="mt-1 inline-flex items-center gap-1.5 text-xs font-display uppercase tracking-[0.22em] text-primary hover:underline"
        >
          {cta.label} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}
