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
        <motion.div
          className="relative shrink-0"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
        >
          {/* outer breathing halo */}
          <div
            className="pointer-events-none absolute -inset-3 rounded-full"
            style={{
              background:
                "radial-gradient(circle, oklch(0.78 0.18 215 / 0.55), transparent 70%)",
              filter: "blur(10px)",
              animation: "core-pulse 4s ease-in-out infinite",
            }}
          />
          {/* spinning conic ring */}
          <motion.div
            className="pointer-events-none absolute -inset-1.5 rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0deg, oklch(0.88 0.18 215 / 0.85) 40deg, transparent 110deg, transparent 360deg)",
              WebkitMask:
                "radial-gradient(circle, transparent 56%, #000 58%)",
              mask: "radial-gradient(circle, transparent 56%, #000 58%)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 7, ease: "linear", repeat: Infinity }}
          />
          {/* avatar */}
          <div className="relative h-20 w-20 overflow-hidden rounded-full ring-2 ring-primary/60 shadow-[0_0_24px_var(--primary)]">
            <img
              src={navigatorAsset.url}
              alt={name}
              className="h-full w-full object-cover"
            />
            {/* scanline overlay */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to bottom, transparent 0px, transparent 2px, oklch(0.85 0.18 215 / 0.18) 2px, oklch(0.85 0.18 215 / 0.18) 3px)",
                mixBlendMode: "screen",
              }}
            />
            {/* sweeping light bar */}
            <motion.div
              className="pointer-events-none absolute inset-y-0 w-1/2"
              style={{
                background:
                  "linear-gradient(90deg, transparent, oklch(0.95 0.10 210 / 0.35), transparent)",
              }}
              animate={{ x: ["-100%", "220%"] }}
              transition={{ duration: 4.5, ease: "linear", repeat: Infinity, repeatDelay: 2 }}
            />
            {/* cyan color wash */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, oklch(0.55 0.18 215 / 0.15), oklch(0.30 0.20 280 / 0.15))",
                mixBlendMode: "color",
              }}
            />
          </div>
          {/* status dot */}
          <span
            className="absolute right-0 bottom-0 h-3 w-3 rounded-full bg-primary ring-2 ring-background shadow-[0_0_10px_var(--primary)]"
            style={{ animation: "signal-blink 2.4s ease-in-out infinite" }}
          />
        </motion.div>

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
