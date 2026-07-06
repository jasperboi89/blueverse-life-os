import { Link, useRouterState } from "@tanstack/react-router";
import {
  Compass,
  Target,
  Wallet,
  Clock,
  BookOpen,
  Radio,
  Telescope,
  Archive,
  Scroll,
  Settings as SettingsIcon,
  Plus,
  Activity,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Bridge", icon: Compass },
  { to: "/missions", label: "Missions", icon: Target },
  { to: "/finance", label: "Finance", icon: Wallet },
  { to: "/timeline", label: "Timeline", icon: Clock },
  { to: "/knowledge", label: "Knowledge", icon: BookOpen },
  { to: "/communications", label: "Comms", icon: Radio },
  { to: "/observatory", label: "Observatory", icon: Telescope },
  { to: "/archive", label: "Archive", icon: Archive },
  { to: "/constitution", label: "Codex", icon: Scroll },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
] as const;

type Shortcut = { label: string; to: string; icon: typeof Plus };
const SHORTCUTS_BY_ROUTE: Record<string, Shortcut[]> = {
  "/": [
    { label: "New Mission", to: "/missions", icon: Plus },
    { label: "Log Momentum", to: "/timeline", icon: Activity },
    { label: "Open Vault", to: "/archive", icon: Sparkles },
  ],
};

export function CommandDock() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const shortcuts = SHORTCUTS_BY_ROUTE[pathname] ?? [];

  return (
    <nav aria-label="Primary" className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 px-2">
      {shortcuts.length > 0 && (
        <ul className="mb-2 flex justify-center gap-2">
          {shortcuts.map(({ label, to, icon: Icon }) => (
            <li key={label}>
              <Link
                to={to}
                className="glass-panel holo-border inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-2xs uppercase tracking-[0.2em] text-foreground/90 transition-all hover:text-primary"
              >
                <Icon className="h-3.5 w-3.5 text-primary" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      )}
      <div className="glass-panel holo-border holo-sweep relative px-3 py-3 sm:px-4">
        <ul className="flex max-w-[96vw] items-center gap-1.5 overflow-x-auto sm:gap-2">
          {items.map(({ to, label, icon: Icon }) => {
            const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
            return (
              <li key={to} className="shrink-0">
                <Link
                  to={to}
                  aria-label={label}
                  className={cn(
                    "group relative flex flex-col items-center gap-1.5 rounded-2xl px-4 py-2.5 text-2xs uppercase tracking-[0.2em] transition-all sm:px-5",
                    active
                      ? "bg-primary/20 text-primary shadow-[inset_0_0_20px_oklch(0.78_0.18_215/0.25)]"
                      : "text-muted-foreground hover:text-foreground hover:bg-primary/10",
                  )}
                >
                  {active && (
                    <span className="absolute top-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_12px_var(--primary)]" />
                  )}
                  <Icon
                    className={cn(
                      "h-[22px] w-[22px] transition-transform group-hover:scale-110",
                      active && "drop-shadow-[0_0_10px_oklch(0.78_0.18_215/0.95)]",
                    )}
                  />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
