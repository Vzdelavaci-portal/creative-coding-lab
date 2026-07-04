# Sacred Geometry Generator

## Česká verze

### Přehled

**Sacred Geometry Generator** je interaktivní kreativní aplikace pro generování posvátné geometrie pomocí HTML5 Canvas. Projekt kombinuje matematicky generované tvary, plynulé animace, moderní glassmorphism rozhraní a export hotové grafiky do PNG nebo SVG.

Aplikace je navržena jako vizuálně atraktivní nástroj pro kreativní kódování, ne jen jako jednoduché demo.

---

### Funkce

- Flower of Life, Seed of Life, Metatron's Cube, Sri Yantra, Vesica Piscis a Hexagonal Grid
- Matematicky generované kružnice, úsečky, polygony a křivky
- Postupné vykreslování každé kružnice a čáry
- Plynulé animace: rotace, breathing, pulse, rainbow shift a center pulse
- Volitelný particle aura systém
- Zoom kolečkem myši
- Rotace tažením myši
- Reset pohledu dvojklikem
- Moderní glassmorphism UI
- Tmavé kosmické pozadí
- Barevné režimy: Rainbow, Ocean, Sunset, Neon, Gold, Monochrome
- Pozadí: Dark, Deep Space, Light, Animated Stars
- Export do PNG
- Export do SVG
- Transparentní export
- Optimalizované výchozí nastavení pro plynulejší běh

---

### Ovládání

- `Pattern` mění vybranou geometrickou konstrukci.
- `Color Mode` mění barevnou paletu.
- `Background` mění pozadí canvasu.
- `Scale` nastavuje velikost geometrie.
- `Rotation` ručně otáčí kompozici.
- `Line Thickness` nastavuje sílu čar.
- `Glow` přidává jemnou světelnou vrstvu.
- `Complexity` mění počet prvků u náročnějších vzorů.
- `Animation Speed` upravuje rychlost animace.
- `Particles` zapíná nebo vypíná částicový efekt.
- `Pulse` zapíná pulzování geometrie.
- `Breathing` zapíná jemné dýchání celé kompozice.
- `Rotate` zapíná automatickou rotaci.
- `Random Pattern` vybere náhodný vzor.
- `Random Colors` vybere náhodnou barevnou paletu.
- `Reset` vrátí aplikaci do výchozího stavu.
- `Export PNG` uloží aktuální obraz z canvasu.
- `Export SVG` uloží škálovatelnou vektorovou geometrii.
- `Fullscreen` přepne aplikaci na celou obrazovku.

---

### Technologie

- HTML5
- CSS3
- Vanilla JavaScript
- Canvas API
- ES6 classes
- ES modules ve složce `js/`

Projekt nepoužívá žádné externí knihovny, frameworky ani SVG knihovny.

---

### Struktura projektu

```text
11-SacredGeometryGenerator/
  index.html
  style.css
  script.js
  js/
    app.js
    renderer.js
    ui.js
    patterns.js
    particles.js
    animation.js
    export.js
    utils.js
  README.md
```

`script.js` je kompatibilní build pro přímé otevření přes `file://`.

Složka `js/` obsahuje modulární ES6 architekturu pro vývoj.

---

### Jak se geometrie generuje

Aplikace skládá každý vzor ze seznamu matematických primitiv: kružnic, úseček, polygonů a kvadratických křivek. Renderer je postupně vykresluje podle animační časové osy, takže geometrie nevyskočí najednou, ale elegantně vznikne na plátně.

- `Flower of Life` používá stejně velké kružnice rozmístěné na axiální hexagonální mřížce.
- `Seed of Life` používá jednu středovou kružnici a šest kružnic se středy na jejím obvodu.
- `Metatron's Cube` vychází ze Seed of Life a propojuje uzly podle geometrických vzdáleností.
- `Sri Yantra` kombinuje střídající se rovnostranné trojúhelníky, lotosové oblouky a soustředné hranice.
- `Vesica Piscis` používá dvě stejně velké překrývající se kružnice, kde střed každé leží na obvodu druhé.
- `Hexagonal Grid` skládá pravidelné šestiúhelníky z axiálních souřadnic.

---

### Spuštění

Otevři soubor:

```text
11-SacredGeometryGenerator/index.html
```

Projekt funguje i při přímém otevření z disku, protože kořenový `script.js` nepoužívá `import`.

Pro vývoj můžeš použít lokální server:

```text
http://localhost:8080/11-SacredGeometryGenerator/index.html
```

---

### Poznámka k výkonu

Canvas efekty jako glow, částice a vysoká komplexita mohou být náročné na GPU. Výchozí nastavení je proto optimalizované tak, aby aplikace běžela plynuleji i na slabších počítačích.

Pro vyšší vizuální kvalitu můžeš ručně zvýšit:

