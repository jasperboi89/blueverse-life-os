import { Link } from "@tanstack/react-router";
import { Rocket, ArrowRight } from "lucide-react";
import { GlassPanel } from "@/components/shell/GlassPanel";
import { useMissions } from "@/stores/missions";
import { HEALTH_COLOR } from "@/lib/enums";
import { cn } from "@/lib/utils";

export function FlagshipPanel() {
  const missions = useMissions((s) => s.missions);
  const flagship = missions
    .filter((m) => m.flagship && m.status !== "Archived")
    .sort((a, b) => b.progress - a.progress)[0];

  return (
    <GlassPanel eyebrow="Active Flagship" title={flagship?.name ?? "Awaiting Order"}>
      {!flagship ? (
        <div className="space-y-3 py-2">
          <div className="flex h-16 items-center justify-center rounded-xl border border-dashed border-primary/30 bg-primary/5">
            <Rocket className="h-6 w-6 text-primary/70" />
          </div>
          <p className="text-sm text-muted-foreground">
            No flagship mission yet. Declare one to ignite the engine.
          </p>
          <Link
            to="/missions"
            className="inline-flex items-center gap-1 text-xs font-display uppercase tracking-[0.2em] text-primary hover:underline"
          >
            Declare Flagship <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        <Link
          to="/missions/$id"
          params={{ id: flagship.id }}
          className="block space-y-3"
        >
          <p className="hud-text">{flagship.missionClass} · {flagship.difficulty}</p>
          <div>
            <div className="flex items-center justify-between text-xs">
              <span className={cn("font-display uppercase tracking-wider", HEALTH_COLOR[flagship.health])}>
                {flagship.health}
              </span>
              <span className="hud-text text-primary">{flagship.progress}%</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-primary/15">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent shadow-[0_0_12px_var(--primary)]"
                style={{ width: `${flagship.progress}%` }}
              />
            </div>
          </div>
          {flagship.successCriteria && (
            <p className="line-clamp-2 text-xs text-muted-foreground">
              {flagship.successCriteria}
            </p>
          )}
        </Link>
      )}
    </GlassPanel>
  );
}
