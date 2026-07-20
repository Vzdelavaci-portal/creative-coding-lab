"use strict";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", {
  alpha: false
});

const panel = document.querySelector(".panel");
const collapseBtn = document.getElementById("collapseBtn");

const pointAmountInput = document.getElementById("pointAmount");
const resolutionInput = document.getElementById("resolution");
const edgeWidthInput = document.getElementById("edgeWidth");
const glowInput = document.getElementById("glow");
const animationSpeedInput = document.getElementById("animationSpeed");
const paletteInput = document.getElementById("palette");

const animateToggle = document.getElementById("animateToggle");
const edgesToggle = document.getElementById("edgesToggle");
const pointsToggle = document.getElementById("pointsToggle");
const delaunayToggle = document.getElementById("delaunayToggle");

const pointAmountValue = document.getElementById("pointAmountValue");
const resolutionValue = document.getElementById("resolutionValue");
const edgeWidthValue = document.getElementById("edgeWidthValue");
const glowValue = document.getElementById("glowValue");
const animationSpeedValue = document.getElementById(
  "animationSpeedValue"
);

const pointCount = document.getElementById("pointCount");
const fpsValue = document.getElementById("fpsValue");
const modeValue = document.getElementById("modeValue");

const randomBtn = document.getElementById("randomBtn");
const addBtn = document.getElementById("addBtn");
const relaxBtn = document.getElementById("relaxBtn");
const burstBtn = document.getElementById("burstBtn");
const resetBtn = document.getElementById("resetBtn");
const saveBtn = document.getElementById("saveBtn");

const offscreen = document.createElement("canvas");
const offscreenCtx = offscreen.getContext("2d", {
  willReadFrequently: true
});

let width = 0;
let height = 0;
let dpr = 1;

let points = [];
let draggedPoint = null;
let hoveredPoint = null;

let needsRender = true;
let time = 0;
let hueShift = 0;

let previousTimestamp = performance.now();
let smoothedFps = 60;

const palettes = {
  neon: [
    [34, 211, 238],
    [59, 130, 246],
    [99, 102, 241],
    [168, 85, 247],
    [236, 72, 153]
  ],

  ocean: [
    [8, 47, 73],
    [14, 116, 144],
    [6, 182, 212],
    [56, 189, 248],
    [125, 211, 252]
  ],

  sunset: [
    [124, 45, 18],
    [234, 88, 12],
    [249, 115, 22],
    [251, 113, 133],
    [244, 114, 182]
  ],

  forest: [
    [20, 83, 45],
    [22, 163, 74],
    [52, 211, 153],
    [132, 204, 22],
    [250, 204, 21]
  ],

  candy: [
    [244, 114, 182],
    [192, 132, 252],
    [129, 140, 248],
    [34, 211, 238],
    [253, 224, 71]
  ],

  mono: [
    [248, 250, 252],
    [203, 213, 225],
    [148, 163, 184],
    [100, 116, 139],
    [51, 65, 85]
  ]
};

class VoronoiPoint {
  constructor(x, y, index) {
    this.x = x;
    this.y = y;

    this.vx = (Math.random() - 0.5) * 0.7;
    this.vy = (Math.random() - 0.5) * 0.7;

    this.radius = Math.random() * 2.5 + 5;
    this.phase = Math.random() * Math.PI * 2;

    this.paletteIndex = index;
    this.colorOffset = Math.random() * 80;
  }

  update(speed) {
    this.phase += 0.015;

    this.x += this.vx * speed;
    this.y += this.vy * speed;

    const safeLeft = width > 720 ? 400 : 20;
    const margin = 24;

    if (this.x < safeLeft + margin) {
      this.x = safeLeft + margin;
      this.vx = Math.abs(this.vx);
    }

    if (this.x > width - margin) {
      this.x = width - margin;
      this.vx = -Math.abs(this.vx);
    }

    if (this.y < margin) {
      this.y = margin;
      this.vy = Math.abs(this.vy);
    }

    if (this.y > height - margin) {
      this.y = height - margin;
      this.vy = -Math.abs(this.vy);
    }
  }
}

