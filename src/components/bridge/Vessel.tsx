import { motion } from "framer-motion";

type Props = { progress: number; label?: string };

export function Vessel({ progress, label = "Mission Progress" }: Props) {
  return (
    <div className="relative mx-auto flex aspect-square w-full max-w-md items-center justify-center">
      {/* outer orbit rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border border-primary/20"
          style={{ inset: `${i * 6}%` }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 60 + i * 30, ease: "linear", repeat: Infinity }}
        />
      ))}
      {/* progress arc */}
      <svg viewBox="0 0 100 100" className="absolute inset-[4%]">
        <defs>
          <linearGradient id="arc" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.85 0.18 210)" />
            <stop offset="100%" stopColor="oklch(0.70 0.22 295)" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="46" fill="none" stroke="oklch(0.78 0.18 215 / 0.12)" strokeWidth="1.5" />
        <motion.circle
          cx="50" cy="50" r="46" fill="none"
          stroke="url(#arc)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeDasharray={2 * Math.PI * 46}
          initial={{ strokeDashoffset: 2 * Math.PI * 46 }}
          animate={{ strokeDashoffset: 2 * Math.PI * 46 * (1 - progress / 100) }}
          transition={{ duration: 1.6, ease: "easeOut" }}
          transform="rotate(-90 50 50)"
        />
      </svg>
      {/* core */}
      <motion.div
        className="relative h-1/2 w-1/2 rounded-full"
        style={{
          background: "var(--gradient-core)",
          boxShadow: "var(--shadow-holo)",
        }}
        animate={{ scale: [1, 1.04, 1], filter: ["brightness(1)", "brightness(1.18)", "brightness(1)"] }}
        transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
      >
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,oklch(1_0_0/0.35),transparent_45%)]" />
      </motion.div>
      {/* center HUD */}
      <div className="absolute flex flex-col items-center text-center">
        <p className="hud-text">{label}</p>
        <p className="font-display text-4xl text-gradient-cosmic sm:text-5xl">
          {Math.round(progress)}%
        </p>
      </div>
    </div>
  );
}
