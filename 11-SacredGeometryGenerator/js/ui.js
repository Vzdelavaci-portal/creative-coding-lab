import { COLOR_MODES, BACKGROUND_MODES } from "./renderer.js";
import { PATTERN_KEYS, getPatternLabel } from "./patterns.js";

export const DEFAULT_STATE = {
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

export class UI {
  constructor(state) {
    this.state = state;
    this.listeners = new Map();
    this.bind();
  }

  on(event, callback) {
    this.listeners.set(event, callback);
  }

  emit(event, detail) {
    this.listeners.get(event)?.(detail);
  }

  bind() {
    this.els = {
      pattern: document.querySelector("#pattern"),
      colorMode: document.querySelector("#colorMode"),
      backgroundMode: document.querySelector("#backgroundMode"),
      scale: document.querySelector("#scale"),
      rotation: document.querySelector("#rotation"),
      lineWidth: document.querySelector("#lineWidth"),
      glow: document.querySelector("#glow"),
      complexity: document.querySelector("#complexity"),
      speed: document.querySelector("#speed"),
      particles: document.querySelector("#particles"),
      pulse: document.querySelector("#pulse"),
      breathing: document.querySelector("#breathing"),
      rotate: document.querySelector("#rotate"),
      transparent: document.querySelector("#transparent"),
      statusPattern: document.querySelector("#statusPattern")
    };

    this.fillSelect(this.els.pattern, PATTERN_KEYS.map((key) => [key, getPatternLabel(key)]));
    this.fillSelect(this.els.colorMode, COLOR_MODES.map((key) => [key, this.labelize(key)]));
    this.fillSelect(this.els.backgroundMode, BACKGROUND_MODES.map((key) => [key, this.labelize(key)]));

    ["pattern", "colorMode", "backgroundMode"].forEach((key) => {
      this.els[key].addEventListener("change", () => {
        this.state[key] = this.els[key].value;
        this.updateLabels();
        this.emit(key === "pattern" ? "pattern" : "change", this.state);
      });
    });

    ["scale", "rotation", "lineWidth", "glow", "complexity", "speed"].forEach((key) => {
      this.els[key].addEventListener("input", () => {
        this.state[key] = Number(this.els[key].value);
        this.updateLabels();
        this.emit(key === "complexity" ? "pattern" : "change", this.state);
      });
    });

    const toggleMap = { particles: "particles", pulse: "pulse", breathing: "breathing", rotate: "autoRotate", transparent: "transparent" };
    Object.entries(toggleMap).forEach(([id, key]) => {
      this.els[id].addEventListener("change", () => {
        this.state[key] = this.els[id].checked;
        this.emit("change", this.state);
      });
    });

    document.querySelector("#randomPattern").addEventListener("click", () => this.randomPattern());
    document.querySelector("#randomColors").addEventListener("click", () => this.randomColors());
    document.querySelector("#reset").addEventListener("click", () => this.emit("reset"));
    document.querySelector("#fullscreen").addEventListener("click", () => document.documentElement.requestFullscreen?.());
    document.querySelector("#exportPng").addEventListener("click", () => this.emit("exportPng"));
    document.querySelector("#exportSvg").addEventListener("click", () => this.emit("exportSvg"));

    this.sync();
  }

  fillSelect(select, pairs) {
    select.innerHTML = pairs.map(([value, label]) => `<option value="${value}">${label}</option>`).join("");
  }

  labelize(value) {
    return value.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
  }

  sync() {
    Object.entries(this.els).forEach(([key, el]) => {
      if (!el || key.startsWith("status")) return;
      const stateKey = key === "rotate" ? "autoRotate" : key;
      if (el.type === "checkbox") el.checked = Boolean(this.state[stateKey]);
      else if (this.state[stateKey] !== undefined) el.value = this.state[stateKey];
    });
    this.updateLabels();
  }

  updateLabels() {
    this.els.statusPattern.textContent = getPatternLabel(this.state.pattern);
    const values = {
      scale: `${this.state.scale.toFixed(2)}x`,
      rotation: `${Math.round(this.state.rotation)} deg`,
      lineWidth: `${this.state.lineWidth.toFixed(1)} px`,
      glow: `${Math.round(this.state.glow)} px`,
      complexity: this.state.complexity,
      speed: `${this.state.speed.toFixed(2)}x`
    };
    Object.entries(values).forEach(([key, value]) => {
      document.querySelector(`#${key}Value`).textContent = value;
    });
  }

  randomPattern() {
    this.state.pattern = PATTERN_KEYS[Math.floor(Math.random() * PATTERN_KEYS.length)];
    this.sync();
    this.emit("pattern", this.state);
  }

  randomColors() {
    this.state.colorMode = COLOR_MODES[Math.floor(Math.random() * COLOR_MODES.length)];
    this.sync();
    this.emit("change", this.state);
  }
}