function resizeCanvas() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);

  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);

  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = true;

  resizeOffscreen();
  keepPointsInside();
  needsRender = true;
}

function resizeOffscreen() {
  const resolution = Math.max(2, Number(resolutionInput.value));

  offscreen.width = Math.max(1, Math.ceil(width / resolution));
  offscreen.height = Math.max(1, Math.ceil(height / resolution));
}

function createRandomPoints(count = Number(pointAmountInput.value)) {
  points = [];

  const safeLeft = width > 720 ? 410 : 20;
  const usableWidth = Math.max(100, width - safeLeft - 40);

  for (let i = 0; i < count; i++) {
    points.push(
      new VoronoiPoint(
        safeLeft + Math.random() * usableWidth,
        30 + Math.random() * Math.max(100, height - 60),
        i
      )
    );
  }

  updateStats();
  needsRender = true;
}

function keepPointsInside() {
  const safeLeft = width > 720 ? 410 : 20;

  for (const point of points) {
    point.x = Math.max(safeLeft + 20, Math.min(width - 20, point.x));
    point.y = Math.max(20, Math.min(height - 20, point.y));
  }
}

function updatePointCount() {
  const desired = Number(pointAmountInput.value);

  while (points.length < desired) {
    addRandomPoint();
  }

  while (points.length > desired) {
    points.pop();
  }

  updateStats();
  needsRender = true;
}

function addRandomPoint() {
  const safeLeft = width > 720 ? 410 : 20;

  points.push(
    new VoronoiPoint(
      safeLeft + Math.random() * Math.max(100, width - safeLeft - 40),
      30 + Math.random() * Math.max(100, height - 60),
      points.length
    )
  );
}

function addPoint(x = null, y = null) {
  const safeLeft = width > 720 ? 410 : 20;

  const px =
    x ??
    safeLeft +
      Math.random() * Math.max(100, width - safeLeft - 40);

  const py =
    y ??
    30 +
      Math.random() * Math.max(100, height - 60);

  points.push(new VoronoiPoint(px, py, points.length));

  pointAmountInput.value = Math.min(
    Number(pointAmountInput.max),
    points.length
  );

  updateStats();
  needsRender = true;
}

function removePoint(point) {
  if (points.length <= 2) {
    return;
  }

  const index = points.indexOf(point);

  if (index !== -1) {
    points.splice(index, 1);
  }

  pointAmountInput.value = points.length;

  updateStats();
  needsRender = true;
}

function getPointColor(point, index) {
  if (paletteInput.value === "rainbow") {
    const hue =
      (index * (360 / Math.max(1, points.length)) +
        hueShift +
        point.colorOffset) %
      360;

    return hslToRgb(hue, 88, 60);
  }

  const palette = palettes[paletteInput.value] || palettes.neon;
  const base = palette[index % palette.length];

  const variation =
    Math.sin(point.phase + point.colorOffset) * 8;

  return [
    clamp(base[0] + variation, 0, 255),
    clamp(base[1] + variation, 0, 255),
    clamp(base[2] + variation, 0, 255)
  ];
}

