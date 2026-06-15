import { motion } from "framer-motion";
import { HoloVessel } from "./HoloVessel";
import { MetricCard } from "./MetricCard";

type Props = {
  directive: string;
  mission: number;
  finance: { label: string; caption?: string };
  focus: number;
  missionCaption?: string;
  focusCaption?: string;
};

export function CinematicHero({
  directive, mission, finance, focus, missionCaption, focusCaption,
}: Props) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/5">
      {/* deep cosmic base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 20% 10%, oklch(0.32 0.18 230 / 0.55), transparent 60%)," +
            "radial-gradient(110% 80% at 85% 90%, oklch(0.30 0.22 295 / 0.55), transparent 60%)," +
            "radial-gradient(80% 60% at 50% 50%, oklch(0.22 0.10 260 / 0.65), transparent 70%)," +
            "linear-gradient(180deg, oklch(0.10 0.06 270), oklch(0.13 0.07 275))",
        }}
      />
      {/* parallax stars */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% 22%, oklch(0.95 0.05 210 / 0.9) 0.6px, transparent 1.2px)," +
            "radial-gradient(circle at 78% 18%, oklch(0.90 0.10 220 / 0.7) 0.6px, transparent 1.2px)," +
            "radial-gradient(circle at 38% 70%, oklch(0.80 0.18 290 / 0.7) 0.6px, transparent 1.2px)," +
            "radial-gradient(circle at 88% 78%, oklch(0.96 0.04 210 / 0.8) 0.6px, transparent 1.2px)," +
            "radial-gradient(circle at 50% 40%, oklch(0.85 0.10 220 / 0.6) 0.4px, transparent 1px)",
          backgroundSize: "240px 240px, 320px 320px, 280px 280px, 360px 360px, 180px 180px",
          animation: "nebula-drift 30s ease-in-out infinite",
        }}
      />
      {/* outer glass ring */}
      <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/10" />

      <div className="relative grid gap-8 px-8 pt-10 pb-8 sm:px-12 sm:pt-14">
        {/* Vessel */}
        <div className="relative mx-auto flex h-[360px] w-full max-w-[640px] items-center justify-center sm:h-[440px]">
          {/* ambient bloom behind ship */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(closest-side, oklch(0.65 0.22 250 / 0.55), transparent 70%)",
              filter: "blur(20px)",
            }}
          />
          {/* horizon ellipse */}
          <div
            className="pointer-events-none absolute bottom-6 left-1/2 h-10 w-[70%] -translate-x-1/2 rounded-[50%]"
            style={{
              background:
                "radial-gradient(closest-side, oklch(0.78 0.18 215 / 0.45), transparent 70%)",
              filter: "blur(12px)",
            }}
          />
          <HoloVessel className="relative h-full w-auto" />
        </div>

        {/* Directive plate */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto w-full max-w-3xl rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-4 text-center backdrop-blur-xl"
        >
          <p className="text-[12px] tracking-[0.3em] text-primary/80">DIRECTIVE</p>
          <p className="mt-1.5 font-display text-2xl text-foreground sm:text-[28px]">
            {directive}
          </p>
        </motion.div>

        {/* Metric trio */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <MetricCard
            label="Mission Progress"
            value={`${mission}%`}
            progress={mission}
            caption={missionCaption ?? "Average across active missions"}
            hue="cyan"
          />
          <MetricCard
            label="Financial Health"
            value={finance.label}
            caption={finance.caption ?? "Weather across your accounts"}
            hue="violet"
          />
          <MetricCard
            label="Focus"
            value={`${focus}%`}
            progress={focus}
            caption={focusCaption ?? "Cognitive bandwidth today"}
            hue="azure"
          />
        </div>
      </div>
    </section>
  );
}
