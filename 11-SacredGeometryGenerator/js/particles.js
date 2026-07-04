import { TAU, lerp } from "./utils.js";

export class ParticleSystem {
  constructor(count = 96) {
    this.particles = [];
    this.mouse = { x: 0, y: 0, active: false };
    this.resize(count);
  }

  resize(count) {
    this.particles = Array.from({ length: count }, (_, i) => ({
      angle: (i / count) * TAU,
      radius: 150 + Math.random() * 260,
      speed: 0.12 + Math.random() * 0.42,
      size: 0.8 + Math.random() * 2.8,
      phase: Math.random() * TAU,
      alpha: 0.35 + Math.random() * 0.55
    }));
  }

  setMouse(x, y, active) {
    this.mouse = { x, y, active };
  }

  draw(ctx, view, colors, time, options) {
    ctx.save();
    ctx.translate(view.cx, view.cy);
    ctx.rotate(view.rotation);
    ctx.scale(view.scale, view.scale);
    ctx.globalCompositeOperation = "lighter";

    for (const p of this.particles) {
      const pulse = options.pulse ? 1 + Math.sin(time * 3.4 + p.phase) * 0.08 : 1;
      p.angle += p.speed * 0.012 * (options.speed + 0.3);
      const r = p.radius * pulse;
      let x = Math.cos(p.angle) * r;
      let y = Math.sin(p.angle) * r;

      if (this.mouse.active) {
        const mx = (this.mouse.x - view.cx) / view.scale;
        const my = (this.mouse.y - view.cy) / view.scale;
        const d = Math.hypot(x - mx, y - my);
        if (d < 150) {
          x = lerp(x, mx, 0.02);
          y = lerp(y, my, 0.02);
        }
      }

      const color = colors[(p.phase * 10 | 0) % colors.length];
      ctx.fillStyle = color;
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(x, y, p.size * 1.25, 0, TAU);
      ctx.fill();
    }

    ctx.restore();
    ctx.globalAlpha = 1;
  }
}
