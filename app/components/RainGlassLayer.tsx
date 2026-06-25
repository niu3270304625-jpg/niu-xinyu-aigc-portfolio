"use client";

import { useEffect, useRef } from "react";

type Bead = {
  x: number;
  y: number;
  r: number;
  sx: number;
  sy: number;
  speed: number;
  phase: number;
  alpha: number;
  kind: "mist" | "bead" | "run";
  trail: number;
  skew: number;
};

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function makeBead(width: number, height: number, kind: Bead["kind"]): Bead {
  const isMist = kind === "mist";
  const isRun = kind === "run";
  const r = isMist ? rand(0.42, 1.1) : isRun ? rand(1.8, 4.8) : rand(1, 3.8);

  return {
    x: Math.random() * width,
    y: Math.random() * height,
    r,
    sx: isMist ? rand(0.75, 1.35) : rand(0.72, 1.18),
    sy: isMist ? rand(0.75, 1.25) : isRun ? rand(1.35, 2.35) : rand(0.9, 1.55),
    speed: isMist ? rand(0.006, 0.035) : isRun ? rand(0.26, 0.82) : rand(0.035, 0.16),
    phase: Math.random() * Math.PI * 2,
    alpha: isMist ? rand(0.14, 0.32) : isRun ? rand(0.2, 0.42) : rand(0.22, 0.42),
    kind,
    trail: isRun ? rand(48, 150) : rand(4, 18),
    skew: rand(-0.32, 0.32),
  };
}

function resetBead(bead: Bead, width: number, height: number) {
  const next = makeBead(width, height, bead.kind);
  Object.assign(bead, next);
  bead.y = -next.trail - next.r * 3;
}

