const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const freqXInput = document.getElementById("freqX");
const freqYInput = document.getElementById("freqY");
const phaseInput = document.getElementById("phase");
const pointsInput = document.getElementById("points");
const speedInput = document.getElementById("speed");
const glowInput = document.getElementById("glow");

const freqXValue = document.getElementById("freqXValue");
const freqYValue = document.getElementById("freqYValue");
const phaseValue = document.getElementById("phaseValue");
const pointsValue = document.getElementById("pointsValue");
const speedValue = document.getElementById("speedValue");
const glowValue = document.getElementById("glowValue");

const presetBtn = document.getElementById("presetBtn");
const colorBtn = document.getElementById("colorBtn");
const randomBtn = document.getElementById("randomBtn");
const clearBtn = document.getElementById("clearBtn");
const saveBtn = document.getElementById("saveBtn");

let width;
let height;
let centerX;
let centerY;
let time = 0;
let colorMode = 0;
let presetIndex = 0;

const mouse = {
  x: 0,
  y: 0,
  active: false
};

const palettes = [
  ["#38bdf8", "#818cf8", "#c084fc", "#f0abfc"],
  ["#fb7185", "#f97316", "#facc15", "#ffffff"],
  ["#34d399", "#22d3ee", "#60a5fa", "#a78bfa"],
  ["#f472b6", "#fb7185", "#c084fc", "#818cf8"],
  ["#fef08a", "#86efac", "#67e8f9", "#ffffff"]
];

const presets = [
  { x: 3, y: 2, phase: 157, name: "Classic" },
  { x: 5, y: 4, phase: 120, name: "Orbit" },
  { x: 7, y: 3, phase: 90, name: "Flower" },
  { x: 9, y: 8, phase: 180, name: "Infinity" },
  { x: 11, y: 6, phase: 230, name: "Chaos" }
];

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;

  centerX = width / 2;
  centerY = height / 2;
}

function updateLabels() {
  const phase = Number(phaseInput.value) / 100;
  const speed = Number(speedInput.value) / 1000;

  freqXValue.textContent = freqXInput.value;
  freqYValue.textContent = freqYInput.value;
  phaseValue.textContent = phase.toFixed(2);
  pointsValue.textContent = pointsInput.value;
  speedValue.textContent = speed.toFixed(3);
  glowValue.textContent = glowInput.value;
}

function drawBackground() {
  ctx.fillStyle = "rgba(2, 6, 23, 0.16)";
  ctx.fillRect(0, 0, width, height);

  const gradient = ctx.createRadialGradient(
    centerX,
    centerY,
    40,
    centerX,
    centerY,
    Math.max(width, height) * 0.7
  );

  gradient.addColorStop(0, "rgba(56, 189, 248, 0.08)");
  gradient.addColorStop(0.45, "rgba(129, 140, 248, 0.035)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function getPoint(t, amplitudeX, amplitudeY, freqX, freqY, phase) {
  let x = Math.sin(freqX * t + phase + time) * amplitudeX;
  let y = Math.sin(freqY * t + time * 0.85) * amplitudeY;

  if (mouse.active) {
    const mouseDx = (mouse.x - centerX) / width;
    const mouseDy = (mouse.y - centerY) / height;

    x += Math.sin(t * 8 + time) * mouseDx * 90;
    y += Math.cos(t * 7 + time) * mouseDy * 90;
  }

  return {
    x: centerX + x,
    y: centerY + y
  };
}

function drawCurve() {
  const freqX = Number(freqXInput.value);
  const freqY = Number(freqYInput.value);
  const phase = Number(phaseInput.value) / 100;
  const points = Number(pointsInput.value);
  const glow = Number(glowInput.value);
  const speed = Number(speedInput.value) / 1000;

  const amplitudeX = Math.min(width, height) * 0.34;
  const amplitudeY = Math.min(width, height) * 0.34;

  const palette = palettes[colorMode];

  ctx.save();
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.shadowBlur = glow;

  for (let layer = 0; layer < 3; layer++) {
    ctx.beginPath();

    for (let i = 0; i <= points; i++) {
      const progress = i / points;
      const t = progress * Math.PI * 2;

      const point = getPoint(
        t + layer * 0.02,
        amplitudeX - layer * 18,
        amplitudeY - layer * 18,
        freqX,
        freqY,
        phase + layer * 0.15
      );

      if (i === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    }

    const color = palette[layer % palette.length];

    ctx.strokeStyle = color;
    ctx.shadowColor = color;
    ctx.globalAlpha = 0.9 - layer * 0.22;
    ctx.lineWidth = 2.8 - layer * 0.6;

    ctx.stroke();
  }

  ctx.restore();

  drawParticles(points, amplitudeX, amplitudeY, freqX, freqY, phase, palette);

  time += speed;
}

function drawParticles(points, amplitudeX, amplitudeY, freqX, freqY, phase, palette) {
  const particleCount = 80;

  for (let i = 0; i < particleCount; i++) {
    const progress = i / particleCount;
    const t = progress * Math.PI * 2 + time * 1.5;

    const point = getPoint(
      t,
      amplitudeX,
      amplitudeY,
      freqX,
      freqY,
      phase
    );

    const color = palette[i % palette.length];

    ctx.save();
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = Number(glowInput.value);
    ctx.globalAlpha = 0.45 + Math.sin(time * 4 + i) * 0.25;

    ctx.beginPath();
    ctx.arc(point.x, point.y, 2.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

function animate() {
  drawBackground();
  drawCurve();
  updateLabels();

  requestAnimationFrame(animate);
}

function applyPreset() {
  const preset = presets[presetIndex];

  freqXInput.value = preset.x;
  freqYInput.value = preset.y;
  phaseInput.value = preset.phase;

  presetIndex = (presetIndex + 1) % presets.length;

  updateLabels();
}

function randomize() {
  freqXInput.value = Math.floor(Math.random() * 12) + 1;
  freqYInput.value = Math.floor(Math.random() * 12) + 1;
  phaseInput.value = Math.floor(Math.random() * 628);
  pointsInput.value = Math.floor(Math.random() * 2500) + 800;
  speedInput.value = Math.floor(Math.random() * 35) + 5;
  glowInput.value = Math.floor(Math.random() * 30) + 8;
  colorMode = Math.floor(Math.random() * palettes.length);

  updateLabels();
}

function clearCanvas() {
  ctx.clearRect(0, 0, width, height);
}

function saveImage() {
  const link = document.createElement("a");
  link.download = "lissajous-curves.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
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

presetBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  applyPreset();
});

colorBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  colorMode = (colorMode + 1) % palettes.length;
});

randomBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  randomize();
});

clearBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  clearCanvas();
});

saveBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  saveImage();
});

[
  freqXInput,
  freqYInput,
  phaseInput,
  pointsInput,
  speedInput,
  glowInput
].forEach(input => {
  input.addEventListener("input", updateLabels);
});

resizeCanvas();
clearCanvas();
animate();