const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const pointsInput = document.getElementById("points");
const densityInput = document.getElementById("density");
const speedInput = document.getElementById("speed");
const glowInput = document.getElementById("glow");

const pointsValue = document.getElementById("pointsValue");
const densityValue = document.getElementById("densityValue");
const speedValue = document.getElementById("speedValue");
const glowValue = document.getElementById("glowValue");

const colorBtn = document.getElementById("colorBtn");
const randomBtn = document.getElementById("randomBtn");
const resetBtn = document.getElementById("resetBtn");

let width;
let height;
let rotation = 0;
let colorMode = 0;

const mouse = {
  x: 0,
  y: 0,
  active: false
};

const palettes = [
  ["#38bdf8", "#818cf8", "#c084fc"],
  ["#fb7185", "#f472b6", "#f9a8d4"],
  ["#34d399", "#2dd4bf", "#60a5fa"],
  ["#f97316", "#facc15", "#fb7185"],
  ["#a78bfa", "#22d3ee", "#f0abfc"]
];

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

function drawBackground() {
  ctx.clearRect(0, 0, width, height);

  const gradient = ctx.createRadialGradient(
    width / 2,
    height / 2,
    100,
    width / 2,
    height / 2,
    Math.max(width, height)
  );

  gradient.addColorStop(0, "rgba(56, 189, 248, 0.12)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function drawSpiral() {
  const points = Number(pointsInput.value);
  const density = Number(densityInput.value) / 100;
  const speed = Number(speedInput.value) / 1000;
  const glow = Number(glowInput.value);

  pointsValue.textContent = points;
  densityValue.textContent = density.toFixed(2);
  speedValue.textContent = speed.toFixed(3);
  glowValue.textContent = glow;

  const centerX = width / 2;
  const centerY = height / 2;

  const maxRadius = Math.min(width, height) * 0.42;
  const palette = palettes[colorMode];

  for (let i = 0; i < points; i++) {
    const progress = i / points;

    const angle = i * density + rotation;
    let radius = progress * maxRadius;

    if (mouse.active) {
      const mouseDx = mouse.x - centerX;
      const mouseDy = mouse.y - centerY;
      const mouseAngle = Math.atan2(mouseDy, mouseDx);
      const mouseDistance = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);

      const wave = Math.sin(angle * 3 + mouseDistance * 0.01);
      radius += wave * 28 * progress;

      const anglePull = Math.sin(mouseAngle + progress * 10) * 0.35;
      radius += anglePull * 35;
    }

    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;

    const color = palette[i % palette.length];
    const size = 1 + progress * 3;

    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = glow;

    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  rotation += speed;
}

function animate() {
  drawBackground();
  drawSpiral();

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
});

colorBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  colorMode = (colorMode + 1) % palettes.length;
});

randomBtn.addEventListener("click", (event) => {
  event.stopPropagation();

  pointsInput.value = Math.floor(Math.random() * 1700) + 500;
  densityInput.value = Math.floor(Math.random() * 30) + 8;
  speedInput.value = Math.floor(Math.random() * 35) + 3;
  glowInput.value = Math.floor(Math.random() * 28) + 6;
  colorMode = Math.floor(Math.random() * palettes.length);
});

resetBtn.addEventListener("click", (event) => {
  event.stopPropagation();

  pointsInput.value = 900;
  densityInput.value = 18;
  speedInput.value = 10;
  glowInput.value = 16;
  colorMode = 0;
});

resizeCanvas();
animate();