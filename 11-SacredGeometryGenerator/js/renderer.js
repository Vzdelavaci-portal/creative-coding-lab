import { TAU, clamp, hslColor } from "./utils.js";
import { ParticleSystem } from "./particles.js";

const PALETTES = {
  rainbow: [0, 35, 72, 142, 205, 275].map((h) => hslColor(h)),
  ocean: ["#5ee7ff", "#4fb3ff", "#6bf7c8", "#b9fff6"],
  sunset: ["#ff7a59", "#ffcf6b", "#ff4fa3", "#ffe6a7"],
  neon: ["#00f5ff", "#a855f7", "#ff2bd6", "#8cff66"],
  gold: ["#fff1a6", "#ffcf56", "#d99b25", "#ffffff"],
  mono: ["#ffffff", "#cfd7e6", "#8d9bb3", "#f7f8ff"]
};

export const COLOR_MODES = Object.keys(PALETTES);
export const BACKGROUND_MODES = ["dark", "deepSpace", "light", "stars"];

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.dpr = 1;
    this.width = 0;
    this.height = 0;
    this.particles = new ParticleSystem();
    this.view = { cx: 0, cy: 0, scale: 1, rotation: 0 };
    this.stars = [];
    this.resize();
    window.addEventListener("resize", () => this.resize());
  }

  resize() {
    this.dpr = Math.min(1.25, window.devicePixelRatio || 1);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.view.cx = this.width / 2;
    this.view.cy = this.height / 2;
    this.stars = Array.from({ length: 90 }, (_, i) => ({
      x: (Math.sin(i * 91.17) * 0.5 + 0.5) * this.width,
      y: (Math.sin(i * 37.31 + 2) * 0.5 + 0.5) * this.height,
      r: 0.7 + (i % 3) * 0.45,
      phase: i
    }));
  }

  palette(mode, time) {
    if (mode === "rainbow") {
      return [0, 46, 92, 174, 226, 292].map((h) => hslColor(h + time * 28, 92, 64));
    }
    return PALETTES[mode] || PALETTES.rainbow;
  }

  render(shapes, state, anim) {
    const ctx = this.ctx;
    const colors = this.palette(state.colorMode, anim.time * state.speed);
    this.drawBackground(state.backgroundMode, anim.time, state.transparent);

    const breathing = state.breathing ? 1 + Math.sin(anim.time * 1.6 * state.speed) * 0.035 : 1;
    const pulse = state.pulse ? 0.75 + Math.sin(anim.time * 3.2 * state.speed) * 0.25 : 0;
    const rotation = (state.rotation * Math.PI / 180) + (state.autoRotate ? anim.time * 0.18 * state.speed : 0);
    this.view.scale = state.scale * breathing;
    this.view.rotation = rotation;

    if (state.particles) this.particles.draw(ctx, this.view, colors, anim.time, { pulse: state.pulse, speed: state.speed });

    ctx.save();
    ctx.translate(this.view.cx, this.view.cy);
    ctx.rotate(rotation);
    ctx.scale(this.view.scale, this.view.scale);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalCompositeOperation = "source-over";

    const maxOrder = Math.max(1, ...shapes.map((shape) => shape.order));
    const drawHead = anim.transitionEase * (maxOrder + 1.9);
    shapes.forEach((shape, i) => {
      const local = clamp(drawHead - shape.order, 0, 1);
      if (local <= 0) return;
      const color = colors[i % colors.length];
      if (state.glow > 0 && i % 2 === 0) {
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = state.lineWidth + Math.min(12, state.glow * 0.65 + pulse * 4);
        ctx.globalAlpha = 0.045 + local * 0.08;
        this.drawShape(ctx, shape, local);
      }
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = state.lineWidth;
      ctx.globalAlpha = 0.22 + local * 0.72;
      this.drawShape(ctx, shape, local);
    });

    this.drawCenterPulse(ctx, colors, anim.time, state);
    ctx.restore();
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }

  drawBackground(mode, time, transparent = false) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);
    if (transparent) return;
    if (mode === "light") {
      const grad = ctx.createLinearGradient(0, 0, this.width, this.height);
      grad.addColorStop(0, "#eef6ff");
      grad.addColorStop(1, "#f9f4ec");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, this.width, this.height);
      return;
    }

    const grad = ctx.createRadialGradient(this.width * 0.5, this.height * 0.45, 10, this.width * 0.5, this.height * 0.5, Math.max(this.width, this.height));
    grad.addColorStop(0, mode === "deepSpace" ? "#15224a" : "#10172e");
    grad.addColorStop(0.48, "#080d1c");
    grad.addColorStop(1, "#03050b");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.width, this.height);

    if (mode === "stars" || mode === "deepSpace") {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      this.stars.forEach((star) => {
        const a = 0.2 + Math.sin(time * 1.4 + star.phase) * 0.18;
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, TAU);
        ctx.fill();
      });
      ctx.restore();
    }
  }

  drawShape(ctx, shape, progress) {
    if (shape.kind === "circle") {
      ctx.beginPath();
      ctx.arc(shape.x, shape.y, shape.r, -Math.PI / 2, -Math.PI / 2 + TAU * progress);
      ctx.stroke();
      return;
    }
    if (shape.kind === "line") {
      ctx.beginPath();
      ctx.moveTo(shape.x1, shape.y1);
      ctx.lineTo(shape.x1 + (shape.x2 - shape.x1) * progress, shape.y1 + (shape.y2 - shape.y1) * progress);
      ctx.stroke();
      return;
    }
    if (shape.kind === "polyline") {
      this.drawProgressivePolyline(ctx, shape.points, progress, shape.closed);
      return;
    }
    if (shape.kind === "bezier") {
      const [a, b, c] = shape.points;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.quadraticCurveTo(b.x, b.y, a.x + (c.x - a.x) * progress, a.y + (c.y - a.y) * progress);
      ctx.stroke();
    }
  }

  drawProgressivePolyline(ctx, points, progress, closed) {
    const segments = closed ? points.length : points.length - 1;
    const visible = progress * segments;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 0; i < segments; i++) {
      const a = points[i];
      const b = points[(i + 1) % points.length];
      const local = clamp(visible - i, 0, 1);
      if (local <= 0) break;
      ctx.lineTo(a.x + (b.x - a.x) * local, a.y + (b.y - a.y) * local);
    }
    ctx.stroke();
  }

  drawCenterPulse(ctx, colors, time, state) {
    if (!state.pulse) return;
    const r = 12 + Math.sin(time * 4 * state.speed) * 5;
    ctx.fillStyle = colors[0];
    ctx.globalAlpha = 0.12;
    ctx.beginPath();
    ctx.arc(0, 0, r * 2.2, 0, TAU);
    ctx.fill();
  }
}
