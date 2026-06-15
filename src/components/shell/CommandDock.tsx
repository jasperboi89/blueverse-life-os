import { Link, useRouterState } from "@tanstack/react-router";
import {
  Compass, Target, Wallet, Clock, BookOpen, Radio, Telescope, Archive, Scroll, Settings as SettingsIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/",               label: "Bridge",         icon: Compass },
  { to: "/missions",       label: "Missions",       icon: Target },
  { to: "/finance",        label: "Finance",        icon: Wallet },
  { to: "/timeline",       label: "Timeline",       icon: Clock },
  { to: "/knowledge",      label: "Knowledge",      icon: BookOpen },
  { to: "/communications", label: "Comms",          icon: Radio },
  { to: "/observatory",    label: "Observatory",    icon: Telescope },
  { to: "/archive",        label: "Archive",        icon: Archive },
  { to: "/constitution",   label: "Constitution",   icon: Scroll },
  { to: "/settings",       label: "Settings",       icon: SettingsIcon },
] as const;

export function CommandDock() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-3 left-1/2 z-40 -translate-x-1/2 px-2"
    >
      <ul className="glass-panel holo-border command-glow flex max-w-[96vw] items-center gap-1 overflow-x-auto px-2 py-2 sm:gap-2 sm:px-3">
        {items.map(({ to, label, icon: Icon }) => {
          const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <li key={to} className="shrink-0">
              <Link
                to={to}
                className={cn(
                  "group relative flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] transition-all",
                  active
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-primary/10",
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 transition-transform group-hover:scale-110",
                    active && "drop-shadow-[0_0_8px_oklch(0.78_0.18_215/0.8)]",
                  )}
                />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
