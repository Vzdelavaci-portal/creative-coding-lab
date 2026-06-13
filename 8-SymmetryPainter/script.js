const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const symmetryInput = document.getElementById("symmetry");
const brushInput = document.getElementById("brushSize");
const glowInput = document.getElementById("glow");
const brushTypeInput = document.getElementById("brushType");
const drawModeInput = document.getElementById("drawMode");
const colorPicker = document.getElementById("colorPicker");

const symmetryValue = document.getElementById("symmetryValue");
const brushValue = document.getElementById("brushValue");
const glowValue = document.getElementById("glowValue");

const randomBtn = document.getElementById("randomBtn");
const autoBtn = document.getElementById("autoBtn");
const clearBtn = document.getElementById("clearBtn");
const saveBtn = document.getElementById("saveBtn");

let width;
let height;
let centerX;
let centerY;

let isDrawing = false;
let lastX = 0;
let lastY = 0;

let hue = 190;
let autoMode = false;
let autoAngle = 0;
let autoRadius = 40;

const colors = [
  "#38bdf8",
  "#818cf8",
  "#c084fc",
  "#fb7185",
  "#f97316",
  "#facc15",
  "#34d399",
  "#22d3ee"
];

function resizeCanvas() {
  const previous = document.createElement("canvas");
  previous.width = canvas.width;
  previous.height = canvas.height;

  const previousCtx = previous.getContext("2d");
  previousCtx.drawImage(canvas, 0, 0);

  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;

  centerX = width / 2;
  centerY = height / 2;

  ctx.drawImage(previous, 0, 0);
  drawCenterGuide();
}

function updateLabels() {
  symmetryValue.textContent = symmetryInput.value;
  brushValue.textContent = brushInput.value;
  glowValue.textContent = glowInput.value;
}

