const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const symmetryInput = document.getElementById("symmetry");
const brushInput = document.getElementById("brushSize");
const glowInput = document.getElementById("glow");
const colorPicker = document.getElementById("colorPicker");

const symmetryValue = document.getElementById("symmetryValue");
const brushValue = document.getElementById("brushValue");
const glowValue = document.getElementById("glowValue");

const colorBtn = document.getElementById("colorBtn");
const clearBtn = document.getElementById("clearBtn");
const saveBtn = document.getElementById("saveBtn");

let width;
let height;
let centerX;
let centerY;

let isDrawing = false;
let lastX = 0;
let lastY = 0;

const colors = [
  "#38bdf8",
  "#818cf8",
  "#c084fc",
  "#fb7185",
  "#facc15",
  "#34d399",
  "#f97316",
  "#22d3ee"
];

function resizeCanvas() {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;

  centerX = width / 2;
  centerY = height / 2;

  ctx.putImageData(imageData, 0, 0);
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

function updateLabels() {
  symmetryValue.textContent = symmetryInput.value;
  brushValue.textContent = brushInput.value;
  glowValue.textContent = glowInput.value;
}

function getMousePosition(event) {
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

function mirrorPoint(x, y, angle) {
  const rotated = rotatePoint(x, y, angle);

  return {
    x: centerX - (rotated.x - centerX),
    y: rotated.y
  };
}

function drawLine(x1, y1, x2, y2) {
  const symmetry = Number(symmetryInput.value);
  const brushSize = Number(brushInput.value);
  const glow = Number(glowInput.value);
  const color = colorPicker.value;

  ctx.save();

  ctx.strokeStyle = color;
  ctx.lineWidth = brushSize;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.shadowColor = color;
  ctx.shadowBlur = glow;

  for (let i = 0; i < symmetry; i++) {
    const angle = (Math.PI * 2 / symmetry) * i;

    const start = rotatePoint(x1, y1, angle);
    const end = rotatePoint(x2, y2, angle);

    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();

    const mirrorStart = mirrorPoint(x1, y1, angle);
    const mirrorEnd = mirrorPoint(x2, y2, angle);

    ctx.beginPath();
    ctx.moveTo(mirrorStart.x, mirrorStart.y);
    ctx.lineTo(mirrorEnd.x, mirrorEnd.y);
    ctx.stroke();
  }

  ctx.restore();
}

function startDrawing(event) {
  isDrawing = true;

  const position = getMousePosition(event);
  lastX = position.x;
  lastY = position.y;
}

function draw(event) {
  if (!isDrawing) return;

  const position = getMousePosition(event);

  drawLine(lastX, lastY, position.x, position.y);

  lastX = position.x;
  lastY = position.y;
}

function stopDrawing() {
  isDrawing = false;
}

function clearCanvas() {
  ctx.clearRect(0, 0, width, height);
  drawCenterGuide();
}

function randomColor() {
  const randomIndex = Math.floor(Math.random() * colors.length);
  colorPicker.value = colors[randomIndex];
}

function saveImage() {
  const link = document.createElement("a");
  link.download = "mandala-painting.png";
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

colorBtn.addEventListener("click", randomColor);
clearBtn.addEventListener("click", clearCanvas);
saveBtn.addEventListener("click", saveImage);

window.addEventListener("resize", resizeCanvas);

resizeCanvas();
updateLabels();
clearCanvas();