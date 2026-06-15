import { motion } from "framer-motion";

/**
 * Personal holographic starship — slim fuselage, swept delta wings,
 * twin engine nacelles with cyan plume. Floats gently with a slow yaw.
 */
export function HoloVessel({ className }: { className?: string }) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
    >
      <motion.div
        animate={{ rotateY: [-6, 6, -6], rotateZ: [-1, 1, -1] }}
        transition={{ duration: 12, ease: "easeInOut", repeat: Infinity }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <svg viewBox="-160 -180 320 360" className="h-full w-full">
          <defs>
            <linearGradient id="hv-hull" x1="0" y1="-1" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.97 0.03 220)" />
              <stop offset="55%" stopColor="oklch(0.72 0.14 240)" />
              <stop offset="100%" stopColor="oklch(0.42 0.18 270)" />
            </linearGradient>
            <linearGradient id="hv-wing" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="oklch(0.85 0.14 220 / 0.85)" />
              <stop offset="100%" stopColor="oklch(0.50 0.22 290 / 0.55)" />
            </linearGradient>
            <radialGradient id="hv-canopy" cx="50%" cy="35%" r="60%">
              <stop offset="0%" stopColor="oklch(0.98 0.05 200)" />
              <stop offset="60%" stopColor="oklch(0.78 0.18 220)" />
              <stop offset="100%" stopColor="oklch(0.30 0.15 280)" />
            </radialGradient>
            <radialGradient id="hv-plume" cx="50%" cy="20%" r="80%">
              <stop offset="0%" stopColor="oklch(0.98 0.10 210 / 0.95)" />
              <stop offset="40%" stopColor="oklch(0.78 0.20 220 / 0.7)" />
              <stop offset="100%" stopColor="oklch(0.40 0.20 280 / 0)" />
            </radialGradient>
            <filter id="hv-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
          </defs>

          {/* engine plumes */}
          <g style={{ filter: "url(#hv-glow)" }}>
            <ellipse cx="-44" cy="120" rx="14" ry="48" fill="url(#hv-plume)" />
            <ellipse cx="44" cy="120" rx="14" ry="48" fill="url(#hv-plume)" />
          </g>
          <ellipse cx="-44" cy="96" rx="6" ry="20" fill="oklch(0.98 0.08 210 / 0.9)" />
          <ellipse cx="44" cy="96" rx="6" ry="20" fill="oklch(0.98 0.08 210 / 0.9)" />

          {/* swept wings */}
          <path
            d="M -14 -10 L -132 78 L -120 96 L -22 50 Z"
            fill="url(#hv-wing)"
            stroke="oklch(0.92 0.10 210 / 0.85)"
            strokeWidth="0.8"
          />
          <path
            d="M 14 -10 L 132 78 L 120 96 L 22 50 Z"
            fill="url(#hv-wing)"
            stroke="oklch(0.92 0.10 210 / 0.85)"
            strokeWidth="0.8"
          />

          {/* engine nacelles */}
          <rect x="-54" y="60" width="20" height="44" rx="8" fill="url(#hv-hull)" stroke="oklch(0.90 0.10 210 / 0.7)" />
          <rect x="34"  y="60" width="20" height="44" rx="8" fill="url(#hv-hull)" stroke="oklch(0.90 0.10 210 / 0.7)" />

          {/* main fuselage — long, tapered */}
          <path
            d="M 0 -160
               C 14 -120, 22 -40, 20 40
               C 18 80, 10 110, 0 122
               C -10 110, -18 80, -20 40
               C -22 -40, -14 -120, 0 -160 Z"
            fill="url(#hv-hull)"
            stroke="oklch(0.96 0.08 210)"
            strokeWidth="1.1"
            style={{ filter: "drop-shadow(0 0 18px oklch(0.78 0.20 220 / 0.7))" }}
          />

          {/* spine highlight */}
          <path d="M 0 -156 L 0 116" stroke="oklch(1 0 0 / 0.45)" strokeWidth="0.6" />

          {/* cockpit canopy */}
          <ellipse cx="0" cy="-70" rx="9" ry="28" fill="url(#hv-canopy)" opacity="0.95" />
          <ellipse cx="-2" cy="-78" rx="2.5" ry="8" fill="oklch(1 0 0 / 0.6)" />

          {/* wing-tip nav lights */}
          <circle cx="-132" cy="78" r="2.6" fill="oklch(0.98 0.06 200)">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="2.4s" repeatCount="indefinite" />
          </circle>
          <circle cx="132" cy="78" r="2.6" fill="oklch(0.78 0.22 295)">
            <animate attributeName="opacity" values="1;0.4;1" dur="2.4s" repeatCount="indefinite" />
          </circle>

          {/* subtle reflection on hull */}
          <path
            d="M -10 -120 C -6 -60, -6 20, -12 90"
            stroke="oklch(1 0 0 / 0.35)"
            strokeWidth="1.2"
            fill="none"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}