function renderVoronoi() {
  const cellWidth = offscreen.width;
  const cellHeight = offscreen.height;
  const resolution = Number(resolutionInput.value);

  if (cellWidth <= 0 || cellHeight <= 0 || points.length === 0) {
    return;
  }

  const imageData = offscreenCtx.createImageData(
    cellWidth,
    cellHeight
  );

  const data = imageData.data;
  const showEdges = edgesToggle.checked;
  const edgeThreshold = Number(edgeWidthInput.value) / 10;

  const pointColors = points.map((point, index) =>
    getPointColor(point, index)
  );

  for (let py = 0; py < cellHeight; py++) {
    const worldY = py * resolution;

    for (let px = 0; px < cellWidth; px++) {
      const worldX = px * resolution;

      let nearestIndex = 0;
      let nearestDistance = Infinity;
      let secondDistance = Infinity;

      for (let i = 0; i < points.length; i++) {
        const dx = worldX - points[i].x;
        const dy = worldY - points[i].y;
        const distance = dx * dx + dy * dy;

        if (distance < nearestDistance) {
          secondDistance = nearestDistance;
          nearestDistance = distance;
          nearestIndex = i;
        } else if (distance < secondDistance) {
          secondDistance = distance;
        }
      }

      let [r, g, b] = pointColors[nearestIndex];

      const distanceShade = Math.min(
        1,
        Math.sqrt(nearestDistance) / 520
      );

      const light = 1 - distanceShade * 0.28;

      r *= light;
      g *= light;
      b *= light;

      if (showEdges) {
        const edgeDistance =
          Math.sqrt(secondDistance) -
          Math.sqrt(nearestDistance);

        if (edgeDistance < edgeThreshold * resolution) {
          const edgeStrength =
            1 -
            edgeDistance / Math.max(1, edgeThreshold * resolution);

          r = mix(r, 240, edgeStrength * 0.78);
          g = mix(g, 248, edgeStrength * 0.78);
          b = mix(b, 255, edgeStrength * 0.78);
        }
      }

      const offset = (py * cellWidth + px) * 4;

      data[offset] = r;
      data[offset + 1] = g;
      data[offset + 2] = b;
      data[offset + 3] = 255;
    }
  }

  offscreenCtx.putImageData(imageData, 0, 0);

  ctx.save();

  ctx.clearRect(0, 0, width, height);
  ctx.imageSmoothingEnabled = true;

  ctx.drawImage(offscreen, 0, 0, width, height);

  drawAtmosphere();

  if (delaunayToggle.checked) {
    drawDelaunayApproximation();
  }

  if (pointsToggle.checked) {
    drawPoints();
  }

  ctx.restore();

  needsRender = false;
}

function drawAtmosphere() {
  const glow = Number(glowInput.value);

  ctx.save();
  ctx.globalCompositeOperation = "screen";

  const centerGradient = ctx.createRadialGradient(
    width * 0.68,
    height * 0.48,
    0,
    width * 0.68,
    height * 0.48,
    Math.max(width, height) * 0.68
  );

  centerGradient.addColorStop(
    0,
    `rgba(255, 255, 255, ${0.025 + glow / 1800})`
  );

  centerGradient.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = centerGradient;
  ctx.fillRect(0, 0, width, height);

  ctx.restore();
}

function drawPoints() {
  const glow = Number(glowInput.value);

  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    const [r, g, b] = getPointColor(point, i);

    const isHovered = point === hoveredPoint;
    const radius =
      point.radius +
      Math.sin(time * 2.2 + point.phase) * 1.2 +
      (isHovered ? 4 : 0);

    ctx.save();

    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.shadowColor = `rgb(${r}, ${g}, ${b})`;
    ctx.shadowBlur = glow + (isHovered ? 14 : 4);

    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(255,255,255,0.82)";
    ctx.lineWidth = isHovered ? 2 : 1;

    ctx.beginPath();
    ctx.arc(point.x, point.y, radius + 3, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }
}

