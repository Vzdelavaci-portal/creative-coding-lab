const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const particlesInput = document.getElementById("particles");
const gravityInput = document.getElementById("gravity");
const diskInput = document.getElementById("diskSize");
const speedInput = document.getElementById("speed");
const glowInput = document.getElementById("glow");

const particlesValue = document.getElementById("particlesValue");
const gravityValue = document.getElementById("gravityValue");
const diskValue = document.getElementById("diskValue");
const speedValue = document.getElementById("speedValue");
const glowValue = document.getElementById("glowValue");

const colorBtn = document.getElementById("colorBtn");
const randomBtn = document.getElementById("randomBtn");
const scanBtn = document.getElementById("scanBtn");
const clearSingularitiesBtn = document.getElementById("clearSingularitiesBtn");
const resetBtn = document.getElementById("resetBtn");

let width;
let height;
let centerX;
let centerY;
let particles = [];
let singularities = [];
let scanWaves = [];
let colorMode = 0;
let time = 0;

const mouse = {
  x: 0,
  y: 0,
  active: false
};

const palettes = [
  ["#fff7ed", "#fdba74", "#f97316", "#fb7185"],
  ["#ecfeff", "#67e8f9", "#38bdf8", "#818cf8"],
  ["#fdf4ff", "#f0abfc", "#c084fc", "#818cf8"],
  ["#fefce8", "#fde047", "#f97316", "#ef4444"],
  ["#f0fdf4", "#86efac", "#34d399", "#22d3ee"]
];

class Particle {
  constructor(index, x = null, y = null) {
    this.index = index;
    this.color = palettes[colorMode][index % palettes[colorMode].length];

    if (x !== null && y !== null) {
      this.createBurst(x, y);
    } else {
      this.reset(true);
    }
  }

  reset(randomStart = false) {
    const maxRadius = getDiskRadius();
    const minRadius = getEventHorizonRadius() + 22;

    this.radius = minRadius + Math.random() * (maxRadius - minRadius);
    this.angle = Math.random() * Math.PI * 2;

    if (!randomStart) {
      this.radius = maxRadius * (0.82 + Math.random() * 0.22);
    }

    this.size = Math.random() * 1.8 + 0.45;
    this.alpha = Math.random() * 0.55 + 0.35;
    this.orbitSpeed = Math.random() * 0.012 + 0.004;
    this.fallSpeed = Math.random() * 0.22 + 0.04;
    this.freeX = null;
    this.freeY = null;
    this.vx = 0;
    this.vy = 0;
  }

  createBurst(x, y) {
    this.freeX = x;
    this.freeY = y;

    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 5 + 2;

    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.size = Math.random() * 2.3 + 0.7;
    this.alpha = Math.random() * 0.5 + 0.5;
    this.orbitSpeed = Math.random() * 0.016 + 0.006;
    this.fallSpeed = Math.random() * 0.25 + 0.06;

    this.syncPolarFromFree();
  }

  syncPolarFromFree() {
    const dx = this.freeX - centerX;
    const dy = (this.freeY - centerY) / 0.46;

    this.radius = Math.sqrt(dx * dx + dy * dy);
    this.angle = Math.atan2(dy, dx);
  }

  syncFreeFromPolar() {
    this.freeX = centerX + Math.cos(this.angle) * this.radius;
    this.freeY = centerY + Math.sin(this.angle) * this.radius * 0.46;
  }

  update() {
    const gravity = Number(gravityInput.value) / 100;
    const speed = Number(speedInput.value) / 100;
    const horizon = getEventHorizonRadius();
    const diskRadius = getDiskRadius();

    if (this.freeX !== null && this.freeY !== null) {
      this.freeX += this.vx;
      this.freeY += this.vy;
      this.vx *= 0.97;
      this.vy *= 0.97;
      this.syncPolarFromFree();

      if (Math.abs(this.vx) < 0.08 && Math.abs(this.vy) < 0.08) {
        this.freeX = null;
        this.freeY = null;
      }
    }

    const distanceFactor = Math.max(0.15, 1 - this.radius / diskRadius);
    this.angle += this.orbitSpeed * speed * (1 + gravity * 1.8) * (0.4 + distanceFactor * 2);
    this.radius -= this.fallSpeed * gravity * speed * (0.3 + distanceFactor);

    this.applySingularityForces();

    if (this.radius < horizon + 3 || this.radius > diskRadius * 1.35) {
      this.reset(false);
    }
  }

