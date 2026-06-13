# 🎨 Symmetry Painter Pro

## 🇬🇧 English

An interactive creative coding playground built with **HTML, CSS and JavaScript** using the **HTML5 Canvas API**.

Symmetry Painter Pro allows you to create stunning symmetrical artwork using multiple drawing modes, glowing brushes, particle effects and kaleidoscope-style reflections.

Whether you want to create mandalas, abstract art or mesmerizing geometric patterns, this tool transforms simple mouse movements into beautiful digital creations.

---

## 🚀 Live Demo

GitHub Pages:

```text
https://your-username.github.io/creative-coding-lab/8-SymmetryPainter/
```

---

## ✨ Features

- Multiple symmetry modes
- Mirror drawing mode
- Kaleidoscope mode
- Normal brush
- Glow brush
- Rainbow brush
- Particle brush
- Star brush
- Adjustable brush size
- Adjustable glow intensity
- Custom color picker
- Auto Artist mode
- Random configuration generator
- PNG export
- Mobile support
- Responsive design

---

## 🎮 Controls

### Draw

Hold the mouse button and move the cursor to draw.

```text
Mouse Down
↓
Draw
↓
Symmetrical Artwork
```

---

### Symmetry

Controls how many copies are created around the center.

Examples:

```text
2  = Simple Mirror
6  = Basic Mandala
12 = Detailed Pattern
24 = Complex Geometry
32 = Extreme Symmetry
```

---

### Brush Types

#### Normal

Classic drawing brush.

#### Glow

Creates glowing neon strokes.

#### Rainbow

Cycles automatically through colors.

#### Particle

Creates particle-based effects.

#### Star

Draws small glowing stars.

---

### Drawing Modes

#### Symmetry

Rotational symmetry around the center.

#### Mirror

Vertical and horizontal reflection.

#### Kaleidoscope

Combines symmetry and reflections.

Produces the most complex patterns.

---

### Auto Artist

Generates artwork automatically.

Useful for:

- inspiration
- backgrounds
- procedural art

---

### Random

Generates a random combination of:

- symmetry
- brush
- colors
- drawing mode

---

### Save PNG

Exports your artwork as an image.

---

## 🧠 How It Works

The project uses rotational transformations.

For every line you draw:

```text
Original Line
↓
Rotate
↓
Mirror
↓
Repeat
```

The line is copied around the center point.

Rotation uses:

```text
x' = x cos(a) - y sin(a)

y' = x sin(a) + y cos(a)
```

Where:

```text
a = rotation angle
```

This allows a single stroke to generate dozens of symmetrical copies.

---

## 🎨 Brush System

Each brush uses a different rendering strategy.

### Glow Brush

Uses:

```text
shadowBlur
shadowColor
```

to create neon effects.

### Rainbow Brush

Uses dynamic HSL colors:

```text
hsl(hue, 100%, 65%)
```

### Particle Brush

Generates multiple particles around the cursor.

### Star Brush

Creates procedural star shapes.

---

## 🛠 Technologies Used

- HTML5
- CSS3
- JavaScript (ES6)
- Canvas API

No external libraries are required.

---

## 📂 Project Structure

```text
8-SymmetryPainter/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

---

## 📚 Educational Topics

This project demonstrates:

- Geometry
- Symmetry
- Rotational transformations
- Canvas API
- Interactive graphics
- Event handling
- Generative art
- Creative coding

---

## 🎯 Learning Goals

By exploring this project you can learn:

- How symmetry works in graphics
- How rotation transforms coordinates
- How Canvas drawing tools work
- How interactive applications are built
- How procedural art can be generated

---

## 🌟 Future Ideas

Possible improvements:

- Heart brush
- Snowflake brush
- SVG export
- Layer system
- Undo / Redo
- Background themes
- Animated brushes
- Multiplayer drawing
- AI-assisted patterns

---

## 🇨🇿 Česky

Interaktivní kreativní aplikace vytvořená pomocí **HTML, CSS a JavaScriptu** s využitím **HTML5 Canvas API**.

Symmetry Painter Pro umožňuje vytvářet nádherné symetrické obrazce pomocí různých režimů kreslení, neonových efektů, částicových štětců a kaleidoskopických odrazů.

Jednoduché pohyby myší se mění na složité geometrické vzory a digitální umění.

---

## ✨ Funkce

- Více režimů symetrie
- Mirror mód
- Kaleidoscope mód
- Normal Brush
- Glow Brush
- Rainbow Brush
- Particle Brush
- Star Brush
- Nastavitelná velikost štětce
- Nastavitelný glow efekt
- Výběr barev
- Auto Artist mód
- Náhodné generování
- Export PNG
- Podpora mobilů
- Responzivní design

---

## 🎮 Ovládání

### Kreslení

Podrž tlačítko myši a kresli.

### Symmetry

Určuje počet kopií kolem středu.

### Brush Types

- Normal
- Glow
- Rainbow
- Particle
- Star

### Drawing Modes

#### Symmetry

Klasická rotační symetrie.

#### Mirror

Zrcadlení.

#### Kaleidoscope

Kombinace obou metod.

---

### Auto Artist

Automaticky vytváří nové obrazce.

---

### Random

Vygeneruje náhodné nastavení.

---

### Save PNG

Uloží obrázek.

---

## 🧠 Jak to funguje

Každá čára se opakovaně otáčí kolem středu:

```text
Nakreslená čára
↓
Rotace
↓
Zrcadlení
↓
Nové kopie
```

Výsledkem jsou složité symetrické obrazce.

---

## 📚 Co si můžeš procvičit

- Geometrii
- Symetrii
- Canvas API
- Události myši
- Kreativní programování
- Generativní umění

---

## 🎯 Co se naučíš

- Jak funguje rotační symetrie
- Jak pracovat s Canvas API
- Jak vytvářet interaktivní aplikace
- Jak generovat digitální umění pomocí matematiky

---

## 📜 License

This project is open-source and available for educational and personal use.

Tento projekt je open-source a je určen pro vzdělávací a osobní použití.

---

# 🎨 Creative Coding Lab #8

**Symmetry Painter Pro**

Transform simple strokes into beautiful symmetrical digital artwork.

**Proměň jednoduché tahy myší v nádherné symetrické digitální umění.**