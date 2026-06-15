import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  title?: string;
  eyebrow?: string;
  action?: ReactNode;
};

export function GlassPanel({ title, eyebrow, action, className, children, ...rest }: Props) {
  return (
    <section
      className={cn("glass-panel holo-border relative overflow-hidden p-4 sm:p-5", className)}
      {...rest}
    >
      {(title || eyebrow || action) && (
        <header className="mb-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="min-w-0">
            {eyebrow && <p className="hud-text">{eyebrow}</p>}
            {title && (
              <h3 className="truncate font-display text-lg text-foreground sm:text-xl">{title}</h3>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </header>
      )}
      {children}
    </section>
  );
}
