import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { GlassPanel } from "@/components/shell/GlassPanel";
import { useArchive } from "@/stores/archive";

export function ArchiveEchoesPanel() {
  const memories = useArchive((s) => s.memories);
  const audio = useArchive((s) => s.audio);
  const last = memories[0];
  const lastAudio = audio[0];

  return (
    <GlassPanel
      eyebrow="Archive Echoes"
      title="Memory Vault"
      action={
        <Link
          to="/archive"
          className="text-xs font-display uppercase tracking-[0.2em] text-primary hover:underline inline-flex items-center gap-1"
        >
          Open <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      }
    >
      {!last && !lastAudio ? (
        <p className="text-sm text-muted-foreground">Archive quiet. First memory capsule awaits.</p>
      ) : (
        <div className="space-y-2">
          {last && (
            <div className="rounded-lg border border-primary/15 bg-primary/5 p-2.5">
              <p className="hud-text">Memory Capsule</p>
              <p className="truncate text-sm text-foreground">{last.title}</p>
              <p className="line-clamp-2 text-xs text-muted-foreground">{last.body}</p>
            </div>
          )}
          {lastAudio && (
            <div className="rounded-lg border border-accent/20 bg-accent/5 p-2.5">
              <p className="hud-text">{lastAudio.type}</p>
              <p className="truncate text-sm text-foreground">{lastAudio.title}</p>
            </div>
          )}
        </div>
      )}
    </GlassPanel>
  );
}
