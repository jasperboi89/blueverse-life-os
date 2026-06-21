import { useSettings } from "@/stores/settings";
import navigatorAsset from "@/assets/navigator-avatar.png.asset.json";

export function NavigatorPresence() {
  const name = useSettings((s) => s.navigatorName);
  const callSign = useSettings((s) => s.callSign);

  return (
    <div className="glass-panel holo-border flex items-center gap-3 px-3 py-2">
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-1 ring-primary/40">
        <img
          src={navigatorAsset.url}
          alt="Navigator"
          width={40}
          height={40}
          className="h-full w-full object-cover"
          style={{ animation: "core-pulse 5s ease-in-out infinite" }}
        />
        <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]"
          style={{ animation: "signal-blink 2.4s ease-in-out infinite" }} />
      </div>
      <div className="min-w-0">
        <p className="hud-text leading-tight">Navigator · {name}</p>
        <p className="truncate text-xs text-muted-foreground">Standing by, {callSign}.</p>
      </div>
    </div>
  );
}

