/**
 * Ambient cockpit atmosphere. No decorative arc lines or fake window frames —
 * the curvature comes from the 3D-transformed UI panels themselves.
 * This layer just adds a soft floor glow and outer vignette for cinematic depth.
 */
export function CockpitFrame() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Cockpit floor glow */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[26vh]"
        style={{
          background:
            "radial-gradient(120% 100% at 50% 100%, oklch(0.30 0.16 230 / 0.28) 0%, transparent 60%), linear-gradient(180deg, transparent, oklch(0.06 0.05 270 / 0.85))",
        }}
      />
      {/* Outer corner vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 55%, transparent 60%, oklch(0.05 0.05 270 / 0.7) 100%)",
        }}
      />
    </div>
  );
}
