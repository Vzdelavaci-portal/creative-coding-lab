const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const depthInput = document.getElementById("depth");
const lengthInput = document.getElementById("length");
const scaleInput = document.getElementById("scale");

const depthValue = document.getElementById("depthValue");
const lengthValue = document.getElementById("lengthValue");
const scaleValue = document.getElementById("scaleValue");

const randomBtn = document.getElementById("randomBtn");
const resetBtn = document.getElementById("resetBtn");

let width;
let height;

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

let colorMode = 0;

const palettes = [
  ["#38bdf8", "#22c55e", "#facc15"],
  ["#f472b6", "#a78bfa", "#38bdf8"],
  ["#fb7185", "#f97316", "#facc15"],
  ["#34d399", "#2dd4bf", "#60a5fa"]
];

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  draw();
}

function getMouseAngle() {
  const minAngle = 12;
  const maxAngle = 55;
  return minAngle + (mouseX / width) * (maxAngle - minAngle);
}

function getWind() {
  return (mouseY / height - 0.5) * 18;
}

function drawBranch(x, y, length, angle, depth, maxDepth) {
  if (depth === 0) return;

  const rad = angle * Math.PI / 180;
  const x2 = x + Math.cos(rad) * length;
  const y2 = y + Math.sin(rad) * length;

  const progress = depth / maxDepth;
  const lineWidth = Math.max(1, progress * 12);

  const palette = palettes[colorMode];
  const colorIndex = Math.floor((1 - progress) * (palette.length - 1));

  ctx.strokeStyle = palette[colorIndex];
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";

  ctx.shadowColor = palette[colorIndex];
  ctx.shadowBlur = depth > 4 ? 12 : 4;

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  const branchAngle = getMouseAngle();
  const wind = getWind();
  const scale = Number(scaleInput.value) / 100;

  drawBranch(
    x2,
    y2,
    length * scale,
    angle - branchAngle + wind,
    depth - 1,
    maxDepth
  );

  drawBranch(
    x2,
    y2,
    length * scale,
    angle + branchAngle + wind,
    depth - 1,
    maxDepth
  );

  if (depth < 5) {
    drawLeaf(x2, y2, depth);
  }
}

function drawLeaf(x, y, depth) {
  const palette = palettes[colorMode];

  ctx.fillStyle = palette[2];
  ctx.shadowColor = palette[2];
  ctx.shadowBlur = 15;

  ctx.beginPath();
  ctx.arc(x, y, 2 + depth * 0.6, 0, Math.PI * 2);
  ctx.fill();
}

function drawBackground() {
  ctx.clearRect(0, 0, width, height);

  const gradient = ctx.createRadialGradient(
    width / 2,
    height,
    100,
    width / 2,
    height,
    height
  );

  gradient.addColorStop(0, "rgba(56, 189, 248, 0.12)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function draw() {
  drawBackground();

  const depth = Number(depthInput.value);
  const length = Number(lengthInput.value);

  depthValue.textContent = depth;
  lengthValue.textContent = length;
  scaleValue.textContent = (Number(scaleInput.value) / 100).toFixed(2);

  ctx.save();
  drawBranch(width / 2, height - 40, length, -90, depth, depth);
  ctx.restore();
}

window.addEventListener("resize", resizeCanvas);

window.addEventListener("mousemove", (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
  draw();
});

window.addEventListener("click", () => {
  colorMode = (colorMode + 1) % palettes.length;
  draw();
});

depthInput.addEventListener("input", draw);
lengthInput.addEventListener("input", draw);
scaleInput.addEventListener("input", draw);

randomBtn.addEventListener("click", (event) => {
  event.stopPropagation();

  depthInput.value = Math.floor(Math.random() * 8) + 5;
  lengthInput.value = Math.floor(Math.random() * 120) + 90;
  scaleInput.value = Math.floor(Math.random() * 20) + 60;
  colorMode = Math.floor(Math.random() * palettes.length);

  draw();
});

resetBtn.addEventListener("click", (event) => {
  event.stopPropagation();

  depthInput.value = 10;
  lengthInput.value = 150;
  scaleInput.value = 72;
  colorMode = 0;
  mouseX = width / 2;
  mouseY = height / 2;

  draw();
});

resizeCanvas();