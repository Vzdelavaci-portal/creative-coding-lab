const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const particleInput = document.getElementById("particleCount");
const forceInput = document.getElementById("force");

const particleValue = document.getElementById("particleValue");
const forceValue = document.getElementById("forceValue");

const colorBtn = document.getElementById("colorBtn");
const resetBtn = document.getElementById("resetBtn");

let width;
let height;
let particles = [];
let colorMode = 0;

const mouse = {
  x: null,
  y: null,
  radius: 120
};

const palettes = [
  ["#fb7185", "#f472b6", "#f9a8d4"],
  ["#38bdf8", "#818cf8", "#c084fc"],
  ["#f97316", "#facc15", "#fb7185"],
  ["#34d399", "#2dd4bf", "#60a5fa"]
];

class Particle {
  constructor(targetX, targetY, index) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;

    this.targetX = targetX;
    this.targetY = targetY;

    this.size = Math.random() * 2.5 + 1;
    this.speed = Math.random() * 0.04 + 0.035;
    this.friction = 0.86;

    this.vx = 0;
    this.vy = 0;

    this.color = palettes[colorMode][index % palettes[colorMode].length];
  }

  update() {
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < mouse.radius) {
      const angle = Math.atan2(dy, dx);
      const force = (mouse.radius - distance) / mouse.radius;
      const power = Number(forceInput.value) / 10;

      this.vx -= Math.cos(angle) * force * power;
      this.vy -= Math.sin(angle) * force * power;
    }

    const homeX = this.targetX - this.x;
    const homeY = this.targetY - this.y;

    this.vx += homeX * this.speed;
    this.vy += homeY * this.speed;

    this.vx *= this.friction;
    this.vy *= this.friction;

    this.x += this.vx;
    this.y += this.vy;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 12;

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function heartPoint(t, scale) {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y =
    13 * Math.cos(t) -
    5 * Math.cos(2 * t) -
    2 * Math.cos(3 * t) -
    Math.cos(4 * t);

  return {
    x: width / 2 + x * scale,
    y: height / 2 - y * scale
  };
}

function createParticles() {
  particles = [];

  const count = Number(particleInput.value);
  const scale = Math.min(width, height) / 38;

  for (let i = 0; i < count; i++) {
    const t = Math.random() * Math.PI * 2;
    const point = heartPoint(t, scale);

    const randomOffset = Math.random() * 18;

    particles.push(
      new Particle(
        point.x + (Math.random() - 0.5) * randomOffset,
        point.y + (Math.random() - 0.5) * randomOffset,
        i
      )
    );
  }

  particleValue.textContent = count;
}

function drawBackground() {
  ctx.clearRect(0, 0, width, height);

  const gradient = ctx.createRadialGradient(
    width / 2,
    height / 2,
    80,
    width / 2,
    height / 2,
    Math.max(width, height) / 1.2
  );

  gradient.addColorStop(0, "rgba(251, 113, 133, 0.15)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function animate() {
  drawBackground();

  forceValue.textContent = forceInput.value;

  for (const particle of particles) {
    particle.update();
    particle.draw();
  }

  requestAnimationFrame(animate);
}

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  createParticles();
}

window.addEventListener("resize", resizeCanvas);

window.addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

window.addEventListener("mouseleave", () => {
  mouse.x = null;
  mouse.y = null;
});

window.addEventListener("click", () => {
  colorMode = (colorMode + 1) % palettes.length;
  createParticles();
});

particleInput.addEventListener("input", createParticles);

colorBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  colorMode = (colorMode + 1) % palettes.length;
  createParticles();
});

resetBtn.addEventListener("click", (event) => {
  event.stopPropagation();

  particleInput.value = 900;
  forceInput.value = 90;
  colorMode = 0;

  createParticles();
});

resizeCanvas();
animate();