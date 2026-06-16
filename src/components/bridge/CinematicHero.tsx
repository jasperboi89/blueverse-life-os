import { motion } from "framer-motion";
import { MetricCard } from "./MetricCard";
import heroImage from "@/assets/bridge-hero.png.asset.json";

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
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_30px_120px_-30px_oklch(0.45_0.22_260/0.55)]">
      {/* Hero image */}
      <div className="relative aspect-[16/9] w-full">
        <img
          src={heroImage.url}
          alt="BlueVerse command lounge — holographic personal vessel above a glass projection table, panoramic view of stars and a distant planet"
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
        {/* Soft top/bottom vignette to seat overlays without darkening the scene */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.10 0.06 270 / 0.35) 0%, transparent 22%, transparent 55%, oklch(0.10 0.06 270 / 0.65) 100%)",
          }}
        />
        {/* Inner ring */}
        <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/10" />

        {/* Overlay UI — directive + metrics anchored to lower portion */}
        <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-6 sm:px-10 sm:pb-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mx-auto mb-5 w-full max-w-3xl rounded-2xl border border-white/15 bg-white/[0.06] px-6 py-4 text-center shadow-[0_10px_40px_-10px_oklch(0.20_0.10_260/0.6)] backdrop-blur-2xl"
          >
            <p className="text-[12px] tracking-[0.3em] text-primary/90">DIRECTIVE</p>
            <p className="mt-1.5 font-display text-2xl text-foreground sm:text-[28px]">
              {directive}
            </p>
          </motion.div>

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
      </div>
    </section>
  );
}