  applySingularityForces() {
    if (singularities.length === 0) return;

    let pos = this.getPosition();

    for (const singularity of singularities) {
      const dx = singularity.x - pos.x;
      const dy = singularity.y - pos.y;
      const distance = Math.sqrt(dx * dx + dy * dy) || 1;

      if (distance < singularity.radius) {
        const force = (1 - distance / singularity.radius) * singularity.strength;
        const angle = Math.atan2(dy, dx);

        pos.x += Math.cos(angle) * force;
        pos.y += Math.sin(angle) * force;
      }
    }

    const dx = pos.x - centerX;
    const dy = (pos.y - centerY) / 0.46;

    this.radius = Math.sqrt(dx * dx + dy * dy);
    this.angle = Math.atan2(dy, dx);
  }

  getPosition() {
    let finalRadius = this.radius;
    let finalAngle = this.angle + time * 0.15;

    if (mouse.active) {
      const dx = mouse.x - centerX;
      const dy = mouse.y - centerY;
      const mouseDistance = Math.sqrt(dx * dx + dy * dy);
      const influence = Math.max(0, 1 - mouseDistance / 520);

      finalAngle += Math.sin(this.angle * 2 + mouseDistance * 0.01) * 0.22 * influence;
      finalRadius += Math.cos(this.angle * 3 + mouseDistance * 0.008) * 20 * influence;
    }

    return {
      x: centerX + Math.cos(finalAngle) * finalRadius,
      y: centerY + Math.sin(finalAngle) * finalRadius * 0.46
    };
  }

