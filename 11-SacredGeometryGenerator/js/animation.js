import { clamp, easeInOutCubic } from "./utils.js";

export class AnimationState {
  constructor() {
    this.time = 0;
    this.delta = 0;
    this.last = performance.now();
    this.transition = 1;
    this.transitionStart = 0;
  }

  tick(now = performance.now()) {
    this.delta = Math.min(0.05, (now - this.last) / 1000);
    this.time += this.delta;
    this.last = now;
    this.transition = clamp((now - this.transitionStart) / 900, 0, 1);
  }

  restartTransition() {
    this.transitionStart = performance.now();
    this.transition = 0;
  }

  get transitionEase() {
    return easeInOutCubic(this.transition);
  }
}
