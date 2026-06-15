import { createFileRoute } from "@tanstack/react-router";
import { GlassPanel } from "@/components/shell/GlassPanel";

export const Route = createFileRoute("/knowledge")({
  head: () => ({
    meta: [
      { title: "Knowledge · BlueVerse" },
      { name: "description", content: "Your personal knowledge graph. Coming online in a later phase." },
      { property: "og:title", content: "Knowledge · BlueVerse" },
      { property: "og:description", content: "The library of what you've learned." },
    ],
  }),
  component: () => (
    <div className="space-y-6">
      <div>
        <p className="hud-text">Knowledge</p>
        <h1 className="font-display text-3xl text-gradient-cosmic sm:text-4xl">Personal Library</h1>
      </div>
      <GlassPanel eyebrow="Coming online" title="Knowledge Graph">
        <p className="text-sm text-muted-foreground">
          {/* future: adaptive */} Notes, references, and inter-linked concepts will live here. For now, capture
          insights as Memory Capsules in the Archive.
        </p>
      </GlassPanel>
    </div>
  ),
});
