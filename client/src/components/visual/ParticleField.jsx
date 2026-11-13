import { useEffect, useRef } from "react";

// Cinematic depth field: soft light motes at three depths drifting slowly upward,
// with gentle pointer + scroll parallax — like dust caught in a projector beam.
const TINTS = ["255,111,97", "111,163,239", "255,193,7", "255,255,255"];
const DRIFT = 0.12; // upward speed (px/frame at depth 1)
const PARALLAX = 28; // max pointer offset for nearest layer

export function ParticleField() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, raf = 0, parts = [];
    const ptr = { x: 0, y: 0, sx: 0, sy: 0 };

    const make = (randomY = true) => {
      const z = Math.random() ** 1.6; // 0 far … 1 near
      return {
        x: Math.random() * w,
        y: randomY ? Math.random() * h : h + 40,
        z,
        r: 0.6 + z * (Math.random() < 0.06 ? 14 : 3.2),
        tint: TINTS[Math.random() < 0.55 ? 3 : Math.floor(Math.random() * 3)],
        ph: Math.random() * Math.PI * 2,
        tw: 0.4 + Math.random() * 0.8,
      };
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round((w * h) / (w < 768 ? 14000 : 9000));
      parts = Array.from({ length: count }, () => make(true));
    };

    const draw = (t) => {
      const time = t * 0.001;
      ptr.sx += (ptr.x - ptr.sx) * 0.04;
      ptr.sy += (ptr.y - ptr.sy) * 0.04;
      const scroll = window.scrollY;
      const light = !document.documentElement.classList.contains("dark");
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = light ? "source-over" : "lighter";
      for (const p of parts) {
        p.y -= DRIFT * (0.3 + p.z);
        p.x += Math.sin(time * 0.3 + p.ph) * 0.08 * (0.3 + p.z);
        if (p.y < -60) Object.assign(p, make(false));
        const ox = ptr.sx * PARALLAX * p.z;
        const oy = ptr.sy * PARALLAX * p.z - ((scroll * 0.15 * p.z) % (h + 80));
        let y = p.y + oy;
        if (y < -60) y += h + 120;
        const x = p.x + ox;
        const flicker = 0.55 + 0.45 * Math.sin(time * p.tw + p.ph);
        const alpha = (0.15 + p.z * 0.55) * flicker * (light ? 0.7 : 1);
        const rgb = light && p.tint === "255,255,255" ? "46,46,46" : p.tint;
        const g = ctx.createRadialGradient(x, y, 0, x, y, p.r * 3);
        g.addColorStop(0, `rgba(${rgb},${alpha})`);
        g.addColorStop(0.35, `rgba(${rgb},${alpha * 0.35})`);
        g.addColorStop(1, `rgba(${rgb},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, p.r * 3, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduced) raf = requestAnimationFrame(draw);
    };

    const onMove = (e) => {
      ptr.x = (e.clientX / w) * 2 - 1;
      ptr.y = (e.clientY / h) * 2 - 1;
    };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-[5] h-full w-full" />;
}
