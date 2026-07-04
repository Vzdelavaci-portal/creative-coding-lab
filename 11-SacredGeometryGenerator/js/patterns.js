import { TAU, polar } from "./utils.js";

const LABELS = {
  flower: "Flower of Life",
  seed: "Seed of Life",
  metatron: "Metatron's Cube",
  sri: "Sri Yantra",
  vesica: "Vesica Piscis",
  hex: "Hexagonal Grid"
};

export const PATTERN_KEYS = Object.keys(LABELS);

export function getPatternLabel(key) {
  return LABELS[key] ?? key;
}

export class SacredPatterns {
  create(type, complexity = 5) {
    const c = Math.max(1, Math.round(complexity));
    const radius = 92;
    const map = {
      flower: () => this.flowerOfLife(radius, c),
      seed: () => this.seedOfLife(radius, c),
      metatron: () => this.metatron(radius, c),
      sri: () => this.sriYantra(radius, c),
      vesica: () => this.vesica(radius, c),
      hex: () => this.hexGrid(radius, c)
    };
    return (map[type] || map.flower)();
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

  flowerOfLife(r, complexity) {
    const rings = Math.min(4, Math.max(2, Math.ceil(complexity / 2) + 1));
    const shapes = [this.circle(0, 0, r, 0)];
    let order = 1;
    for (let q = -rings; q <= rings; q++) {
      for (let s = -rings; s <= rings; s++) {
        const t = -q - s;
        const dist = Math.max(Math.abs(q), Math.abs(s), Math.abs(t));
        if (dist === 0 || dist > rings) continue;
        const x = r * (q + s / 2);
        const y = r * (Math.sqrt(3) / 2) * s;
        shapes.push(this.circle(x, y, r, order++));
      }
    }
    return shapes;
  }

  seedOfLife(r, complexity) {
    const shapes = [this.circle(0, 0, r, 0)];
    for (let i = 0; i < 6; i++) {
      const p = polar(r, i * TAU / 6);
      shapes.push(this.circle(p.x, p.y, r, i + 1));
    }
    if (complexity > 4) shapes.push(this.circle(0, 0, r * 2, 8, "outer"));
    return shapes;
  }

  metatron(r, complexity) {
    const shapes = this.seedOfLife(r, complexity);
    const points = [{ x: 0, y: 0 }];
    for (let i = 0; i < 6; i++) points.push(polar(r, i * TAU / 6));
    for (let i = 0; i < 6; i++) points.push(polar(r * 2, i * TAU / 6 + TAU / 12));
    let order = shapes.length + 1;
    points.forEach((p) => shapes.push(this.circle(p.x, p.y, 7, order++, "node")));
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const d = Math.hypot(dx, dy);
        if (d < r * (complexity > 5 ? 3.05 : 2.05)) {
          shapes.push(this.line(points[i], points[j], order++, "connective"));
        }
      }
    }
    return shapes;
  }

  sriYantra(r, complexity) {
    const shapes = [];
    let order = 0;
    const scales = [2.35, 2.0, 1.66, 1.32, 1.02, 0.76, 0.54, 0.34, 0.18];
    scales.forEach((s, i) => {
      const up = i % 2 === 0;
      const rot = up ? -Math.PI / 2 : Math.PI / 2;
      const offset = (i - 4) * r * 0.045;
      const pts = [0, 1, 2].map((n) => polar(r * s, rot + n * TAU / 3, 0, offset));
      shapes.push(this.polygon(pts, order++, up ? "up-triangle" : "down-triangle"));
    });
    const petals = 8 + Math.min(8, complexity * 2);
    for (let i = 0; i < petals; i++) {
      const a = i * TAU / petals;
      const p1 = polar(r * 0.9, a - 0.12);
      const p2 = polar(r * 1.28, a);
      const p3 = polar(r * 0.9, a + 0.12);
      shapes.push({ kind: "bezier", points: [p1, p2, p3], order: order++, group: "petal" });
    }
    shapes.push(this.circle(0, 0, r * 1.48, order++, "lotus"));
    shapes.push(this.circle(0, 0, r * 2.55, order++, "outer"));
    return shapes;
  }

  vesica(r, complexity) {
    const d = r;
    const shapes = [
      this.circle(-d / 2, 0, r, 0),
      this.circle(d / 2, 0, r, 1)
    ];
    const h = Math.sqrt(r * r - (d / 2) * (d / 2));
    shapes.push(this.line({ x: 0, y: -h }, { x: 0, y: h }, 2, "axis"));
    for (let i = 1; i <= complexity; i++) {
      shapes.push(this.circle(0, 0, (r * i) / complexity, 2 + i, "nested"));
    }
    return shapes;
  }

  hexGrid(r, complexity) {
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
        const pts = Array.from({ length: 6 }, (_, i) => polar(size, Math.PI / 6 + i * TAU / 6, cx, cy));
        shapes.push(this.polygon(pts, order++, "cell"));
      }
    }
    return shapes;
  }
}
