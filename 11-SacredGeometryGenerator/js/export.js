import { downloadBlob } from "./utils.js";

export class Exporter {
  static png(canvas) {
    canvas.toBlob((blob) => {
      if (blob) downloadBlob(blob, `sacred-geometry-${Date.now()}.png`);
    }, "image/png");
  }

  static svg(shapes, state, width = 1600, height = 1600) {
    const line = state.lineWidth;
    const color = "#69e8ff";
    const body = shapes.map((shape) => {
      if (shape.kind === "circle") {
        return `<circle cx="${shape.x}" cy="${shape.y}" r="${shape.r}" fill="none" stroke="${color}" stroke-width="${line}"/>`;
      }
      if (shape.kind === "line") {
        return `<line x1="${shape.x1}" y1="${shape.y1}" x2="${shape.x2}" y2="${shape.y2}" stroke="${color}" stroke-width="${line}" stroke-linecap="round"/>`;
      }
      if (shape.kind === "polyline") {
        const points = shape.points.map((p) => `${p.x},${p.y}`).join(" ");
        return `<polygon points="${points}" fill="none" stroke="${color}" stroke-width="${line}" stroke-linejoin="round"/>`;
      }
      if (shape.kind === "bezier") {
        const [a, b, c] = shape.points;
        return `<path d="M ${a.x} ${a.y} Q ${b.x} ${b.y} ${c.x} ${c.y}" fill="none" stroke="${color}" stroke-width="${line}"/>`;
      }
      return "";
    }).join("\n  ");
    const bg = state.transparent ? "" : `<rect x="-800" y="-800" width="1600" height="1600" fill="#070b16"/>`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="-800 -800 1600 1600">
  ${bg}
  <g transform="rotate(${state.rotation}) scale(${state.scale})" stroke-linecap="round">
  ${body}
  </g>
</svg>`;
    downloadBlob(new Blob([svg], { type: "image/svg+xml" }), `sacred-geometry-${Date.now()}.svg`);
  }
}
