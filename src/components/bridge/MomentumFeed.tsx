import { useMomentum } from "@/stores/momentum";
import { formatDistanceToNow } from "date-fns";
import { Activity, Wallet, Target, Sparkles, Scroll } from "lucide-react";

const ICON = {
  mission: Target,
  finance: Wallet,
  archive: Sparkles,
  constitution: Scroll,
  system: Activity,
} as const;

export function MomentumFeed({ limit = 8 }: { limit?: number }) {
  const events = useMomentum((s) => s.events).slice(0, limit);

  if (events.length === 0) {
    return <p className="text-sm text-muted-foreground">No momentum logged yet. Make a move.</p>;
  }

  return (
    <ul className="space-y-2">
      {events.map((e) => {
        const Icon = ICON[e.kind];
        return (
          <li
            key={e.id}
            className="flex items-start gap-3 rounded-lg border border-primary/15 bg-primary/5 px-3 py-2"
          >
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-foreground">{e.text}</p>
              <p className="text-2xs uppercase tracking-wider text-muted-foreground">
                {formatDistanceToNow(new Date(e.at), { addSuffix: true })}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
