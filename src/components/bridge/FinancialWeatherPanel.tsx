import { Link } from "@tanstack/react-router";
import { Cloud, Sun, CloudRain, CloudLightning, Wind, ArrowRight } from "lucide-react";
import { GlassPanel } from "@/components/shell/GlassPanel";
import { useFinance } from "@/stores/finance";
import { WEATHER_GRADIENT, type FinancialWeather } from "@/lib/enums";
import { cn } from "@/lib/utils";

const WEATHER_ICON: Record<FinancialWeather, typeof Sun> = {
  Clear: Sun,
  Stable: Cloud,
  Caution: Wind,
  Pressure: CloudRain,
  Storm: CloudLightning,
};

export function FinancialWeatherPanel() {
  const finance = useFinance();
  const upcoming = [...finance.bills].sort((a, b) => a.dueDay - b.dueDay).slice(0, 3);
  const total = upcoming.reduce((a, b) => a + b.amount, 0);
  const Icon = WEATHER_ICON[finance.weather];

  return (
    <GlassPanel
      eyebrow="Financial Weather"
      title={finance.weather}
      action={
        <Link
          to="/finance"
          className="text-xs font-display uppercase tracking-[0.2em] text-primary hover:underline inline-flex items-center gap-1"
        >
          Open <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      }
    >
      <div
        className={cn(
          "mb-3 flex items-center gap-3 rounded-xl bg-gradient-to-br p-3",
          WEATHER_GRADIENT[finance.weather],
        )}
      >
        <Icon className="h-8 w-8 text-foreground drop-shadow-[0_0_10px_currentColor]" />
        <div className="min-w-0">
          <p className="hud-text">Health</p>
          <p className="font-display text-lg text-foreground">{finance.health}</p>
        </div>
      </div>
      {upcoming.length === 0 ? (
        <p className="text-sm text-muted-foreground">No bills logged. Financial systems ready.</p>
      ) : (
        <>
          <ul className="space-y-1.5 text-sm">
            {upcoming.map((b) => (
              <li key={b.id} className="flex items-center justify-between gap-2">
                <span className="truncate text-foreground">{b.name}</span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  Day {b.dueDay} · ${b.amount.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 hud-text">Upcoming ≈ ${total.toLocaleString()}</p>
        </>
      )}
    </GlassPanel>
  );
}
