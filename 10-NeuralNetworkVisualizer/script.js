const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const neuronCountEl = document.getElementById("neuronCount");
const connectionCountEl = document.getElementById("connectionCount");
const signalCountEl = document.getElementById("signalCount");

const networkSizeInput = document.getElementById("networkSize");
const signalSpeedInput = document.getElementById("signalSpeed");
const glowInput = document.getElementById("glow");
const themeInput = document.getElementById("theme");

const sizeValue = document.getElementById("sizeValue");
const speedValue = document.getElementById("speedValue");
const glowValue = document.getElementById("glowValue");

const generateBtn = document.getElementById("generateBtn");
const pulseBtn = document.getElementById("pulseBtn");
const trainBtn = document.getElementById("trainBtn");
const randomBtn = document.getElementById("randomBtn");
const clearSignalsBtn = document.getElementById("clearSignalsBtn");
const saveBtn = document.getElementById("saveBtn");

let width;
let height;

let neurons = [];
let connections = [];
let signals = [];
let draggedNeuron = null;
let trainMode = false;
let time = 0;
let totalSignalsCreated = 0;

const themes = {
  blue: {
    node: "#38bdf8",
    node2: "#818cf8",
    signal: "#ffffff",
    connection: "rgba(56, 189, 248, 0.28)",
    bg1: "rgba(56, 189, 248, 0.08)",
    bg2: "rgba(129, 140, 248, 0.035)"
  },
  purple: {
    node: "#c084fc",
    node2: "#f472b6",
    signal: "#ffffff",
    connection: "rgba(192, 132, 252, 0.3)",
    bg1: "rgba(192, 132, 252, 0.09)",
    bg2: "rgba(244, 114, 182, 0.035)"
  },
  matrix: {
    node: "#22c55e",
    node2: "#86efac",
    signal: "#dcfce7",
    connection: "rgba(34, 197, 94, 0.28)",
    bg1: "rgba(34, 197, 94, 0.08)",
    bg2: "rgba(134, 239, 172, 0.035)"
  },
  cyber: {
    node: "#22d3ee",
    node2: "#fb7185",
    signal: "#fef3c7",
    connection: "rgba(34, 211, 238, 0.3)",
    bg1: "rgba(34, 211, 238, 0.08)",
    bg2: "rgba(251, 113, 133, 0.035)"
  },
  fire: {
    node: "#f97316",
    node2: "#facc15",
    signal: "#fff7ed",
    connection: "rgba(249, 115, 22, 0.3)",
    bg1: "rgba(249, 115, 22, 0.09)",
    bg2: "rgba(250, 204, 21, 0.035)"
  }
};

class Neuron {
  constructor(x, y, layer, index) {
    this.x = x;
    this.y = y;
    this.layer = layer;
    this.index = index;
    this.radius = 16;
    this.activation = 0;
    this.pulse = Math.random() * Math.PI * 2;
  }

  update() {
    this.activation *= 0.92;
    this.pulse += 0.04;
  }

  draw() {
    const theme = getTheme();
    const glow = Number(glowInput.value);

    const pulseSize = Math.sin(this.pulse + time * 2) * 2;
    const activeBoost = this.activation * 10;

    ctx.save();

    ctx.shadowColor = this.layer === 0 ? theme.node2 : theme.node;
    ctx.shadowBlur = glow + activeBoost;

    const gradient = ctx.createRadialGradient(
      this.x,
      this.y,
      2,
      this.x,
      this.y,
      this.radius + activeBoost
    );

    gradient.addColorStop(0, theme.signal);
    gradient.addColorStop(0.35, this.layer === 0 ? theme.node2 : theme.node);
    gradient.addColorStop(1, "rgba(255,255,255,0.02)");

    ctx.fillStyle = gradient;

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius + pulseSize + activeBoost * 0.25, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(255,255,255,0.45)";
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius + activeBoost * 0.15, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  contains(x, y) {
    const dx = x - this.x;
    const dy = y - this.y;

    return Math.sqrt(dx * dx + dy * dy) < this.radius + 10;
  }
}

class Connection {
  constructor(from, to) {
    this.from = from;
    this.to = to;
    this.weight = Math.random() * 0.7 + 0.3;
    this.activity = 0;
  }

