import { useEffect, useRef } from "react";

/**
 * Lightweight starfield + drifting nebula. Pure canvas, no WebGL.
 * Fixed-position background layer.
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

    const stars = Array.from({ length: 140 }, () => ({
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
        const alpha = 0.35 + Math.abs(Math.sin(s.a)) * 0.55;
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
      {/* drifting nebula blobs */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 15% 20%, oklch(0.45 0.25 280 / 0.35), transparent 55%), radial-gradient(ellipse at 85% 30%, oklch(0.50 0.22 210 / 0.30), transparent 60%), radial-gradient(ellipse at 50% 95%, oklch(0.40 0.24 310 / 0.35), transparent 60%)",
          animation: "nebula-drift 22s ease-in-out infinite",
        }}
      />
      <canvas ref={ref} className="absolute inset-0 h-full w-full opacity-90" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, oklch(0.10 0.05 270 / 0.55) 100%)",
        }}
      />
    </div>
  );
}