function clearCanvas() {
  ctx.clearRect(0, 0, width, height);

  const gradient = ctx.createRadialGradient(
    centerX,
    centerY,
    50,
    centerX,
    centerY,
    Math.max(width, height) * 0.7
  );

  gradient.addColorStop(0, "rgba(56, 189, 248, 0.08)");
  gradient.addColorStop(0.4, "rgba(129, 140, 248, 0.035)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  drawCenterGuide();
}

function drawCenterGuide() {
  ctx.save();

  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

function getPointerPosition(event) {
  return {
    x: event.clientX,
    y: event.clientY
  };
}

function rotatePoint(x, y, angle) {
  const dx = x - centerX;
  const dy = y - centerY;

  return {
    x: centerX + dx * Math.cos(angle) - dy * Math.sin(angle),
    y: centerY + dx * Math.sin(angle) + dy * Math.cos(angle)
  };
}

function mirrorVertical(x, y) {
  return {
    x: centerX - (x - centerX),
    y
  };
}

function mirrorHorizontal(x, y) {
  return {
    x,
    y: centerY - (y - centerY)
  };
}

function getBrushColor(index = 0) {
  const brushType = brushTypeInput.value;

  if (brushType === "rainbow") {
    hue += 0.7;
    return `hsl(${(hue + index * 18) % 360}, 100%, 65%)`;
  }

  return colorPicker.value;
}

function drawStroke(x1, y1, x2, y2, index = 0) {
  const brushType = brushTypeInput.value;
  const brushSize = Number(brushInput.value);
  const glow = Number(glowInput.value);
  const color = getBrushColor(index);

  ctx.save();

  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = brushSize;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.shadowColor = color;
  ctx.shadowBlur = brushType === "normal" ? glow * 0.4 : glow;

  if (brushType === "particle") {
    drawParticleBrush(x2, y2, color, brushSize);
  } else if (brushType === "star") {
    drawStarBrush(x2, y2, color, brushSize);
  } else {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  ctx.restore();
}

function drawParticleBrush(x, y, color, size) {
  for (let i = 0; i < 8; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * size * 2.8;

    ctx.globalAlpha = Math.random() * 0.7 + 0.3;

    ctx.beginPath();
    ctx.arc(
      x + Math.cos(angle) * radius,
      y + Math.sin(angle) * radius,
      Math.random() * size * 0.45 + 1,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  ctx.globalAlpha = 1;
}

function drawStarBrush(x, y, color, size) {
  const spikes = 5;
  const outerRadius = size * 1.4;
  const innerRadius = size * 0.55;

  ctx.beginPath();

  for (let i = 0; i < spikes * 2; i++) {
    const angle = (Math.PI / spikes) * i - Math.PI / 2;
    const radius = i % 2 === 0 ? outerRadius : innerRadius;

    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;

    if (i === 0) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  }

  ctx.closePath();
  ctx.fill();
}

function drawSymmetryLine(x1, y1, x2, y2) {
  const symmetry = Number(symmetryInput.value);
  const mode = drawModeInput.value;

  if (mode === "symmetry") {
    for (let i = 0; i < symmetry; i++) {
      const angle = (Math.PI * 2 / symmetry) * i;

      const start = rotatePoint(x1, y1, angle);
      const end = rotatePoint(x2, y2, angle);

      drawStroke(start.x, start.y, end.x, end.y, i);
    }
  }

  if (mode === "mirror") {
    const points = [
      { sx: x1, sy: y1, ex: x2, ey: y2 },
      { ...lineFromPoints(mirrorVertical(x1, y1), mirrorVertical(x2, y2)) },
      { ...lineFromPoints(mirrorHorizontal(x1, y1), mirrorHorizontal(x2, y2)) },
      { ...lineFromPoints(
        mirrorHorizontal(mirrorVertical(x1, y1).x, mirrorVertical(x1, y1).y),
        mirrorHorizontal(mirrorVertical(x2, y2).x, mirrorVertical(x2, y2).y)
      ) }
    ];

    points.forEach((line, index) => {
      drawStroke(line.sx, line.sy, line.ex, line.ey, index);
    });
  }

  if (mode === "kaleidoscope") {
    for (let i = 0; i < symmetry; i++) {
      const angle = (Math.PI * 2 / symmetry) * i;

      const start = rotatePoint(x1, y1, angle);
      const end = rotatePoint(x2, y2, angle);

      drawStroke(start.x, start.y, end.x, end.y, i);

      const mirroredStart = mirrorVertical(start.x, start.y);
      const mirroredEnd = mirrorVertical(end.x, end.y);

      drawStroke(
        mirroredStart.x,
        mirroredStart.y,
        mirroredEnd.x,
        mirroredEnd.y,
        i + symmetry
      );
    }
  }
}

function lineFromPoints(start, end) {
  return {
    sx: start.x,
    sy: start.y,
    ex: end.x,
    ey: end.y
  };
}

function startDrawing(event) {
  isDrawing = true;

  const position = getPointerPosition(event);

  lastX = position.x;
  lastY = position.y;
}

function draw(event) {
  if (!isDrawing) return;

  const position = getPointerPosition(event);

  drawSymmetryLine(lastX, lastY, position.x, position.y);

  lastX = position.x;
  lastY = position.y;
}

function stopDrawing() {
  isDrawing = false;
}

function randomizeSettings() {
  const randomSymmetry = [4, 6, 8, 12, 16, 24, 32];

  symmetryInput.value = randomSymmetry[Math.floor(Math.random() * randomSymmetry.length)];
  brushInput.value = Math.floor(Math.random() * 18) + 3;
  glowInput.value = Math.floor(Math.random() * 35) + 8;

  const brushTypes = ["normal", "glow", "rainbow", "particle", "star"];
  const modes = ["symmetry", "mirror", "kaleidoscope"];

  brushTypeInput.value = brushTypes[Math.floor(Math.random() * brushTypes.length)];
  drawModeInput.value = modes[Math.floor(Math.random() * modes.length)];

  colorPicker.value = colors[Math.floor(Math.random() * colors.length)];

  updateLabels();
}

function toggleAutoArtist() {
  autoMode = !autoMode;
  autoBtn.classList.toggle("active", autoMode);
  autoBtn.textContent = autoMode ? "Stop Auto" : "Auto Artist";
}

function autoArtist() {
  if (!autoMode) return;

  const radiusWave = Math.sin(autoAngle * 0.9) * 90;
  const radius = autoRadius + radiusWave + 130;

  const x1 = centerX + Math.cos(autoAngle) * radius;
  const y1 = centerY + Math.sin(autoAngle * 1.3) * radius;

  const x2 = centerX + Math.cos(autoAngle + 0.08) * (radius + 30);
  const y2 = centerY + Math.sin((autoAngle + 0.08) * 1.3) * (radius + 30);

  drawSymmetryLine(x1, y1, x2, y2);

  autoAngle += 0.035;
}

function animate() {
  autoArtist();
  requestAnimationFrame(animate);
}

function saveImage() {
  const link = document.createElement("a");
  link.download = "symmetry-painter-art.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseleave", stopDrawing);

canvas.addEventListener("touchstart", (event) => {
  event.preventDefault();

  const touch = event.touches[0];

  startDrawing({
    clientX: touch.clientX,
    clientY: touch.clientY
  });
});

canvas.addEventListener("touchmove", (event) => {
  event.preventDefault();

  const touch = event.touches[0];

  draw({
    clientX: touch.clientX,
    clientY: touch.clientY
  });
});

canvas.addEventListener("touchend", stopDrawing);

symmetryInput.addEventListener("input", updateLabels);
brushInput.addEventListener("input", updateLabels);
glowInput.addEventListener("input", updateLabels);

randomBtn.addEventListener("click", randomizeSettings);
autoBtn.addEventListener("click", toggleAutoArtist);
clearBtn.addEventListener("click", clearCanvas);
saveBtn.addEventListener("click", saveImage);

window.addEventListener("resize", resizeCanvas);

resizeCanvas();
updateLabels();
clearCanvas();
animate();