export function RainGlassLayer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let ratio = 1;
    let frame = 0;
    let beads: Bead[] = [];

    const resize = () => {
      ratio = Math.min(window.devicePixelRatio || 1, 1.45);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      const area = width * height;
      const mistCount = Math.round(area / 1850);
      const beadCount = Math.round(area / 7200);
      const runCount = Math.round(area / 68000);

      beads = [
        ...Array.from({ length: mistCount }, () => makeBead(width, height, "mist")),
        ...Array.from({ length: beadCount }, () => makeBead(width, height, "bead")),
        ...Array.from({ length: runCount }, () => makeBead(width, height, "run")),
      ];
    };

    const pathDrop = (bead: Bead) => {
      const r = bead.r;
      ctx.beginPath();
      ctx.moveTo(-r * 0.24 + bead.skew * r, -r * bead.sy);
      ctx.bezierCurveTo(r * 0.72, -r * 0.78, r * bead.sx, -r * 0.05, r * 0.72, r * 0.62);
      ctx.bezierCurveTo(r * 0.36, r * bead.sy, -r * 0.6, r * bead.sy * 0.78, -r * bead.sx, r * 0.15);
      ctx.bezierCurveTo(-r * 1.05, -r * 0.42, -r * 0.72, -r * 0.82, -r * 0.24 + bead.skew * r, -r * bead.sy);
      ctx.closePath();
    };

    const drawMist = (bead: Bead, t: number) => {
      const x = bead.x + Math.sin(t * 0.0003 + bead.phase) * 0.45;
      const y = bead.y;

      ctx.save();
      ctx.translate(x, y);
      ctx.scale(bead.sx, bead.sy);
      ctx.fillStyle = `rgba(255,255,255,${bead.alpha * 0.42})`;
      ctx.beginPath();
      ctx.arc(0, 0, bead.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = `rgba(72,92,76,${bead.alpha * 0.08})`;
      ctx.lineWidth = 0.35;
      ctx.stroke();
      ctx.restore();
    };

    const drawBead = (bead: Bead, t: number) => {
      const drift = Math.sin(t * 0.00045 + bead.phase) * 0.8;
      const x = bead.x + drift;
      const y = bead.y;
      const r = bead.r;

      if (bead.kind === "run") {
        const trail = ctx.createLinearGradient(x, y - r, x + bead.skew * 10, y + bead.trail);
        trail.addColorStop(0, `rgba(255,255,255,${bead.alpha * 0.22})`);
        trail.addColorStop(0.16, `rgba(255,255,255,${bead.alpha * 0.34})`);
        trail.addColorStop(0.58, `rgba(84,104,90,${bead.alpha * 0.06})`);
        trail.addColorStop(1, "rgba(255,255,255,0)");
        ctx.strokeStyle = trail;
        ctx.lineWidth = Math.max(0.45, r * 0.22);
        ctx.beginPath();
        ctx.moveTo(x, y + r * 0.72);
        ctx.bezierCurveTo(x + bead.skew * 12, y + bead.trail * 0.28, x - bead.skew * 8, y + bead.trail * 0.72, x + bead.skew * 4, y + bead.trail);
        ctx.stroke();
      }

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(bead.skew * 0.34);
      pathDrop(bead);
      ctx.clip();

      const body = ctx.createRadialGradient(-r * 0.36, -r * 0.42, r * 0.08, r * 0.18, r * 0.3, r * 1.42);
      body.addColorStop(0, `rgba(255,255,255,${bead.alpha * 1.15})`);
      body.addColorStop(0.22, `rgba(255,255,255,${bead.alpha * 0.42})`);
      body.addColorStop(0.48, `rgba(255,255,255,${bead.alpha * 0.08})`);
      body.addColorStop(0.74, `rgba(68,92,74,${bead.alpha * 0.1})`);
      body.addColorStop(1, `rgba(255,255,255,${bead.alpha * 0.5})`);
      ctx.fillStyle = body;
      ctx.fillRect(-r * 1.5, -r * 1.8, r * 3, r * 3.7);

      const caustic = ctx.createLinearGradient(-r, -r, r, r);
      caustic.addColorStop(0, `rgba(255,255,255,${bead.alpha * 0.38})`);
      caustic.addColorStop(0.42, "rgba(255,255,255,0)");
      caustic.addColorStop(0.72, `rgba(72,92,76,${bead.alpha * 0.08})`);
      caustic.addColorStop(1, `rgba(255,255,255,${bead.alpha * 0.22})`);
      ctx.fillStyle = caustic;
      ctx.fillRect(-r * 1.5, -r * 1.8, r * 3, r * 3.7);

      ctx.restore();

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(bead.skew * 0.34);
      pathDrop(bead);
      ctx.strokeStyle = `rgba(66,84,70,${bead.alpha * 0.18})`;
      ctx.lineWidth = Math.max(0.35, r * 0.08);
      ctx.stroke();

      ctx.strokeStyle = `rgba(255,255,255,${bead.alpha * 0.98})`;
      ctx.lineWidth = Math.max(0.38, r * 0.1);
      ctx.beginPath();
      ctx.arc(-r * 0.26, -r * 0.38, Math.max(0.55, r * 0.28), Math.PI * 0.95, Math.PI * 1.65);
      ctx.stroke();

      ctx.strokeStyle = `rgba(255,255,255,${bead.alpha * 0.34})`;
      ctx.lineWidth = Math.max(0.28, r * 0.055);
      ctx.beginPath();
      ctx.arc(r * 0.2, r * 0.28, Math.max(0.5, r * 0.45), Math.PI * 0.05, Math.PI * 0.62);
      ctx.stroke();
      ctx.restore();
    };

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      const film = ctx.createLinearGradient(0, 0, width, height);
      film.addColorStop(0, "rgba(255,255,255,0.018)");
      film.addColorStop(0.5, "rgba(210,226,205,0.008)");
      film.addColorStop(1, "rgba(255,255,255,0.014)");
      ctx.fillStyle = film;
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = "screen";
      for (const bead of beads) {
        if (bead.kind === "mist") {
          drawMist(bead, time);
        } else {
          drawBead(bead, time);
        }

        bead.y += bead.speed;
        bead.x += Math.sin(time * 0.00016 + bead.phase) * (bead.kind === "run" ? 0.012 : 0.004);

        if (bead.y - bead.r > height + bead.trail) {
          resetBead(bead, width, height);
        }
      }

      frame = window.requestAnimationFrame(render);
    };

    resize();
    frame = window.requestAnimationFrame(render);
    window.addEventListener("resize", resize);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="rain-glass-layer" aria-hidden="true">
      <canvas ref={canvasRef} className="rain-glass-canvas" />
    </div>
  );
}
