const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const starsInput = document.getElementById("stars");
const armsInput = document.getElementById("arms");
const sizeInput = document.getElementById("galaxySize");
const speedInput = document.getElementById("speed");
const glowInput = document.getElementById("glow");

const starsValue = document.getElementById("starsValue");
const armsValue = document.getElementById("armsValue");
const sizeValue = document.getElementById("sizeValue");
const speedValue = document.getElementById("speedValue");
const glowValue = document.getElementById("glowValue");

const colorBtn = document.getElementById("colorBtn");
const randomBtn = document.getElementById("randomBtn");
const resetBtn = document.getElementById("resetBtn");

let width;
let height;
let centerX;
let centerY;

let stars = [];
let colorMode = 0;

const mouse = {
  x: 0,
  y: 0,
  active: false
};

const palettes = [
  ["#ffffff", "#93c5fd", "#818cf8", "#c084fc"],
  ["#fff7ed", "#fdba74", "#fb7185", "#f472b6"],
  ["#ecfeff", "#67e8f9", "#38bdf8", "#0ea5e9"],
  ["#fefce8", "#fde047", "#f97316", "#ef4444"],
  ["#f0fdf4", "#86efac", "#34d399", "#22d3ee"]
];

class Star {
  constructor(index) {
    this.index = index;
    this.create();
  }

  create() {
    const arms = Number(armsInput.value);
    const armIndex = Math.floor(Math.random() * arms);
    const armAngle = (Math.PI * 2 / arms) * armIndex;

    const radiusRandom = Math.random();

    this.radius = Math.pow(radiusRandom, 1.7) * getMaxRadius();

    const twist = this.radius * 0.018;
    const spread = (Math.random() - 0.5) * 0.65;

    this.angle = armAngle + twist + spread;

    this.size = Math.random() * 1.6 + 0.4;
    this.alpha = Math.random() * 0.6 + 0.35;

    this.speedOffset = Math.random() * 0.0008;

    const palette = palettes[colorMode];
    this.color = palette[this.index % palette.length];
  }

  update() {
    const baseSpeed = Number(speedInput.value) / 12000;
    const distanceFactor = 1 - this.radius / getMaxRadius();

    this.angle += (baseSpeed + this.speedOffset) * (0.4 + distanceFactor);
  }

  draw() {
    const glow = Number(glowInput.value);

    let finalRadius = this.radius;
    let finalAngle = this.angle;

    if (mouse.active) {
      const dx = mouse.x - centerX;
      const dy = mouse.y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const influence = Math.max(0, 1 - distance / 450);

      finalRadius += Math.sin(this.angle * 3 + distance * 0.01) * 18 * influence;
      finalAngle += Math.sin(distance * 0.01 + this.radius * 0.02) * 0.08 * influence;
    }

    const x = centerX + Math.cos(finalAngle) * finalRadius;
    const y = centerY + Math.sin(finalAngle) * finalRadius * 0.58;

    ctx.save();

    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = glow;

    ctx.beginPath();
    ctx.arc(x, y, this.size, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

function getMaxRadius() {
  return Math.min(width, height) * (Number(sizeInput.value) / 100);
}

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;

  centerX = width / 2;
  centerY = height / 2;

  createStars();
}

function createStars() {
  stars = [];

  const count = Number(starsInput.value);

  for (let i = 0; i < count; i++) {
    stars.push(new Star(i));
  }

  updateLabels();
}

function updateLabels() {
  starsValue.textContent = starsInput.value;
  armsValue.textContent = armsInput.value;
  sizeValue.textContent = (Number(sizeInput.value) / 100).toFixed(2);
  speedValue.textContent = (Number(speedInput.value) / 100).toFixed(2);
  glowValue.textContent = glowInput.value;
}

function drawBackground() {
  ctx.clearRect(0, 0, width, height);

  const background = ctx.createRadialGradient(
    centerX,
    centerY,
    10,
    centerX,
    centerY,
    Math.max(width, height) * 0.75
  );

  background.addColorStop(0, "rgba(129, 140, 248, 0.16)");
  background.addColorStop(0.35, "rgba(56, 189, 248, 0.05)");
  background.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);
}

function drawCore() {
  const palette = palettes[colorMode];

  const core = ctx.createRadialGradient(
    centerX,
    centerY,
    0,
    centerX,
    centerY,
    50
  );

  core.addColorStop(0, "rgba(255, 255, 255, 0.95)");
  core.addColorStop(0.25, palette[1]);
  core.addColorStop(0.6, palette[2]);
  core.addColorStop(1, "rgba(255, 255, 255, 0)");

  ctx.save();

  ctx.fillStyle = core;
  ctx.shadowColor = palette[1];
  ctx.shadowBlur = Number(glowInput.value);

  ctx.beginPath();
  ctx.arc(centerX, centerY, 50, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function animate() {
  drawBackground();

  for (const star of stars) {
    star.update();
    star.draw();
  }

  drawCore();
  updateLabels();

  requestAnimationFrame(animate);
}

window.addEventListener("resize", resizeCanvas);

window.addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
  mouse.active = true;
});

window.addEventListener("mouseleave", () => {
  mouse.active = false;
});

window.addEventListener("click", () => {
  colorMode = (colorMode + 1) % palettes.length;
  createStars();
});

starsInput.addEventListener("input", createStars);
armsInput.addEventListener("input", createStars);
sizeInput.addEventListener("input", createStars);
speedInput.addEventListener("input", updateLabels);
glowInput.addEventListener("input", updateLabels);

colorBtn.addEventListener("click", (event) => {
  event.stopPropagation();

  colorMode = (colorMode + 1) % palettes.length;
  createStars();
});

randomBtn.addEventListener("click", (event) => {
  event.stopPropagation();

  starsInput.value = Math.floor(Math.random() * 4000) + 1000;
  armsInput.value = Math.floor(Math.random() * 7) + 2;
  sizeInput.value = Math.floor(Math.random() * 18) + 30;
  speedInput.value = Math.floor(Math.random() * 70) + 5;
  glowInput.value = Math.floor(Math.random() * 25) + 5;

  colorMode = Math.floor(Math.random() * palettes.length);

  createStars();
});

resetBtn.addEventListener("click", (event) => {
  event.stopPropagation();

  starsInput.value = 2200;
  armsInput.value = 4;
  sizeInput.value = 42;
  speedInput.value = 20;
  glowInput.value = 12;
  colorMode = 0;

  createStars();
});

resizeCanvas();
animate();