  update() {
    this.activity *= 0.9;

    if (trainMode) {
      this.weight += (Math.random() - 0.48) * 0.006;
      this.weight = Math.max(0.15, Math.min(1.4, this.weight));
    }
  }

  draw() {
    const theme = getTheme();
    const glow = Number(glowInput.value);

    const alpha = 0.12 + this.weight * 0.22 + this.activity * 0.45;
    const lineWidth = 0.7 + this.weight * 1.4 + this.activity * 2;

    ctx.save();

    ctx.strokeStyle = theme.connection.replace("0.28", alpha).replace("0.3", alpha);
    ctx.lineWidth = lineWidth;
    ctx.shadowColor = theme.node;
    ctx.shadowBlur = this.activity * glow;

    ctx.beginPath();
    ctx.moveTo(this.from.x, this.from.y);

    const midX = (this.from.x + this.to.x) / 2;
    const midY = (this.from.y + this.to.y) / 2;
    const curve = Math.sin(this.from.index + this.to.index) * 30;

    ctx.quadraticCurveTo(midX, midY + curve, this.to.x, this.to.y);
    ctx.stroke();

    ctx.restore();
  }
}

class Signal {
  constructor(connection) {
    this.connection = connection;
    this.progress = 0;
    this.speed = (Number(signalSpeedInput.value) / 100) * (0.012 + Math.random() * 0.01);
    this.size = Math.random() * 2.5 + 3;
    this.dead = false;

    totalSignalsCreated++;
  }

  update() {
    this.progress += this.speed;

    this.connection.activity = 1;
    this.connection.from.activation = 1;

    if (this.progress >= 1) {
      this.connection.to.activation = 1;
      this.dead = true;

      const nextConnections = connections.filter(
        connection => connection.from === this.connection.to
      );

      for (const connection of nextConnections) {
        if (Math.random() < 0.55 + connection.weight * 0.25) {
          signals.push(new Signal(connection));
        }
      }
    }
  }