- `Glow`
- `Complexity`
- `Particles`
- `Animation Speed`

Pro lepší výkon sniž:

- `Glow`
- `Complexity`
- vypni `Particles`

---

### Budoucí vylepšení

- Přidat skutečný vertex-level morphing mezi podobnými patterny.
- Přidat recording timeline a video export.
- Přidat editable construction guides.
- Přidat ukládání vlastních palet a presetů.
- Přidat keyboard shortcuts pro rychlejší workflow.
- Přidat quality přepínač: Low, Balanced, Ultra.

---

### Licence

MIT License.

---

## English Version

### Overview

**Sacred Geometry Generator** is an interactive creative coding application for generating sacred geometry with HTML5 Canvas. The project combines mathematically generated shapes, smooth animations, a modern glassmorphism interface, and export-ready artwork.

The application is designed to feel like a polished creative tool, not a simple canvas demo.

---

### Features

- Flower of Life, Seed of Life, Metatron's Cube, Sri Yantra, Vesica Piscis, and Hexagonal Grid
- Mathematically generated circles, lines, polygons, and curves
- Progressive drawing of every circle and line
- Smooth animations: rotation, breathing, pulse, rainbow shift, and center pulse
- Optional particle aura system
- Mouse wheel zoom
- Drag-to-rotate interaction
- Double-click view reset
- Modern glassmorphism UI
- Dark cosmic background
- Color modes: Rainbow, Ocean, Sunset, Neon, Gold, Monochrome
- Background modes: Dark, Deep Space, Light, Animated Stars
- PNG export
- SVG export
- Transparent export
- Optimized default settings for smoother performance

---

### Controls

- `Pattern` changes the selected geometric construction.
- `Color Mode` changes the color palette.
- `Background` changes the canvas background.
- `Scale` adjusts the size of the geometry.
- `Rotation` manually rotates the composition.
- `Line Thickness` adjusts line width.
- `Glow` adds a subtle luminous layer.
- `Complexity` changes the number of elements in more demanding patterns.
- `Animation Speed` adjusts the animation speed.
- `Particles` toggles the particle effect.
- `Pulse` enables geometry pulsing.
- `Breathing` enables subtle breathing motion.
- `Rotate` enables automatic rotation.
- `Random Pattern` selects a random pattern.
- `Random Colors` selects a random color palette.
- `Reset` restores the default state.
- `Export PNG` saves the current canvas image.
- `Export SVG` saves scalable vector geometry.
- `Fullscreen` switches the app into fullscreen mode.

---

### Technologies

- HTML5
- CSS3
- Vanilla JavaScript
- Canvas API
- ES6 classes
- ES modules in the `js/` folder

No external libraries, frameworks, or SVG libraries are used.

---

### Project Structure

```text
11-SacredGeometryGenerator/
  index.html
  style.css
  script.js
  js/
    app.js
    renderer.js
    ui.js
    patterns.js
    particles.js
    animation.js
    export.js
    utils.js
  README.md
```

`script.js` is a compatible build for opening the project directly through `file://`.

The `js/` folder contains the modular ES6 source architecture for development.

---

### How The Geometry Is Generated

The application builds each pattern as a list of mathematical primitives: circles, line segments, polygons, and quadratic curves. The renderer progressively draws each primitive using a shared animation timeline, so the geometry appears elegantly instead of instantly popping onto the canvas.

- `Flower of Life` uses equal-radius circles placed on an axial hexagonal lattice.
- `Seed of Life` uses one central circle and six circles centered on its circumference.
- `Metatron's Cube` is derived from Seed of Life and connects nodes based on geometric distance.
- `Sri Yantra` combines alternating equilateral triangles, lotus-like arcs, and concentric boundaries.
- `Vesica Piscis` uses two equal overlapping circles where each center lies on the circumference of the other.
- `Hexagonal Grid` builds regular hexagons from axial coordinates.

---

### Installation

Open this file:

```text
11-SacredGeometryGenerator/index.html
```

The project also works when opened directly from disk because the root `script.js` does not use `import`.

For development, you can use a local server:

```text
http://localhost:8080/11-SacredGeometryGenerator/index.html
```

---

### Performance Note

Canvas effects such as glow, particles, and high complexity can be demanding on the GPU. The default settings are optimized so the app runs more smoothly even on weaker computers.

For higher visual quality, manually increase:

- `Glow`
- `Complexity`
- `Particles`
- `Animation Speed`

For better performance, reduce:

- `Glow`
- `Complexity`
- turn off `Particles`

---

### Future Improvements

- Add true vertex-level morphing between related patterns.
- Add timeline recording and video export.
- Add editable construction guides.
- Add custom palette and preset saving.
- Add keyboard shortcuts for faster workflow.
- Add a quality switch: Low, Balanced, Ultra.

---

### License

MIT License.
