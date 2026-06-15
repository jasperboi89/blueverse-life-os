import { motion } from "framer-motion";
import { Sparkles, MessageCircle } from "lucide-react";
import { GlassPanel } from "@/components/shell/GlassPanel";
import { useSettings } from "@/stores/settings";
import { useMissions } from "@/stores/missions";
import navigatorAsset from "@/assets/navigator-liam.png.asset.json";
import { Button } from "@/components/ui/button";

export function NavigatorPanel() {
  const name = useSettings((s) => s.navigatorName);
  const callSign = useSettings((s) => s.callSign);
  const missions = useMissions((s) => s.missions);

  // future: adaptive — replace with real Navigator inference
  const active = missions.filter((m) => m.status === "Active");
  const recommendation =
    active.length === 0
      ? "No active mission. A small step today is still motion."
      : active.length === 1
      ? `Focus the bridge on “${active[0].name}.” Single-target days build momentum fastest.`
      : `You have ${active.length} active missions. Pick one flagship for the next 90 minutes.`;

  return (
    <GlassPanel eyebrow="Navigator Signal" title={`${name}`} variant="hero">
      <div className="flex items-start gap-4">
        <div className="relative shrink-0">
          <div
            className="absolute -inset-2 rounded-full"
            style={{
              background:
                "radial-gradient(circle, oklch(0.78 0.18 215 / 0.55), transparent 70%)",
              filter: "blur(8px)",
              animation: "core-pulse 4s ease-in-out infinite",
            }}
          />
          <div className="relative h-20 w-20 overflow-hidden rounded-full ring-2 ring-primary/60 shadow-[0_0_20px_var(--primary)]">
            <img src={navigatorImg} alt={name} className="h-full w-full object-cover" />
          </div>
          <span className="absolute right-0 bottom-0 h-3 w-3 rounded-full bg-primary ring-2 ring-background shadow-[0_0_10px_var(--primary)]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="hud-text text-primary">Standing by, {callSign}.</p>
          <p className="mt-2 text-sm leading-relaxed text-foreground/90">
            “{recommendation}”
          </p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="border-primary/30 bg-primary/10 text-foreground hover:bg-primary/20"
          onClick={() => window.dispatchEvent(new CustomEvent("blueverse:quick-capture"))}
        >
          <MessageCircle className="mr-1.5 h-4 w-4" />
          Brief Me
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-accent/30 bg-accent/10 text-foreground hover:bg-accent/20"
          onClick={() => window.dispatchEvent(new CustomEvent("blueverse:quick-capture"))}
        >
          <Sparkles className="mr-1.5 h-4 w-4" />
          Log Signal
        </Button>
      </div>
    </GlassPanel>
  );
}