  draw() {
    const theme = getTheme();

    const from = this.connection.from;
    const to = this.connection.to;

    const x = from.x + (to.x - from.x) * this.progress;
    const y = from.y + (to.y - from.y) * this.progress;

    ctx.save();

    ctx.fillStyle = theme.signal;
    ctx.shadowColor = theme.signal;
    ctx.shadowBlur = Number(glowInput.value) * 1.6;

    ctx.beginPath();
    ctx.arc(x, y, this.size, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

function getTheme() {
  return themes[themeInput.value];
}

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;

  generateNetwork();
}

function getSizeLabel() {
  const value = Number(networkSizeInput.value);

  if (value === 1) return "Small";
  if (value === 2) return "Medium";
  return "Deep";
}

function generateNetwork() {
  neurons = [];
  connections = [];
  signals = [];

  const size = Number(networkSizeInput.value);

  let layers;

  if (size === 1) {
    layers = [3, 5, 3];
  } else if (size === 2) {
    layers = [4, 7, 6, 3];
  } else {
    layers = [5, 8, 8, 6, 4];
  }

  const leftPanelSafeSpace = width < 700 ? 40 : 430;
  const rightMargin = 120;

  const startX = leftPanelSafeSpace;
  const availableWidth = width - leftPanelSafeSpace - rightMargin;

  layers.forEach((count, layerIndex) => {
    const x = startX + (availableWidth / (layers.length - 1)) * layerIndex;
    const layerHeight = (count - 1) * 70;
    const startY = height / 2 - layerHeight / 2;

    for (let i = 0; i < count; i++) {
      neurons.push(new Neuron(x, startY + i * 70, layerIndex, i));
    }
  });

  const maxLayer = layers.length - 1;

  for (let layer = 0; layer < maxLayer; layer++) {
    const current = neurons.filter(neuron => neuron.layer === layer);
    const next = neurons.filter(neuron => neuron.layer === layer + 1);

    for (const from of current) {
      for (const to of next) {
        if (Math.random() < 0.72 || size === 1) {
          connections.push(new Connection(from, to));
        }
      }
    }
  }

  updateStats();
}

function updateStats() {
  neuronCountEl.textContent = neurons.length;
  connectionCountEl.textContent = connections.length;
  signalCountEl.textContent = totalSignalsCreated;

  sizeValue.textContent = getSizeLabel();
  speedValue.textContent = (Number(signalSpeedInput.value) / 100).toFixed(2);
  glowValue.textContent = glowInput.value;
}

function drawBackground() {
  const theme = getTheme();

  ctx.clearRect(0, 0, width, height);

  const gradient = ctx.createRadialGradient(
    width / 2,
    height / 2,
    80,
    width / 2,
    height / 2,
    Math.max(width, height)
  );

  gradient.addColorStop(0, theme.bg1);
  gradient.addColorStop(0.45, theme.bg2);
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  drawGrid();
}

function drawGrid() {
  ctx.save();

  ctx.strokeStyle = "rgba(255,255,255,0.035)";
  ctx.lineWidth = 1;

  const spacing = 50;

  for (let x = 0; x < width; x += spacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let y = 0; y < height; y += spacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  ctx.restore();
}

function animate() {
  drawBackground();

  for (const connection of connections) {
    connection.update();
    connection.draw();
  }

  for (const neuron of neurons) {
    neuron.update();
    neuron.draw();
  }

  for (const signal of signals) {
    signal.update();
    signal.draw();
  }

  signals = signals.filter(signal => !signal.dead);

  if (trainMode && Math.random() < 0.08) {
    pulseInputLayer();
  }

  updateStats();

  time += 0.016;

  requestAnimationFrame(animate);
}

function pulseInputLayer() {
  const inputNeurons = neurons.filter(neuron => neuron.layer === 0);

  for (const neuron of inputNeurons) {
    neuron.activation = 1;

    const outgoing = connections.filter(connection => connection.from === neuron);

    for (const connection of outgoing) {
      if (Math.random() < 0.75) {
        signals.push(new Signal(connection));
      }
    }
  }
}

function pulseFromNeuron(neuron) {
  neuron.activation = 1;

  const outgoing = connections.filter(connection => connection.from === neuron);

  if (outgoing.length === 0) {
    const incoming = connections.filter(connection => connection.to === neuron);

    for (const connection of incoming) {
      signals.push(new Signal(connection));
    }

    return;
  }

  for (const connection of outgoing) {
    signals.push(new Signal(connection));
  }
}

function randomizeTheme() {
  const keys = Object.keys(themes);
  themeInput.value = keys[Math.floor(Math.random() * keys.length)];
}

function saveImage() {
  const link = document.createElement("a");
  link.download = "neural-network-visualizer.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

canvas.addEventListener("mousedown", event => {
  const x = event.clientX;
  const y = event.clientY;

  for (const neuron of neurons) {
    if (neuron.contains(x, y)) {
      draggedNeuron = neuron;
      pulseFromNeuron(neuron);
      return;
    }
  }
});

canvas.addEventListener("mousemove", event => {
  if (!draggedNeuron) return;

  draggedNeuron.x = event.clientX;
  draggedNeuron.y = event.clientY;
});

canvas.addEventListener("mouseup", () => {
  draggedNeuron = null;
});

canvas.addEventListener("mouseleave", () => {
  draggedNeuron = null;
});

generateBtn.addEventListener("click", generateNetwork);
pulseBtn.addEventListener("click", pulseInputLayer);

trainBtn.addEventListener("click", () => {
  trainMode = !trainMode;
  trainBtn.classList.toggle("active", trainMode);
  trainBtn.textContent = trainMode ? "Stop Training" : "Train";
});

randomBtn.addEventListener("click", () => {
  networkSizeInput.value = Math.floor(Math.random() * 3) + 1;
  signalSpeedInput.value = Math.floor(Math.random() * 150) + 50;
  glowInput.value = Math.floor(Math.random() * 30) + 8;

  randomizeTheme();
  generateNetwork();
});

clearSignalsBtn.addEventListener("click", () => {
  signals = [];
});

saveBtn.addEventListener("click", saveImage);

networkSizeInput.addEventListener("input", generateNetwork);
signalSpeedInput.addEventListener("input", updateStats);
glowInput.addEventListener("input", updateStats);
themeInput.addEventListener("change", updateStats);

window.addEventListener("resize", resizeCanvas);

resizeCanvas();
animate();