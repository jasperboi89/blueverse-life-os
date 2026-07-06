import { Link } from "@tanstack/react-router";
import { Rocket } from "lucide-react";
import { GlassPanel } from "@/components/shell/GlassPanel";
import { EmptyState } from "@/components/shell/form";
import { useMissions, flagshipMission } from "@/stores/missions";
import { HEALTH_COLOR } from "@/lib/enums";
import { cn } from "@/lib/utils";

export function FlagshipPanel() {
  const missions = useMissions((s) => s.missions);
  const flagship = flagshipMission(missions);

  return (
    <GlassPanel eyebrow="Active Flagship" title={flagship?.name ?? "Awaiting Order"}>
      {!flagship ? (
        <EmptyState
          icon={<Rocket className="h-5 w-5 text-primary" />}
          title="No flagship yet."
          hint="Declare one to ignite the engine."
          cta={{ to: "/missions", label: "Declare Flagship" }}
        />
      ) : (
        <Link to="/missions/$id" params={{ id: flagship.id }} className="block space-y-3">
          <p className="hud-text">
            {flagship.missionClass} · {flagship.difficulty}
          </p>
          <div>
            <div className="flex items-center justify-between text-xs">
              <span
                className={cn(
                  "font-display uppercase tracking-wider",
                  HEALTH_COLOR[flagship.health],
                )}
              >
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
            <p className="line-clamp-2 text-xs text-muted-foreground">{flagship.successCriteria}</p>
          )}
        </Link>
      )}
    </GlassPanel>
  );
}
