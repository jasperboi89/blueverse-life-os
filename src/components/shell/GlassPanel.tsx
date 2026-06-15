import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  title?: string;
  eyebrow?: string;
  action?: ReactNode;
  variant?: "default" | "hero" | "flat";
  brackets?: boolean;
  scan?: boolean;
};

export function GlassPanel({
  title,
  eyebrow,
  action,
  className,
  children,
  variant = "default",
  brackets = true,
  scan = true,
  ...rest
}: Props) {
  return (
    <section
      className={cn(
        "glass-panel holo-border relative overflow-hidden p-4 sm:p-5",
        variant === "hero" && "holo-sweep command-glow",
        scan && "scanlines",
        className,
      )}
      {...rest}
    >
      {brackets && <CornerBrackets />}
      {(title || eyebrow || action) && (
        <header className="relative z-[1] mb-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="min-w-0">
            {eyebrow && (
              <p className="hud-text flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
                {eyebrow}
              </p>
            )}
            {title && (
              <h3 className="truncate font-display text-lg text-foreground sm:text-xl">{title}</h3>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </header>
      )}
      <div className="relative z-[1]">{children}</div>
    </section>
  );
}

function CornerBrackets() {
  const base =
    "pointer-events-none absolute h-3.5 w-3.5 border-primary/70";
  return (
    <>
      <span className={cn(base, "top-2 left-2 border-t border-l")} />
      <span className={cn(base, "top-2 right-2 border-t border-r")} />
      <span className={cn(base, "bottom-2 left-2 border-b border-l")} />
      <span className={cn(base, "bottom-2 right-2 border-b border-r")} />
    </>
  );
}
