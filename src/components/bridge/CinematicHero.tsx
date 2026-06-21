import { motion } from "framer-motion";
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
    <section className="relative w-full">
      {/* Centerpiece column floating over the lounge background */}
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-12 py-8 sm:py-10 lg:py-14">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="holo-pane w-full rounded-2xl border border-white/15 bg-[oklch(0.10_0.06_270/0.35)] px-8 py-5 text-center shadow-[0_16px_60px_-16px_oklch(0.10_0.06_270/0.55)] backdrop-blur-2xl"
        >
          <p className="text-[12px] tracking-[0.35em] text-primary/90">DIRECTIVE</p>
          <p className="mt-2 font-display text-2xl text-foreground sm:text-[30px]">
            {directive}
          </p>
        </motion.div>
      </div>


      {/* Metric trio floating over the floor of the lounge */}
      <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-3">
        <MetricCard
          label="Mission Progress"
          value={`${mission}%`}
          progress={mission}
          caption={missionCaption ?? "Average across active missions"}
          hue="cyan"
          className="bg-[oklch(0.10_0.06_270/0.55)] backdrop-blur-2xl"
        />
        <MetricCard
          label="Financial Health"
          value={finance.label}
          caption={finance.caption ?? "Weather across your accounts"}
          hue="violet"
          className="bg-[oklch(0.10_0.06_270/0.55)] backdrop-blur-2xl"
        />
        <MetricCard
          label="Focus"
          value={`${focus}%`}
          progress={focus}
          caption={focusCaption ?? "Cognitive bandwidth today"}
          hue="azure"
          className="bg-[oklch(0.10_0.06_270/0.55)] backdrop-blur-2xl"
        />
      </div>
    </section>
  );
}
