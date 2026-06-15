import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Radio, Activity, Compass } from "lucide-react";
import { useMissions } from "@/stores/missions";
import { useMomentum } from "@/stores/momentum";

export function BridgeStatusBar({ callSign }: { callSign: string }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(i);
  }, []);
  const active = useMissions((s) => s.missions.filter((m) => m.status === "Active").length);
  const recent = useMomentum((s) => s.events.length);

  return (
    <div className="glass-panel holo-border relative overflow-hidden px-4 py-3 sm:px-5">
      <div className="grid grid-cols-1 items-center gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
        <div className="min-w-0">
          <p className="hud-text flex items-center gap-2">
            <span
              className="inline-block h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]"
              style={{ animation: "signal-blink 2.4s ease-in-out infinite" }}
            />
            BRIDGE ONLINE · STARDATE {format(now, "yyyy.MM.dd")} · {format(now, "HH:mm")}
          </p>
          <p className="mt-1 truncate font-display text-2xl text-gradient-flare sm:text-3xl">
            Welcome aboard, {callSign}.
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Pill icon={Compass} label="Vessel" value="Nominal" />
          <Pill icon={Radio} label="Signal" value="Strong" />
          <Pill icon={Activity} label="Missions" value={String(active)} />
          <Pill icon={Activity} label="Momentum" value={String(recent)} />
        </div>
      </div>
    </div>
  );
}

function Pill({
  icon: Icon, label, value,
}: { icon: typeof Radio; label: string; value: string }) {
  return (
    <div className="hidden items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 sm:flex">
      <Icon className="h-3.5 w-3.5 text-primary" />
      <span className="hud-text">{label}</span>
      <span className="font-display text-xs text-foreground">{value}</span>
    </div>
  );
}
