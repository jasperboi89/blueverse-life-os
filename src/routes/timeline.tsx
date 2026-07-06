import { createFileRoute } from "@tanstack/react-router";
import { GlassPanel } from "@/components/shell/GlassPanel";
import { MomentumFeed } from "@/components/bridge/MomentumFeed";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/timeline")({
  head: () =>
    pageHead(
      "Timeline · BlueVerse",
      "Every signal, in order. Your momentum field.",
      "Your momentum field, unfolded.",
    ),
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
