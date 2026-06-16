import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Radio, Activity, Compass, Sparkles } from "lucide-react";
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

  const stardate = now ? format(now, "yyyy.MM.dd") : "—";
  const localTime = now ? format(now, "HH:mm") : "—:—";

  return (
    <header className="flex flex-col gap-5 px-2 pt-2 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        <h1 className="font-display text-[28px] leading-tight text-foreground sm:text-[34px]">
          Welcome aboard, <span className="text-gradient-flare">{callSign}</span>.
        </h1>
        <p
          className="mt-2 flex items-center gap-3 text-[14px] text-muted-foreground"
          suppressHydrationWarning
        >
          <span
            className="inline-block h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]"
            style={{ animation: "signal-blink 2.4s ease-in-out infinite" }}
          />
          Stardate {stardate} · Local time {localTime}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <Chip icon={Compass} label="Vessel" value="Nominal" tone="cyan" />
        <Chip icon={Radio} label="Signal" value="Strong" tone="cyan" />
        <Chip icon={Activity} label="Missions" value={String(active)} tone="violet" />
        <Chip icon={Sparkles} label="Momentum" value={String(recent)} tone="violet" />
      </div>
    </header>
  );
}

function Chip({
  icon: Icon, label, value, tone,
}: {
  icon: typeof Radio;
  label: string;
  value: string;
  tone: "cyan" | "violet";
}) {
  const color = tone === "cyan" ? "oklch(0.88 0.16 210)" : "oklch(0.82 0.20 295)";
  return (
    <div
      className="inline-flex items-center gap-2.5 rounded-full border bg-white/[0.04] px-4 py-2 backdrop-blur-xl"
      style={{ borderColor: `${color.slice(0, -1)} / 0.35)` }}
    >
      <span
        className="inline-flex h-2 w-2 rounded-full"
        style={{ background: color, boxShadow: `0 0 10px ${color}` }}
      />
      <Icon className="h-4 w-4" style={{ color }} />
      <span className="text-[13px] text-muted-foreground">{label}</span>
      <span className="text-[13px] font-medium text-foreground">{value}</span>
    </div>
  );
}
