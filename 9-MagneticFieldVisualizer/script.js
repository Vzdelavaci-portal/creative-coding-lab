const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const modeInput = document.getElementById("mode");
const linesInput = document.getElementById("lines");
const particlesInput = document.getElementById("particles");
const strengthInput = document.getElementById("strength");
const lengthInput = document.getElementById("lineLength");
const glowInput = document.getElementById("glow");

const linesValue = document.getElementById("linesValue");
const particlesValue = document.getElementById("particlesValue");
const strengthValue = document.getElementById("strengthValue");
const lengthValue = document.getElementById("lengthValue");
const glowValue = document.getElementById("glowValue");

const positiveBtn = document.getElementById("positiveBtn");
const negativeBtn = document.getElementById("negativeBtn");
const rainBtn = document.getElementById("rainBtn");
const presetBtn = document.getElementById("presetBtn");
const clearBtn = document.getElementById("clearBtn");
const saveBtn = document.getElementById("saveBtn");

let width;
let height;
let charges = [];
let tracers = [];
let selectedChargeType = 1;
let draggedCharge = null;
let time = 0;

const colors = {
  positive: "#fb7185",
  negative: "#38bdf8",
  neutral: "#c084fc",
  gravity: "#facc15"
};

class Charge {
  constructor(x, y, value) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.radius = 18;
  }

  draw() {
    const color = getChargeColor(this.value);

    ctx.save();

    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = Number(glowInput.value) * 1.8;

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(2, 6, 23, 0.85)";
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 0.62, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "white";
    ctx.font = "bold 20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.value > 0 ? "+" : "-", this.x, this.y + 1);

    ctx.restore();
  }

  contains(x, y) {
    const dx = x - this.x;
    const dy = y - this.y;

    return Math.sqrt(dx * dx + dy * dy) < this.radius + 8;
  }
}

class Tracer {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.life = Math.random() * 120 + 80;
    this.size = Math.random() * 1.8 + 0.8;
    this.color = Math.random() > 0.5 ? colors.positive : colors.negative;
  }

  update() {
    const field = getFieldAt(this.x, this.y);
    const magnitude = Math.sqrt(field.x * field.x + field.y * field.y);

    if (magnitude > 0.0001) {
      this.x += (field.x / magnitude) * 2.2;
      this.y += (field.y / magnitude) * 2.2;
    }

    this.life--;

    if (
      this.life <= 0 ||
      this.x < -50 ||
      this.x > width + 50 ||
      this.y < -50 ||
      this.y > height + 50
    ) {
      this.reset();
    }
  }

  draw() {
    ctx.save();

    ctx.globalAlpha = Math.max(0, this.life / 160);
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = Number(glowInput.value);

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;

  if (charges.length === 0) {
    loadPreset();
  }

  createTracers();
}

function updateLabels() {
  linesValue.textContent = linesInput.value;
  particlesValue.textContent = particlesInput.value;
  strengthValue.textContent = (Number(strengthInput.value) / 100).toFixed(2);
  lengthValue.textContent = lengthInput.value;
  glowValue.textContent = glowInput.value;
}

function getChargeColor(value) {
  if (modeInput.value === "gravity") {
    return colors.gravity;
  }

  return value > 0 ? colors.positive : colors.negative;
}

function getFieldAt(x, y) {
  let fx = 0;
  let fy = 0;

  const strength = Number(strengthInput.value) / 100;
  const mode = modeInput.value;

  for (const charge of charges) {
    const dx = x - charge.x;
    const dy = y - charge.y;

    const distanceSq = dx * dx + dy * dy + 900;
    const distance = Math.sqrt(distanceSq);

    let value = charge.value;

    if (mode === "gravity") {
      value = -Math.abs(charge.value);
    }

    let force = (value * strength * 9000) / distanceSq;

    if (mode === "magnetic") {
      const swirl = value * strength * 180 / distanceSq;
      fx += -dy / distance * swirl;
      fy += dx / distance * swirl;
    } else {
      fx += dx / distance * force;
      fy += dy / distance * force;
    }
  }

  return { x: fx, y: fy };
}

