import { createFileRoute } from "@tanstack/react-router";
import { GlassPanel } from "@/components/shell/GlassPanel";
import { MomentumFeed } from "@/components/bridge/MomentumFeed";

export const Route = createFileRoute("/timeline")({
  head: () => ({
    meta: [
      { title: "Timeline · BlueVerse" },
      { name: "description", content: "Every signal, in order. Your momentum field." },
      { property: "og:title", content: "Timeline · BlueVerse" },
      { property: "og:description", content: "Your momentum field, unfolded." },
    ],
  }),
  component: TimelinePage,
});

function TimelinePage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="hud-text">Timeline</p>
        <h1 className="font-display text-3xl text-gradient-cosmic sm:text-4xl">Your Signal</h1>
        <p className="text-sm text-muted-foreground">Every move you've logged, in order.</p>
      </div>
      <GlassPanel eyebrow="Momentum" title="Full Feed">
        <MomentumFeed limit={200} />
      </GlassPanel>
    </div>
  );
}
