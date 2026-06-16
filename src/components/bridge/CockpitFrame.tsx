/**
 * Curved panoramic cockpit overlay.
 * Sits above the bridge background image but below all UI panels.
 * Creates a wraparound observation-deck feel: arched top frame,
 * inward-curving side walls, and a soft floor glow.
 */
export function CockpitFrame() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ perspective: "1600px" }}
    >
      {/* Top arched window frame */}
      <div
        className="absolute -top-[18vh] left-1/2 h-[55vh] w-[170vw] -translate-x-1/2"
        style={{
          borderBottomLeftRadius: "50% 100%",
          borderBottomRightRadius: "50% 100%",
          background:
            "radial-gradient(ellipse at 50% 100%, transparent 55%, oklch(0.10 0.06 270 / 0.55) 70%, oklch(0.06 0.05 270 / 0.95) 100%)",
          boxShadow:
            "inset 0 -2px 0 oklch(0.82 0.18 215 / 0.35), inset 0 -28px 60px -30px oklch(0.78 0.18 215 / 0.45)",
        }}
      />
      {/* Subtle arc highlight along the top window seam */}
      <div
        className="absolute left-1/2 top-[34vh] h-[2px] w-[120vw] -translate-x-1/2 rounded-full opacity-70"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, oklch(0.88 0.18 215 / 0.7), transparent 70%)",
          filter: "blur(1px)",
        }}
      />

      {/* Left curved cockpit wall */}
      <div
        className="absolute -left-[6vw] top-[8vh] bottom-[10vh] w-[26vw]"
        style={{
          background:
            "linear-gradient(90deg, oklch(0.08 0.05 270 / 0.92) 0%, oklch(0.10 0.06 270 / 0.55) 45%, transparent 100%)",
          borderTopRightRadius: "60% 50%",
          borderBottomRightRadius: "55% 45%",
          boxShadow:
            "inset -1px 0 0 oklch(0.78 0.18 215 / 0.25), inset -30px 0 60px -30px oklch(0.68 0.22 295 / 0.35)",
          transform: "perspective(1400px) rotateY(18deg)",
          transformOrigin: "left center",
        }}
      />

      {/* Right curved cockpit wall */}
      <div
        className="absolute -right-[6vw] top-[8vh] bottom-[10vh] w-[26vw]"
        style={{
          background:
            "linear-gradient(270deg, oklch(0.08 0.05 270 / 0.92) 0%, oklch(0.10 0.06 270 / 0.55) 45%, transparent 100%)",
          borderTopLeftRadius: "60% 50%",
          borderBottomLeftRadius: "55% 45%",
          boxShadow:
            "inset 1px 0 0 oklch(0.78 0.18 215 / 0.25), inset 30px 0 60px -30px oklch(0.68 0.22 295 / 0.35)",
          transform: "perspective(1400px) rotateY(-18deg)",
          transformOrigin: "right center",
        }}
      />

      {/* Vertical seam glows along the window frame */}
      <div
        className="absolute left-[18vw] top-[10vh] bottom-[12vh] w-[1px] opacity-60"
        style={{
          background:
            "linear-gradient(180deg, transparent, oklch(0.85 0.18 215 / 0.55), transparent)",
        }}
      />
      <div
        className="absolute right-[18vw] top-[10vh] bottom-[12vh] w-[1px] opacity-60"
        style={{
          background:
            "linear-gradient(180deg, transparent, oklch(0.85 0.18 215 / 0.55), transparent)",
        }}
      />

      {/* Cockpit floor glow */}
      <div
        className="absolute bottom-0 left-1/2 h-[28vh] w-[150vw] -translate-x-1/2"
        style={{
          borderTopLeftRadius: "50% 100%",
          borderTopRightRadius: "50% 100%",
          background:
            "radial-gradient(ellipse at 50% 0%, oklch(0.30 0.16 230 / 0.35) 0%, transparent 55%), linear-gradient(180deg, transparent, oklch(0.06 0.05 270 / 0.92))",
          boxShadow:
            "inset 0 2px 0 oklch(0.78 0.18 215 / 0.30)",
        }}
      />

      {/* Outer corner vignette for cinematic enclosure */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 55%, transparent 55%, oklch(0.05 0.05 270 / 0.75) 100%)",
        }}
      />
    </div>
  );
}
