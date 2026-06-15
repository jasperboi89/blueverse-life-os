import { createFileRoute } from "@tanstack/react-router";
import { GlassPanel } from "@/components/shell/GlassPanel";

export const Route = createFileRoute("/communications")({
  head: () => ({
    meta: [
      { title: "Communications · BlueVerse" },
      { name: "description", content: "Inbound and outbound signal. Future bridge channel." },
      { property: "og:title", content: "Communications · BlueVerse" },
      { property: "og:description", content: "The bridge channel." },
    ],
  }),
  component: () => (
    <div className="space-y-6">
      <div>
        <p className="hud-text">Communications</p>
        <h1 className="font-display text-3xl text-gradient-cosmic sm:text-4xl">Bridge Channel</h1>
      </div>
      <GlassPanel eyebrow="Coming online" title="Signal Inbox">
        <p className="text-sm text-muted-foreground">
          {/* future: adaptive */} Daily briefings from your Navigator, drafts to important people, and the
          outbound channel will live here.
        </p>
      </GlassPanel>
    </div>
  ),
});