  draw() {
    const pos = this.getPosition();
    const glow = Number(glowInput.value);

    ctx.save();

    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = glow;

    for (const wave of scanWaves) {
      const dx = pos.x - centerX;
      const dy = pos.y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (Math.abs(distance - wave.radius) < 22) {
        ctx.globalAlpha = 1;
        ctx.shadowBlur = glow * 2.5;
      }
    }

    ctx.beginPath();
    ctx.arc(pos.x, pos.y, this.size, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

class Singularity {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 230;
    this.strength = 3.5;
    this.life = 1;
    this.pulse = Math.random() * Math.PI * 2;
  }

  update() {
    this.life -= 0.0012;
    this.pulse += 0.06;
  }

  draw() {
    const palette = palettes[colorMode];
    const alpha = Math.max(0, this.life);
    const core = 5 + Math.sin(this.pulse) * 1.5;

    ctx.save();
    ctx.globalAlpha = alpha;

    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
    gradient.addColorStop(0, hexToRgba(palette[2], 0.45));
    gradient.addColorStop(0.18, hexToRgba(palette[1], 0.14));
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "black";
    ctx.shadowColor = palette[2];
    ctx.shadowBlur = 28;
    ctx.beginPath();
    ctx.arc(this.x, this.y, core + 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = palette[1];
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(this.x, this.y, core + 13, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }
}

class ScanWave {
  constructor() {
    this.radius = getEventHorizonRadius();
    this.alpha = 1;
  }

  update() {
    this.radius += 7.5;
    this.alpha -= 0.012;
  }

  draw() {
    const palette = palettes[colorMode];

    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.strokeStyle = palette[1];
    ctx.lineWidth = 2;
    ctx.shadowColor = palette[1];
    ctx.shadowBlur = 25;
    ctx.beginPath();
    ctx.arc(centerX, centerY, this.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

function getDiskRadius() {
  return Math.min(width, height) * (Number(diskInput.value) / 100);
}

function getEventHorizonRadius() {
  return Math.min(width, height) * 0.065;
}

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  centerX = width / 2;
  centerY = height / 2;
  createParticles();
}

function createParticles() {
  particles = [];
  const count = Number(particlesInput.value);

  for (let i = 0; i < count; i++) {
    particles.push(new Particle(i));
  }

  updateLabels();
}

function createMatterBurst(x, y) {
  const amount = 180;

  for (let i = 0; i < amount; i++) {
    particles.push(new Particle(particles.length + i, x, y));
  }

  const maxParticles = Number(particlesInput.value) + 900;

  if (particles.length > maxParticles) {
    particles.splice(0, particles.length - maxParticles);
  }
}

function updateLabels() {
  particlesValue.textContent = particlesInput.value;
  gravityValue.textContent = (Number(gravityInput.value) / 100).toFixed(2);
  diskValue.textContent = (Number(diskInput.value) / 100).toFixed(2);
  speedValue.textContent = (Number(speedInput.value) / 100).toFixed(2);
  glowValue.textContent = glowInput.value;
}

function drawBackground() {
  ctx.clearRect(0, 0, width, height);

  const gradient = ctx.createRadialGradient(centerX, centerY, 20, centerX, centerY, Math.max(width, height) * 0.7);
  gradient.addColorStop(0, "rgba(249, 115, 22, 0.12)");
  gradient.addColorStop(0.35, "rgba(129, 140, 248, 0.045)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function drawStarsBackground() {
  ctx.save();
  ctx.fillStyle = "rgba(255, 255, 255, 0.45)";

  for (let i = 0; i < 130; i++) {
    const x = (Math.sin(i * 129.91) * 0.5 + 0.5) * width;
    const y = (Math.sin(i * 311.77) * 0.5 + 0.5) * height;
    const size = (Math.sin(i * 47.13) * 0.5 + 0.5) * 1.4;

    ctx.globalAlpha = 0.12 + (Math.sin(i + time) * 0.5 + 0.5) * 0.32;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawAccretionDisk() {
  const palette = palettes[colorMode];
  const diskRadius = getDiskRadius();
  const horizon = getEventHorizonRadius();

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.scale(1, 0.46);

  for (let i = 0; i < 4; i++) {
    const radius = horizon + 35 + i * (diskRadius - horizon) / 4;
    const ring = ctx.createRadialGradient(0, 0, horizon, 0, 0, radius);

    ring.addColorStop(0, "rgba(255, 255, 255, 0)");
    ring.addColorStop(0.45, hexToRgba(palette[i % palette.length], 0.08));
    ring.addColorStop(0.75, hexToRgba(palette[(i + 1) % palette.length], 0.035));
    ring.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.fillStyle = ring;
    ctx.shadowColor = palette[i % palette.length];
    ctx.shadowBlur = Number(glowInput.value) * 1.5;

    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawBlackHole() {
  const pulse = Math.sin(time * 4) * 2;
  const horizon = getEventHorizonRadius() + pulse;
  const palette = palettes[colorMode];

  ctx.save();

  const glow = ctx.createRadialGradient(centerX, centerY, horizon * 0.8, centerX, centerY, horizon * 3.2);
  glow.addColorStop(0, "rgba(0, 0, 0, 1)");
  glow.addColorStop(0.42, "rgba(0, 0, 0, 1)");
  glow.addColorStop(0.55, hexToRgba(palette[2], 0.8));
  glow.addColorStop(0.75, hexToRgba(palette[1], 0.18));
  glow.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = glow;
  ctx.shadowColor = palette[2];
  ctx.shadowBlur = Number(glowInput.value) * 2;
  ctx.beginPath();
  ctx.arc(centerX, centerY, horizon * 3.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "black";
  ctx.shadowColor = "black";
  ctx.shadowBlur = 25;
  ctx.beginPath();
  ctx.arc(centerX, centerY, horizon, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function updateSingularities() {
  singularities = singularities.filter(singularity => singularity.life > 0);

  for (const singularity of singularities) {
    singularity.update();
    singularity.draw();
  }
}

function updateScanWaves() {
  scanWaves = scanWaves.filter(wave => wave.alpha > 0);

  for (const wave of scanWaves) {
    wave.update();
    wave.draw();
  }
}

function hexToRgba(hex, alpha) {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function animate() {
  drawBackground();
  drawStarsBackground();
  drawAccretionDisk();
  updateSingularities();

  for (const particle of particles) {
    particle.update();
    particle.draw();
  }

  updateScanWaves();
  drawBlackHole();
  updateLabels();

  time += 0.01;
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

canvas.addEventListener("click", (event) => {
  if (event.shiftKey) {
    singularities.push(new Singularity(event.clientX, event.clientY));
    return;
  }

  createMatterBurst(event.clientX, event.clientY);
});

particlesInput.addEventListener("input", createParticles);
diskInput.addEventListener("input", createParticles);
gravityInput.addEventListener("input", updateLabels);
speedInput.addEventListener("input", updateLabels);
glowInput.addEventListener("input", updateLabels);

colorBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  colorMode = (colorMode + 1) % palettes.length;
  createParticles();
});

randomBtn.addEventListener("click", (event) => {
  event.stopPropagation();

  particlesInput.value = Math.floor(Math.random() * 3500) + 1000;
  gravityInput.value = Math.floor(Math.random() * 100) + 40;
  diskInput.value = Math.floor(Math.random() * 25) + 28;
  speedInput.value = Math.floor(Math.random() * 150) + 50;
  glowInput.value = Math.floor(Math.random() * 28) + 8;
  colorMode = Math.floor(Math.random() * palettes.length);

  createParticles();
});

scanBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  scanWaves.push(new ScanWave());
});

clearSingularitiesBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  singularities = [];
});

resetBtn.addEventListener("click", (event) => {
  event.stopPropagation();

  particlesInput.value = 1800;
  gravityInput.value = 75;
  diskInput.value = 42;
  speedInput.value = 100;
  glowInput.value = 16;
  colorMode = 0;
  singularities = [];
  scanWaves = [];

  createParticles();
});

resizeCanvas();
animate();