function drawDelaunayApproximation() {
  const links = buildNeighborLinks(4);

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.lineWidth = 1;

  for (const [a, b] of links) {
    const gradient = ctx.createLinearGradient(
      a.x,
      a.y,
      b.x,
      b.y
    );

    gradient.addColorStop(0, "rgba(255,255,255,0.34)");
    gradient.addColorStop(1, "rgba(103,232,249,0.14)");

    ctx.strokeStyle = gradient;

    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  ctx.restore();
}

function buildNeighborLinks(neighborCount = 4) {
  const unique = new Map();

  for (let i = 0; i < points.length; i++) {
    const distances = [];

    for (let j = 0; j < points.length; j++) {
      if (i === j) {
        continue;
      }

      const dx = points[i].x - points[j].x;
      const dy = points[i].y - points[j].y;

      distances.push({
        index: j,
        distance: dx * dx + dy * dy
      });
    }

    distances.sort((a, b) => a.distance - b.distance);

    for (const neighbor of distances.slice(0, neighborCount)) {
      const start = Math.min(i, neighbor.index);
      const end = Math.max(i, neighbor.index);
      const key = `${start}-${end}`;

      if (!unique.has(key)) {
        unique.set(key, [points[start], points[end]]);
      }
    }
  }

  return Array.from(unique.values());
}

function relaxPoints() {
  if (points.length < 2) {
    return;
  }

  const samplesPerPoint = 100;
  const sums = points.map(() => ({
    x: 0,
    y: 0,
    count: 0
  }));

  const safeLeft = width > 720 ? 400 : 0;

  for (let i = 0; i < points.length * samplesPerPoint; i++) {
    const x =
      safeLeft + Math.random() * Math.max(1, width - safeLeft);

    const y = Math.random() * height;

    const nearestIndex = findNearestPointIndex(x, y);

    sums[nearestIndex].x += x;
    sums[nearestIndex].y += y;
    sums[nearestIndex].count++;
  }

  points.forEach((point, index) => {
    const sum = sums[index];

    if (sum.count === 0) {
      return;
    }

    const targetX = sum.x / sum.count;
    const targetY = sum.y / sum.count;

    point.x = mix(point.x, targetX, 0.55);
    point.y = mix(point.y, targetY, 0.55);
  });

  needsRender = true;
}

function findNearestPointIndex(x, y) {
  let nearestIndex = 0;
  let nearestDistance = Infinity;

  for (let i = 0; i < points.length; i++) {
    const dx = x - points[i].x;
    const dy = y - points[i].y;
    const distance = dx * dx + dy * dy;

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = i;
    }
  }

  return nearestIndex;
}

function findPointAt(x, y) {
  let found = null;
  let nearestDistance = Infinity;

  for (const point of points) {
    const dx = x - point.x;
    const dy = y - point.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 18 && distance < nearestDistance) {
      nearestDistance = distance;
      found = point;
    }
  }

  return found;
}

function colorBurst() {
  hueShift += 90;

  for (const point of points) {
    point.colorOffset += Math.random() * 180;
    point.vx += (Math.random() - 0.5) * 2;
    point.vy += (Math.random() - 0.5) * 2;
  }

  needsRender = true;
}

function resetGenerator() {
  pointAmountInput.value = 26;
  resolutionInput.value = 5;
  edgeWidthInput.value = 24;
  glowInput.value = 14;
  animationSpeedInput.value = 45;
  paletteInput.value = "neon";

  animateToggle.checked = true;
  edgesToggle.checked = true;
  pointsToggle.checked = true;
  delaunayToggle.checked = false;

  hueShift = 0;

  resizeOffscreen();
  createRandomPoints(26);
  updateLabels();
}

function updatePoints() {
  if (!animateToggle.checked || draggedPoint) {
    return false;
  }

  const speed = Number(animationSpeedInput.value) / 100;

  if (speed <= 0) {
    return false;
  }

  for (const point of points) {
    point.update(speed);
  }

  return true;
}

function updateLabels() {
  pointAmountValue.textContent = pointAmountInput.value;
  resolutionValue.textContent = resolutionInput.value;
  edgeWidthValue.textContent = (
    Number(edgeWidthInput.value) / 10
  ).toFixed(1);

  glowValue.textContent = glowInput.value;

  animationSpeedValue.textContent = (
    Number(animationSpeedInput.value) / 100
  ).toFixed(2);

  updateStats();
}

function updateStats() {
  pointCount.textContent = points.length;

  if (delaunayToggle.checked) {
    modeValue.textContent = "Delaunay";
  } else if (edgesToggle.checked) {
    modeValue.textContent = "Cells";
  } else {
    modeValue.textContent = "Color";
  }
}

function saveImage() {
  const exportCanvas = document.createElement("canvas");
  const exportCtx = exportCanvas.getContext("2d");

  exportCanvas.width = canvas.width;
  exportCanvas.height = canvas.height;

  exportCtx.drawImage(canvas, 0, 0);

  const link = document.createElement("a");
  link.download = "voronoi-art-generator.png";
  link.href = exportCanvas.toDataURL("image/png");
  link.click();
}

