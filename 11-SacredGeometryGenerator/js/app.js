import { AnimationState } from "./animation.js";
import { Exporter } from "./export.js";
import { SacredPatterns } from "./patterns.js";
import { Renderer } from "./renderer.js";
import { DEFAULT_STATE, UI } from "./ui.js";
import { clamp } from "./utils.js";

class SacredGeometryApp {
  constructor() {
    this.state = { ...DEFAULT_STATE };
    this.canvas = document.querySelector("#scene");
    this.renderer = new Renderer(this.canvas);
    this.patterns = new SacredPatterns();
    this.animation = new AnimationState();
    this.ui = new UI(this.state);
    this.shapes = this.patterns.create(this.state.pattern, this.state.complexity);
    this.drag = { active: false, x: 0, rotation: 0 };
    this.lastRender = 0;
    this.frameInterval = 1000 / 45;
    this.bind();
    requestAnimationFrame((now) => this.loop(now));
  }

  bind() {
    this.ui.on("pattern", () => this.rebuildPattern());
    this.ui.on("reset", () => this.reset());
    this.ui.on("exportPng", () => Exporter.png(this.canvas));
    this.ui.on("exportSvg", () => Exporter.svg(this.shapes, this.state));

    this.canvas.addEventListener("wheel", (event) => {
      event.preventDefault();
      const factor = event.deltaY > 0 ? 0.94 : 1.06;
      this.state.scale = clamp(this.state.scale * factor, 0.45, 1.85);
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

  rebuildPattern() {
    this.shapes = this.patterns.create(this.state.pattern, this.state.complexity);
    this.animation.restartTransition();
  }

  reset() {
    Object.assign(this.state, DEFAULT_STATE);
    this.shapes = this.patterns.create(this.state.pattern, this.state.complexity);
    this.animation.restartTransition();
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
    this.animation.tick(now);
    this.renderer.render(this.shapes, this.state, this.animation);
    requestAnimationFrame((next) => this.loop(next));
  }
}

new SacredGeometryApp();
