import { useEffect, useRef } from "react";

/**
 * Cinematic cosmic backdrop: starfield canvas + drifting nebula blooms
 * + faint orbital rings + slow light sweep. All decorative, no interaction.
 */
export function NebulaBackground() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = (canvas.width = window.innerWidth * devicePixelRatio);
    let h = (canvas.height = window.innerHeight * devicePixelRatio);

    const stars = Array.from({ length: 180 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.4 + 0.2,
      a: Math.random(),
      s: Math.random() * 0.015 + 0.003,
    }));

    const handle = () => {
      w = canvas.width = window.innerWidth * devicePixelRatio;
      h = canvas.height = window.innerHeight * devicePixelRatio;
    };
    window.addEventListener("resize", handle);

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        s.a += s.s;
        const alpha = 0.3 + Math.abs(Math.sin(s.a)) * 0.6;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * devicePixelRatio, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 220, 255, ${alpha})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handle);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* deep space base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 15% 20%, oklch(0.45 0.25 280 / 0.38), transparent 55%), radial-gradient(ellipse at 85% 30%, oklch(0.50 0.22 210 / 0.32), transparent 60%), radial-gradient(ellipse at 50% 95%, oklch(0.40 0.24 310 / 0.35), transparent 60%)",
          animation: "nebula-drift 24s ease-in-out infinite",
        }}
      />
      {/* distant sector glows */}
      <div className="absolute top-[12%] left-[8%] h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute top-[60%] right-[10%] h-56 w-56 rounded-full bg-accent/20 blur-3xl" />
      <div className="absolute bottom-[8%] left-[40%] h-40 w-40 rounded-full bg-primary/15 blur-3xl" />

      {/* starfield */}
      <canvas ref={ref} className="absolute inset-0 h-full w-full opacity-90" />

      {/* faint orbital rings centered on hero */}
      <svg
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.08]"
        width="1400"
        height="1400"
        viewBox="0 0 1400 1400"
        fill="none"
      >
        <circle cx="700" cy="700" r="380" stroke="currentColor" strokeWidth="1" className="text-primary" />
        <circle cx="700" cy="700" r="520" stroke="currentColor" strokeWidth="1" strokeDasharray="2 8" className="text-primary" />
        <circle cx="700" cy="700" r="660" stroke="currentColor" strokeWidth="1" className="text-accent" />
      </svg>

      {/* diagonal light sweep */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-0 -left-1/3 h-full w-1/3"
          style={{
            background:
              "linear-gradient(90deg, transparent, oklch(0.85 0.18 215 / 0.10), transparent)",
            animation: "light-sweep 22s linear infinite",
          }}
        />
      </div>

      {/* vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 45%, oklch(0.08 0.05 270 / 0.65) 100%)",
        }}
      />
    </div>
  );
}