function animate(timestamp) {
  const delta = Math.max(1, timestamp - previousTimestamp);
  previousTimestamp = timestamp;

  const currentFps = 1000 / delta;
  smoothedFps = mix(smoothedFps, currentFps, 0.08);

  fpsValue.textContent = Math.round(smoothedFps);

  time += delta / 1000;

  if (paletteInput.value === "rainbow") {
    hueShift += delta * 0.012;
    needsRender = true;
  }

  if (updatePoints()) {
    needsRender = true;
  }

  if (needsRender) {
    renderVoronoi();
  }

  requestAnimationFrame(animate);
}

canvas.addEventListener("mousedown", event => {
  if (event.button !== 0) {
    return;
  }

  const point = findPointAt(event.clientX, event.clientY);

  if (point) {
    draggedPoint = point;
    return;
  }

  addPoint(event.clientX, event.clientY);
});

canvas.addEventListener("mousemove", event => {
  hoveredPoint = findPointAt(event.clientX, event.clientY);

  if (!draggedPoint) {
    needsRender = true;
    return;
  }

  draggedPoint.x = event.clientX;
  draggedPoint.y = event.clientY;

  draggedPoint.vx = 0;
  draggedPoint.vy = 0;

  needsRender = true;
});

canvas.addEventListener("mouseup", () => {
  draggedPoint = null;
});

canvas.addEventListener("mouseleave", () => {
  draggedPoint = null;
  hoveredPoint = null;
  needsRender = true;
});

canvas.addEventListener("contextmenu", event => {
  event.preventDefault();

  const point = findPointAt(event.clientX, event.clientY);

  if (point) {
    removePoint(point);
  }
});

collapseBtn.addEventListener("click", () => {
  panel.classList.toggle("collapsed");

  collapseBtn.textContent = panel.classList.contains("collapsed")
    ? "+"
    : "−";
});

pointAmountInput.addEventListener("input", () => {
  updatePointCount();
  updateLabels();
});

resolutionInput.addEventListener("input", () => {
  resizeOffscreen();
  updateLabels();
  needsRender = true;
});

edgeWidthInput.addEventListener("input", () => {
  updateLabels();
  needsRender = true;
});

glowInput.addEventListener("input", () => {
  updateLabels();
  needsRender = true;
});

animationSpeedInput.addEventListener("input", updateLabels);

paletteInput.addEventListener("change", () => {
  hueShift = 0;
  needsRender = true;
});

[
  animateToggle,
  edgesToggle,
  pointsToggle,
  delaunayToggle
].forEach(input => {
  input.addEventListener("change", () => {
    updateStats();
    needsRender = true;
  });
});

randomBtn.addEventListener("click", () => {
  createRandomPoints(Number(pointAmountInput.value));
});

addBtn.addEventListener("click", () => {
  addRandomPoint();

  pointAmountInput.value = Math.min(
    Number(pointAmountInput.max),
    points.length
  );

  updateLabels();
  needsRender = true;
});

relaxBtn.addEventListener("click", relaxPoints);
burstBtn.addEventListener("click", colorBurst);
resetBtn.addEventListener("click", resetGenerator);
saveBtn.addEventListener("click", saveImage);

window.addEventListener("resize", resizeCanvas);

function hslToRgb(h, s, l) {
  const saturation = s / 100;
  const lightness = l / 100;

  const c =
    (1 - Math.abs(2 * lightness - 1)) * saturation;

  const x =
    c * (1 - Math.abs(((h / 60) % 2) - 1));

  const m = lightness - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (h < 60) {
    r = c;
    g = x;
  } else if (h < 120) {
    r = x;
    g = c;
  } else if (h < 180) {
    g = c;
    b = x;
  } else if (h < 240) {
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }

  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255)
  ];
}

function mix(start, end, amount) {
  return start + (end - start) * amount;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

resizeCanvas();
createRandomPoints();
updateLabels();
requestAnimationFrame(animate);