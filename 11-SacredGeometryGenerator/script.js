(function () {
  "use strict";

  const TAU = Math.PI * 2;
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const ease = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const polar = (radius, angle, cx = 0, cy = 0) => ({ x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius });
  const hsl = (h, s = 92, l = 64, a = 1) => `hsla(${((h % 360) + 360) % 360}, ${s}%, ${l}%, ${a})`;

  const labels = {
    flower: "Flower of Life",
    seed: "Seed of Life",
    metatron: "Metatron's Cube",
    sri: "Sri Yantra",
    vesica: "Vesica Piscis",
    hex: "Hexagonal Grid"
  };

  const palettes = {
    rainbow: [0, 35, 72, 142, 205, 275].map((h) => hsl(h)),
    ocean: ["#5ee7ff", "#4fb3ff", "#6bf7c8", "#b9fff6"],
    sunset: ["#ff7a59", "#ffcf6b", "#ff4fa3", "#ffe6a7"],
    neon: ["#00f5ff", "#a855f7", "#ff2bd6", "#8cff66"],
    gold: ["#fff1a6", "#ffcf56", "#d99b25", "#ffffff"],
    mono: ["#ffffff", "#cfd7e6", "#8d9bb3", "#f7f8ff"]
  };

  const defaultState = {
    pattern: "flower",
    colorMode: "rainbow",
    backgroundMode: "stars",
    scale: 1,
    rotation: 0,
    lineWidth: 1.8,
    glow: 8,
    complexity: 4,
    speed: 1,
    particles: false,
    pulse: true,
    breathing: true,
    autoRotate: true,
    transparent: false
  };

  class Patterns {
    create(type, complexity = 5) {
      const c = Math.max(1, Math.round(complexity));
      const r = 92;
      const builders = {
        flower: () => this.flower(r, c),
        seed: () => this.seed(r, c),
        metatron: () => this.metatron(r, c),
        sri: () => this.sri(r, c),
        vesica: () => this.vesica(r, c),
        hex: () => this.hex(r, c)
      };
      return (builders[type] || builders.flower)();
    }

    circle(x, y, r, order, group = "geometry") {
      return { kind: "circle", x, y, r, order, group };
    }

    line(a, b, order, group = "geometry") {
      return { kind: "line", x1: a.x, y1: a.y, x2: b.x, y2: b.y, order, group };
    }

    polygon(points, order, group = "geometry") {
      return { kind: "polyline", points, closed: true, order, group };
    }

    flower(r, complexity) {
      const rings = Math.min(4, Math.max(2, Math.ceil(complexity / 2) + 1));
      const shapes = [this.circle(0, 0, r, 0)];
      let order = 1;
      for (let q = -rings; q <= rings; q++) {
        for (let s = -rings; s <= rings; s++) {
          const t = -q - s;
          const dist = Math.max(Math.abs(q), Math.abs(s), Math.abs(t));
          if (dist === 0 || dist > rings) continue;
          shapes.push(this.circle(r * (q + s / 2), r * (Math.sqrt(3) / 2) * s, r, order++));
        }
      }
      return shapes;
    }

    seed(r, complexity) {
      const shapes = [this.circle(0, 0, r, 0)];
      for (let i = 0; i < 6; i++) {
        const p = polar(r, i * TAU / 6);
        shapes.push(this.circle(p.x, p.y, r, i + 1));
      }
      if (complexity > 4) shapes.push(this.circle(0, 0, r * 2, 8, "outer"));
      return shapes;
    }

    metatron(r, complexity) {
      const shapes = this.seed(r, complexity);
      const points = [{ x: 0, y: 0 }];
      for (let i = 0; i < 6; i++) points.push(polar(r, i * TAU / 6));
      for (let i = 0; i < 6; i++) points.push(polar(r * 2, i * TAU / 6 + TAU / 12));
      let order = shapes.length + 1;
      points.forEach((p) => shapes.push(this.circle(p.x, p.y, 7, order++, "node")));
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const d = Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y);
          if (d < r * (complexity > 5 ? 3.05 : 2.05)) shapes.push(this.line(points[i], points[j], order++, "connective"));
        }
      }
      return shapes;
    }

    sri(r, complexity) {
      const shapes = [];
      let order = 0;
      [2.35, 2, 1.66, 1.32, 1.02, 0.76, 0.54, 0.34, 0.18].forEach((s, i) => {
        const rot = i % 2 === 0 ? -Math.PI / 2 : Math.PI / 2;
        const offset = (i - 4) * r * 0.045;
        const pts = [0, 1, 2].map((n) => polar(r * s, rot + n * TAU / 3, 0, offset));
        shapes.push(this.polygon(pts, order++, i % 2 === 0 ? "up-triangle" : "down-triangle"));
      });
      const petals = 8 + Math.min(8, complexity * 2);
      for (let i = 0; i < petals; i++) {
        const a = i * TAU / petals;
        shapes.push({ kind: "bezier", points: [polar(r * 0.9, a - 0.12), polar(r * 1.28, a), polar(r * 0.9, a + 0.12)], order: order++, group: "petal" });
      }
      shapes.push(this.circle(0, 0, r * 1.48, order++, "lotus"));
      shapes.push(this.circle(0, 0, r * 2.55, order++, "outer"));
      return shapes;
    }

    vesica(r, complexity) {
      const d = r;
      const shapes = [this.circle(-d / 2, 0, r, 0), this.circle(d / 2, 0, r, 1)];
      const h = Math.sqrt(r * r - (d / 2) * (d / 2));
      shapes.push(this.line({ x: 0, y: -h }, { x: 0, y: h }, 2, "axis"));
      for (let i = 1; i <= complexity; i++) shapes.push(this.circle(0, 0, r * i / complexity, 2 + i, "nested"));
      return shapes;
    }

    hex(r, complexity) {
      const shapes = [];
      const size = r * 0.58;
      const range = complexity + 1;
      let order = 0;
      for (let q = -range; q <= range; q++) {
        for (let s = -range; s <= range; s++) {
          const t = -q - s;
          if (Math.max(Math.abs(q), Math.abs(s), Math.abs(t)) > range) continue;
          const cx = size * Math.sqrt(3) * (q + s / 2);
          const cy = size * 1.5 * s;
          shapes.push(this.polygon(Array.from({ length: 6 }, (_, i) => polar(size, Math.PI / 6 + i * TAU / 6, cx, cy)), order++, "cell"));
        }
      }
      return shapes;
    }
  }

  class AnimationState {
    constructor() {
      this.time = 0;
      this.delta = 0;
      this.last = performance.now();
      this.transitionStart = 0;
      this.transition = 1;
    }

    tick(now) {
      this.delta = Math.min(0.05, (now - this.last) / 1000);
      this.time += this.delta;
      this.last = now;
      this.transition = clamp((now - this.transitionStart) / 900, 0, 1);
      this.transitionEase = ease(this.transition);
    }

    restart() {
      this.transitionStart = performance.now();
      this.transition = 0;
    }
  }

  class Particles {
    constructor(count = 96) {
      this.mouse = { x: 0, y: 0, active: false };
      this.particles = Array.from({ length: count }, (_, i) => ({
        angle: i / count * TAU,
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
      this.particles.forEach((p) => {
        const pulse = options.pulse ? 1 + Math.sin(time * 3.4 + p.phase) * 0.08 : 1;
        p.angle += p.speed * 0.012 * (options.speed + 0.3);
        let x = Math.cos(p.angle) * p.radius * pulse;
        let y = Math.sin(p.angle) * p.radius * pulse;
        if (this.mouse.active) {
          const mx = (this.mouse.x - view.cx) / view.scale;
          const my = (this.mouse.y - view.cy) / view.scale;
          const d = Math.hypot(x - mx, y - my);
          if (d < 150) {
            x += (mx - x) * 0.02;
            y += (my - y) * 0.02;
          }
        }
        const color = colors[(p.phase * 10 | 0) % colors.length];
        ctx.fillStyle = color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(x, y, p.size * 1.25, 0, TAU);
        ctx.fill();
      });
      ctx.restore();
      ctx.globalAlpha = 1;
    }
  }

  class Renderer {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.particles = new Particles();
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
      return mode === "rainbow" ? [0, 46, 92, 174, 226, 292].map((h) => hsl(h + time * 28, 92, 64)) : palettes[mode] || palettes.rainbow;
    }

    render(shapes, state, anim) {
      const ctx = this.ctx;
      const colors = this.palette(state.colorMode, anim.time * state.speed);
      this.background(state.backgroundMode, anim.time, state.transparent);
      const breathing = state.breathing ? 1 + Math.sin(anim.time * 1.6 * state.speed) * 0.035 : 1;
      const pulse = state.pulse ? 0.75 + Math.sin(anim.time * 3.2 * state.speed) * 0.25 : 0;
      const rotation = state.rotation * Math.PI / 180 + (state.autoRotate ? anim.time * 0.18 * state.speed : 0);
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
          this.shape(ctx, shape, local);
        }
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = state.lineWidth;
        ctx.globalAlpha = 0.22 + local * 0.72;
        this.shape(ctx, shape, local);
      });
      if (state.pulse) {
        const r = 12 + Math.sin(anim.time * 4 * state.speed) * 5;
        ctx.fillStyle = colors[0];
        ctx.globalAlpha = 0.12;
        ctx.beginPath();
        ctx.arc(0, 0, r * 2.2, 0, TAU);
        ctx.fill();
      }
      ctx.restore();
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    }

    background(mode, time, transparent) {
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
          ctx.fillStyle = `rgba(255,255,255,${0.2 + Math.sin(time * 1.4 + star.phase) * 0.18})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.r, 0, TAU);
          ctx.fill();
        });
        ctx.restore();
      }
    }

    shape(ctx, shape, progress) {
      if (shape.kind === "circle") {
        ctx.beginPath();
        ctx.arc(shape.x, shape.y, shape.r, -Math.PI / 2, -Math.PI / 2 + TAU * progress);
        ctx.stroke();
      } else if (shape.kind === "line") {
        ctx.beginPath();
        ctx.moveTo(shape.x1, shape.y1);
        ctx.lineTo(shape.x1 + (shape.x2 - shape.x1) * progress, shape.y1 + (shape.y2 - shape.y1) * progress);
        ctx.stroke();
      } else if (shape.kind === "polyline") {
        const points = shape.points;
        const segments = shape.closed ? points.length : points.length - 1;
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
      } else if (shape.kind === "bezier") {
        const [a, b, c] = shape.points;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.quadraticCurveTo(b.x, b.y, a.x + (c.x - a.x) * progress, a.y + (c.y - a.y) * progress);
        ctx.stroke();
      }
    }
  }

  class UI {
    constructor(state) {
      this.state = state;
      this.events = {};
      this.els = {};
      this.bind();
    }

    on(name, fn) {
      this.events[name] = fn;
    }

    emit(name) {
      if (this.events[name]) this.events[name](this.state);
    }

    bind() {
      ["pattern", "colorMode", "backgroundMode", "scale", "rotation", "lineWidth", "glow", "complexity", "speed", "particles", "pulse", "breathing", "rotate", "transparent"].forEach((id) => {
        this.els[id] = document.getElementById(id);
      });
      this.els.statusPattern = document.getElementById("statusPattern");
      this.fill(this.els.pattern, Object.keys(labels).map((key) => [key, labels[key]]));
      this.fill(this.els.colorMode, Object.keys(palettes).map((key) => [key, this.label(key)]));
      this.fill(this.els.backgroundMode, ["dark", "deepSpace", "light", "stars"].map((key) => [key, this.label(key)]));
      ["pattern", "colorMode", "backgroundMode"].forEach((key) => {
        this.els[key].addEventListener("change", () => {
          this.state[key] = this.els[key].value;
          this.sync();
          this.emit(key === "pattern" ? "pattern" : "change");
        });
      });
      ["scale", "rotation", "lineWidth", "glow", "complexity", "speed"].forEach((key) => {
        this.els[key].addEventListener("input", () => {
          this.state[key] = Number(this.els[key].value);
          this.updateLabels();
          this.emit(key === "complexity" ? "pattern" : "change");
        });
      });
      const toggles = { particles: "particles", pulse: "pulse", breathing: "breathing", rotate: "autoRotate", transparent: "transparent" };
      Object.entries(toggles).forEach(([id, key]) => {
        this.els[id].addEventListener("change", () => {
          this.state[key] = this.els[id].checked;
          this.emit("change");
        });
      });
      document.getElementById("randomPattern").addEventListener("click", () => {
        const keys = Object.keys(labels);
        this.state.pattern = keys[Math.floor(Math.random() * keys.length)];
        this.sync();
        this.emit("pattern");
      });
      document.getElementById("randomColors").addEventListener("click", () => {
        const keys = Object.keys(palettes);
        this.state.colorMode = keys[Math.floor(Math.random() * keys.length)];
        this.sync();
        this.emit("change");
      });
      document.getElementById("reset").addEventListener("click", () => this.emit("reset"));
      document.getElementById("fullscreen").addEventListener("click", () => document.documentElement.requestFullscreen && document.documentElement.requestFullscreen());
      document.getElementById("exportPng").addEventListener("click", () => this.emit("exportPng"));
      document.getElementById("exportSvg").addEventListener("click", () => this.emit("exportSvg"));
      this.sync();
    }

    fill(select, pairs) {
      select.innerHTML = pairs.map(([value, label]) => `<option value="${value}">${label}</option>`).join("");
    }

    label(value) {
      return value.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
    }

    sync() {
      Object.entries(this.els).forEach(([key, el]) => {
        if (!el || key === "statusPattern") return;
        const stateKey = key === "rotate" ? "autoRotate" : key;
        if (el.type === "checkbox") el.checked = Boolean(this.state[stateKey]);
        else if (this.state[stateKey] !== undefined) el.value = this.state[stateKey];
      });
      this.updateLabels();
    }

    updateLabels() {
      this.els.statusPattern.textContent = labels[this.state.pattern];
      document.getElementById("scaleValue").textContent = `${this.state.scale.toFixed(2)}x`;
      document.getElementById("rotationValue").textContent = `${Math.round(this.state.rotation)} deg`;
      document.getElementById("lineWidthValue").textContent = `${this.state.lineWidth.toFixed(1)} px`;
      document.getElementById("glowValue").textContent = `${Math.round(this.state.glow)} px`;
      document.getElementById("complexityValue").textContent = this.state.complexity;
      document.getElementById("speedValue").textContent = `${this.state.speed.toFixed(2)}x`;
    }
  }

  class Exporter {
    static png(canvas) {
      canvas.toBlob((blob) => {
        if (!blob) return;
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `sacred-geometry-${Date.now()}.png`;
        link.click();
        setTimeout(() => URL.revokeObjectURL(link.href), 1000);
      }, "image/png");
    }

    static svg(shapes, state) {
      const body = shapes.map((shape) => {
        if (shape.kind === "circle") return `<circle cx="${shape.x}" cy="${shape.y}" r="${shape.r}" fill="none" stroke="#69e8ff" stroke-width="${state.lineWidth}"/>`;
        if (shape.kind === "line") return `<line x1="${shape.x1}" y1="${shape.y1}" x2="${shape.x2}" y2="${shape.y2}" stroke="#69e8ff" stroke-width="${state.lineWidth}" stroke-linecap="round"/>`;
        if (shape.kind === "polyline") return `<polygon points="${shape.points.map((p) => `${p.x},${p.y}`).join(" ")}" fill="none" stroke="#69e8ff" stroke-width="${state.lineWidth}" stroke-linejoin="round"/>`;
        if (shape.kind === "bezier") {
          const [a, b, c] = shape.points;
          return `<path d="M ${a.x} ${a.y} Q ${b.x} ${b.y} ${c.x} ${c.y}" fill="none" stroke="#69e8ff" stroke-width="${state.lineWidth}"/>`;
        }
        return "";
      }).join("\n");
      const bg = state.transparent ? "" : `<rect x="-800" y="-800" width="1600" height="1600" fill="#070b16"/>`;
      this.download(new Blob([`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1600" viewBox="-800 -800 1600 1600">${bg}<g transform="rotate(${state.rotation}) scale(${state.scale})">${body}</g></svg>`], { type: "image/svg+xml" }), `sacred-geometry-${Date.now()}.svg`);
    }

    static download(blob, filename) {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    }
  }

  class App {
    constructor() {
      this.state = { ...defaultState };
      this.canvas = document.getElementById("scene");
      this.renderer = new Renderer(this.canvas);
      this.patterns = new Patterns();
      this.anim = new AnimationState();
      this.ui = new UI(this.state);
      this.shapes = this.patterns.create(this.state.pattern, this.state.complexity);
      this.drag = { active: false, x: 0, rotation: 0 };
      this.lastRender = 0;
      this.frameInterval = 1000 / 45;
      this.bind();
      requestAnimationFrame((now) => this.loop(now));
    }

    bind() {
      this.ui.on("pattern", () => this.rebuild());
      this.ui.on("reset", () => this.reset());
      this.ui.on("exportPng", () => Exporter.png(this.canvas));
      this.ui.on("exportSvg", () => Exporter.svg(this.shapes, this.state));
      this.canvas.addEventListener("wheel", (event) => {
        event.preventDefault();
        this.state.scale = clamp(this.state.scale * (event.deltaY > 0 ? 0.94 : 1.06), 0.45, 1.85);
        this.ui.sync();
      }, { passive: false });
      this.canvas.addEventListener("pointerdown", (event) => {
        this.drag = { active: true, x: event.clientX, rotation: this.state.rotation };
        this.canvas.setPointerCapture(event.pointerId);
      });
      this.canvas.addEventListener("pointermove", (event) => {
        this.renderer.particles.setMouse(event.clientX, event.clientY, true);
        if (!this.drag.active) return;
        this.state.rotation = this.drag.rotation + (event.clientX - this.drag.x) * 0.35;
        this.ui.sync();
      });
      this.canvas.addEventListener("pointerup", (event) => {
        this.drag.active = false;
        this.renderer.particles.setMouse(event.clientX, event.clientY, false);
      });
      this.canvas.addEventListener("pointerleave", () => {
        this.drag.active = false;
        this.renderer.particles.setMouse(0, 0, false);
      });
      this.canvas.addEventListener("dblclick", () => this.reset());
    }

    rebuild() {
      this.shapes = this.patterns.create(this.state.pattern, this.state.complexity);
      this.anim.restart();
    }

    reset() {
      Object.assign(this.state, defaultState);
      this.rebuild();
      this.ui.sync();
    }

    loop(now) {
      if (document.hidden) {
        requestAnimationFrame((next) => this.loop(next));
        return;
      }
      if (now - this.lastRender < this.frameInterval) {
        requestAnimationFrame((next) => this.loop(next));
        return;
      }
      this.lastRender = now;
      this.anim.tick(now);
      this.renderer.render(this.shapes, this.state, this.anim);
      requestAnimationFrame((next) => this.loop(next));
    }
  }

  window.addEventListener("DOMContentLoaded", () => new App());
}());