function drawBackground() {
  ctx.clearRect(0, 0, width, height);

  const gradient = ctx.createRadialGradient(
    width / 2,
    height / 2,
    80,
    width / 2,
    height / 2,
    Math.max(width, height)
  );

  gradient.addColorStop(0, "rgba(56, 189, 248, 0.08)");
  gradient.addColorStop(0.45, "rgba(129, 140, 248, 0.035)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function drawHeatMap() {
  const spacing = 42;

  for (let x = 0; x < width; x += spacing) {
    for (let y = 0; y < height; y += spacing) {
      const field = getFieldAt(x, y);
      const magnitude = Math.min(
        1,
        Math.sqrt(field.x * field.x + field.y * field.y) / 8
      );

      if (magnitude < 0.02) continue;

      const alpha = magnitude * 0.12;
      const color =
        modeInput.value === "gravity"
          ? `rgba(250, 204, 21, ${alpha})`
          : `rgba(56, 189, 248, ${alpha})`;

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, magnitude * 18, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawFieldLines() {
  if (charges.length === 0) return;

  const lines = Number(linesInput.value);
  const steps = Number(lengthInput.value);
  const glow = Number(glowInput.value);

  ctx.save();
  ctx.lineWidth = 1.1;
  ctx.lineCap = "round";
  ctx.shadowBlur = glow;

  const startPoints = generateStartPoints(lines);

  for (const start of startPoints) {
    traceLine(start.x, start.y, steps, start.color, 1);
    traceLine(start.x, start.y, steps, start.color, -1);
  }

  ctx.restore();
}

function generateStartPoints(count) {
  const starts = [];

  if (charges.length === 0) return starts;

  for (let i = 0; i < count; i++) {
    const charge = charges[i % charges.length];
    const angle = (Math.PI * 2 * i) / count + time * 0.05;
    const radius = charge.radius + 8;

    starts.push({
      x: charge.x + Math.cos(angle) * radius,
      y: charge.y + Math.sin(angle) * radius,
      color: getChargeColor(charge.value)
    });
  }

  return starts;
}

function traceLine(startX, startY, steps, color, direction) {
  let x = startX;
  let y = startY;

  ctx.beginPath();
  ctx.moveTo(x, y);

  for (let i = 0; i < steps; i++) {
    const field = getFieldAt(x, y);
    const magnitude = Math.sqrt(field.x * field.x + field.y * field.y);

    if (magnitude < 0.001) break;

    x += (field.x / magnitude) * direction * 6;
    y += (field.y / magnitude) * direction * 6;

    if (x < 0 || x > width || y < 0 || y > height) break;

    ctx.lineTo(x, y);
  }

  ctx.strokeStyle = color;
  ctx.shadowColor = color;
  ctx.globalAlpha = 0.32;
  ctx.stroke();
  ctx.globalAlpha = 1;
}

function drawDirectionArrows() {
  const spacing = 85;

  ctx.save();

  for (let x = spacing; x < width; x += spacing) {
    for (let y = spacing; y < height; y += spacing) {
      const field = getFieldAt(x, y);
      const magnitude = Math.sqrt(field.x * field.x + field.y * field.y);

      if (magnitude < 0.01) continue;

      const angle = Math.atan2(field.y, field.x);
      const length = Math.min(24, magnitude * 4);

      ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
      ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(
        x + Math.cos(angle) * length,
        y + Math.sin(angle) * length
      );
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(
        x + Math.cos(angle) * length,
        y + Math.sin(angle) * length,
        2,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  }

  ctx.restore();
}

function createTracers() {
  tracers = [];

  const count = Number(particlesInput.value);

  for (let i = 0; i < count; i++) {
    tracers.push(new Tracer());
  }
}

function drawTracers() {
  for (const tracer of tracers) {
    tracer.update();
    tracer.draw();
  }
}

function addCharge(x, y, value) {
  charges.push(new Charge(x, y, value));
}

function loadPreset() {
  charges = [];

  addCharge(width * 0.42, height * 0.5, 1);
  addCharge(width * 0.58, height * 0.5, -1);
}

function clearAll() {
  charges = [];
  createTracers();
}

function randomPreset() {
  charges = [];

  const count = Math.floor(Math.random() * 5) + 2;

  for (let i = 0; i < count; i++) {
    addCharge(
      width * (0.25 + Math.random() * 0.5),
      height * (0.25 + Math.random() * 0.5),
      Math.random() > 0.5 ? 1 : -1
    );
  }

  createTracers();
}

function saveImage() {
  const link = document.createElement("a");
  link.download = "magnetic-field-visualizer.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function animate() {
  drawBackground();
  drawHeatMap();
  drawFieldLines();
  drawDirectionArrows();
  drawTracers();

  for (const charge of charges) {
    charge.draw();
  }

  updateLabels();

  time += 0.016;

  requestAnimationFrame(animate);
}

canvas.addEventListener("mousedown", event => {
  const x = event.clientX;
  const y = event.clientY;

  for (const charge of charges) {
    if (charge.contains(x, y)) {
      draggedCharge = charge;
      return;
    }
  }

  const value = event.shiftKey ? selectedChargeType * -1 : selectedChargeType;
  addCharge(x, y, value);
});

canvas.addEventListener("mousemove", event => {
  if (!draggedCharge) return;

  draggedCharge.x = event.clientX;
  draggedCharge.y = event.clientY;
});

canvas.addEventListener("mouseup", () => {
  draggedCharge = null;
});

canvas.addEventListener("mouseleave", () => {
  draggedCharge = null;
});

positiveBtn.addEventListener("click", () => {
  selectedChargeType = 1;
  positiveBtn.classList.add("active");
  negativeBtn.classList.remove("active");
});

negativeBtn.addEventListener("click", () => {
  selectedChargeType = -1;
  negativeBtn.classList.add("active");
  positiveBtn.classList.remove("active");
});

rainBtn.addEventListener("click", createTracers);
presetBtn.addEventListener("click", randomPreset);
clearBtn.addEventListener("click", clearAll);
saveBtn.addEventListener("click", saveImage);

[
  linesInput,
  particlesInput,
  strengthInput,
  lengthInput,
  glowInput
].forEach(input => {
  input.addEventListener("input", () => {
    updateLabels();

    if (input === particlesInput) {
      createTracers();
    }
  });
});

modeInput.addEventListener("change", createTracers);

window.addEventListener("resize", resizeCanvas);

positiveBtn.classList.add("active");

resizeCanvas();
animate();