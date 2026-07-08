const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const pointsInput = document.getElementById("points");
const angleInput = document.getElementById("angle");
const spacingInput = document.getElementById("spacing");
const sizeInput = document.getElementById("dotSize");
const speedInput = document.getElementById("speed");
const glowInput = document.getElementById("glow");
const colorModeInput = document.getElementById("colorMode");

const pointsValue = document.getElementById("pointsValue");
const angleValue = document.getElementById("angleValue");
const spacingValue = document.getElementById("spacingValue");
const sizeValue = document.getElementById("sizeValue");
const speedValue = document.getElementById("speedValue");
const glowValue = document.getElementById("glowValue");

const goldenBtn = document.getElementById("goldenBtn");
const randomBtn = document.getElementById("randomBtn");
const pulseBtn = document.getElementById("pulseBtn");
const resetBtn = document.getElementById("resetBtn");
const saveBtn = document.getElementById("saveBtn");

let width;
let height;
let centerX;
let centerY;

let rotation = 0;
let time = 0;
let pulsePower = 0;

const mouse = {
  x: 0,
  y: 0,
  active: false
};

const palettes = {
  sunflower: ["#78350f", "#f97316", "#facc15", "#fde68a", "#22c55e"],
  galaxy: ["#38bdf8", "#818cf8", "#c084fc", "#f472b6", "#ffffff"],
  ocean: ["#0ea5e9", "#22d3ee", "#38bdf8", "#67e8f9", "#ecfeff"],
  fire: ["#7f1d1d", "#ef4444", "#f97316", "#facc15", "#fff7ed"],
  mono: ["#ffffff", "#cbd5e1", "#94a3b8", "#64748b"]
};

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;

  centerX = width / 2;
  centerY = height / 2;
}

function updateLabels() {
  const angle = Number(angleInput.value) / 10;
  const spacing = Number(spacingInput.value) / 10;
  const speed = Number(speedInput.value) / 100;

  pointsValue.textContent = pointsInput.value;
  angleValue.textContent = `${angle.toFixed(1)}°`;
  spacingValue.textContent = spacing.toFixed(1);
  sizeValue.textContent = sizeInput.value;
  speedValue.textContent = speed.toFixed(2);
  glowValue.textContent = glowInput.value;
}

function drawBackground() {
  ctx.clearRect(0, 0, width, height);

  const gradient = ctx.createRadialGradient(
    centerX,
    centerY,
    80,
    centerX,
    centerY,
    Math.max(width, height)
  );

  gradient.addColorStop(0, "rgba(250, 204, 21, 0.075)");
  gradient.addColorStop(0.42, "rgba(249, 115, 22, 0.035)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function getColor(index, progress) {
  const mode = colorModeInput.value;

  if (mode === "rainbow") {
    return `hsl(${(index * 0.75 + time * 45) % 360}, 100%, 65%)`;
  }

  const palette = palettes[mode] || palettes.sunflower;
  const paletteIndex = Math.floor(progress * (palette.length - 1));

  return palette[paletteIndex];
}

function drawPhyllotaxis() {
  const total = Number(pointsInput.value);
  const angleDeg = Number(angleInput.value) / 10;
  const angle = angleDeg * Math.PI / 180;
  const spacing = Number(spacingInput.value) / 10;
  const dotSize = Number(sizeInput.value);
  const glow = Number(glowInput.value);

  const maxRadius = Math.min(width, height) * 0.43;

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(rotation);

  for (let i = 0; i < total; i++) {
    const progress = i / total;

    let radius = spacing * Math.sqrt(i);
    const theta = i * angle;

    if (radius > maxRadius) {
      radius = maxRadius;
    }

    let x = Math.cos(theta) * radius;
    let y = Math.sin(theta) * radius;

    const breathing = Math.sin(time * 2 + progress * Math.PI * 6) * 4;
    const pulse = pulsePower * (1 - progress) * 50;

    x += Math.cos(theta) * (breathing + pulse);
    y += Math.sin(theta) * (breathing + pulse);

    if (mouse.active) {
      const worldX = centerX + x;
      const worldY = centerY + y;

      const dx = mouse.x - worldX;
      const dy = mouse.y - worldY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 180) {
        const force = (1 - distance / 180) * 26;
        const mouseAngle = Math.atan2(dy, dx);

        x -= Math.cos(mouseAngle) * force;
        y -= Math.sin(mouseAngle) * force;
      }
    }

    const color = getColor(i, progress);
    const size = dotSize * (0.55 + progress * 0.8);

    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = glow;

    ctx.globalAlpha = 0.35 + progress * 0.65;

    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
  ctx.globalAlpha = 1;
}

function drawCenterSeed() {
  const mode = colorModeInput.value;
  const color = mode === "rainbow" ? "#ffffff" : getColor(0, 0.2);

  ctx.save();

  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = Number(glowInput.value) * 1.5;

  ctx.beginPath();
  ctx.arc(centerX, centerY, Number(sizeInput.value) * 2.1, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function animate() {
  drawBackground();

  drawPhyllotaxis();
  drawCenterSeed();

  const speed = Number(speedInput.value) / 10000;
  rotation += speed;

  pulsePower *= 0.9;
  time += 0.016;

  updateLabels();

  requestAnimationFrame(animate);
}

function setGoldenAngle() {
  angleInput.value = 1375;
  updateLabels();
}

function randomize() {
  const modes = ["sunflower", "rainbow", "galaxy", "ocean", "fire", "mono"];

  pointsInput.value = Math.floor(Math.random() * 2400) + 600;
  angleInput.value = Math.floor(Math.random() * 650) + 1100;
  spacingInput.value = Math.floor(Math.random() * 75) + 35;
  sizeInput.value = Math.floor(Math.random() * 8) + 2;
  speedInput.value = Math.floor(Math.random() * 85) + 5;
  glowInput.value = Math.floor(Math.random() * 30) + 6;
  colorModeInput.value = modes[Math.floor(Math.random() * modes.length)];

  pulsePower = 1.2;
  updateLabels();
}

function reset() {
  pointsInput.value = 900;
  angleInput.value = 1375;
  spacingInput.value = 70;
  sizeInput.value = 4;
  speedInput.value = 20;
  glowInput.value = 14;
  colorModeInput.value = "sunflower";

  rotation = 0;
  pulsePower = 0;
  updateLabels();
}

function pulse() {
  pulsePower = 1.5;
}

function saveImage() {
  const link = document.createElement("a");
  link.download = "phyllotaxis-generator.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

window.addEventListener("resize", resizeCanvas);

window.addEventListener("mousemove", event => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
  mouse.active = true;
});

window.addEventListener("mouseleave", () => {
  mouse.active = false;
});

goldenBtn.addEventListener("click", setGoldenAngle);
randomBtn.addEventListener("click", randomize);
pulseBtn.addEventListener("click", pulse);
resetBtn.addEventListener("click", reset);
saveBtn.addEventListener("click", saveImage);

[
  pointsInput,
  angleInput,
  spacingInput,
  sizeInput,
  speedInput,
  glowInput
].forEach(input => {
  input.addEventListener("input", updateLabels);
});

colorModeInput.addEventListener("change", updateLabels);

resizeCanvas();
updateLabels();
animate();