import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Radio, Activity, Compass } from "lucide-react";
import { useMissions } from "@/stores/missions";
import { useMomentum } from "@/stores/momentum";

export function BridgeStatusBar({ callSign }: { callSign: string }) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const i = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(i);
  }, []);
  const active = useMissions((s) => s.missions.filter((m) => m.status === "Active").length);
  const recent = useMomentum((s) => s.events.length);

  return (
    <div className="glass-panel holo-border relative overflow-hidden px-6 py-5 sm:px-8">
      <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
        <div className="min-w-0">
          <p className="hud-text flex items-center gap-2.5">
            <span
              className="inline-block h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]"
              style={{ animation: "signal-blink 2.4s ease-in-out infinite" }}
            />
            <span suppressHydrationWarning>
              {now
                ? `Bridge Online · Stardate ${format(now, "yyyy.MM.dd")} · ${format(now, "HH:mm")}`
                : "Bridge Online"}
            </span>
          </p>
          <p className="mt-2 truncate font-display text-3xl text-gradient-flare sm:text-4xl">
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
    <div className="hidden items-center gap-2.5 rounded-full border border-primary/25 bg-primary/5 px-4 py-1.5 sm:flex">
      <Icon className="h-4 w-4 text-primary" />
      <span className="hud-text">{label}</span>
      <span className="font-display text-sm text-foreground">{value}</span>
    </div>
  );
}
