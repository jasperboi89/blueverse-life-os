import heroImage from "@/assets/bridge-hero.png.asset.json";

export function BridgeBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <img
        src={heroImage.url}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
        draggable={false}
      />
      {/* Cyan/violet tint + readability gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, oklch(0.18 0.10 250 / 0.35), transparent 60%)," +
            "linear-gradient(180deg, oklch(0.10 0.06 270 / 0.45) 0%, oklch(0.08 0.06 270 / 0.15) 30%, oklch(0.08 0.06 270 / 0.55) 80%, oklch(0.06 0.05 270 / 0.85) 100%)",
        }}
      />
    </div>
  );
}
