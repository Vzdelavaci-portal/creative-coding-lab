# 🌳 Interactive Fractal Tree

## 🇬🇧 English

An interactive fractal tree visualization built with **HTML, CSS and JavaScript** using the **HTML5 Canvas API**.

Move your mouse across the screen and watch the tree dynamically change its shape. Adjust parameters such as branch depth, trunk length and branch scaling to create unique fractal patterns.

---

## 🚀 Live Demo

GitHub Pages:

```text
https://your-username.github.io/creative-coding-lab/1-FractalTree/
```

---

## ✨ Features

- Interactive fractal tree generation
- Real-time mouse interaction
- Dynamic branch angle control
- Adjustable recursion depth
- Adjustable trunk length
- Adjustable branch scaling
- Multiple color themes
- Random tree generator
- Responsive design
- Built with pure JavaScript (no external libraries)

---

## 🎮 Controls

### Mouse Movement

Move the mouse horizontally:

- Changes branch angle
- Creates different tree shapes

Move the mouse vertically:

- Simulates wind effect
- Bends the tree left or right

### Mouse Click

- Switches between color palettes

### Sliders

#### Branch Depth

Controls how many recursive levels the tree contains.

#### Trunk Length

Controls the initial length of the tree trunk.

#### Branch Scale

Determines how much each new branch shrinks compared to its parent branch.

Examples:

```text
0.55 = Compact tree
0.72 = Natural tree
0.82 = Wide tree
```

### Buttons

#### Random

Generates a random tree configuration.

#### Reset

Restores the default settings.

---

## 🧠 How It Works

The tree is generated using a recursive algorithm.

Each branch creates two smaller branches:

```text
Branch
├── Left Branch
└── Right Branch
```

Pseudo-code:

```javascript
drawBranch(length, angle, depth) {
    if (depth === 0) return;

    draw current branch;

    drawBranch(smallerLength, angle - branchAngle, depth - 1);
    drawBranch(smallerLength, angle + branchAngle, depth - 1);
}
```

This recursive process creates the characteristic fractal structure.

---

## 🛠 Technologies Used

- HTML5
- CSS3
- JavaScript (ES6)
- Canvas API

---

## 📂 Project Structure

```text
1-FractalTree/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

---

## 📚 Educational Topics

- Recursion
- Fractals
- Mathematical visualization
- Canvas drawing
- Event handling
- Mouse interaction
- Creative coding

---

## 🎯 Learning Goals

By exploring this project you can learn:

- How recursive algorithms work
- How fractals are generated
- How to draw graphics with Canvas
- How user interaction affects visualizations
- How mathematics and programming can create digital art

---

## 🌟 Future Ideas

- Animated tree growth
- Falling leaves
- Seasons (spring, summer, autumn, winter)
- Wind simulation
- Particle effects
- Export as PNG
- Fullscreen mode
- Preset tree styles

---

## 🇨🇿 Česky

Interaktivní vizualizace fraktálního stromu vytvořená pomocí **HTML, CSS a JavaScriptu** s využitím **HTML5 Canvas API**.

Pohybuj myší po obrazovce a sleduj, jak se strom dynamicky mění. Pomocí posuvníků můžeš upravovat hloubku větvení, délku kmene nebo zkrácení větví a vytvářet tak jedinečné fraktální obrazce.

---

## ✨ Funkce

- Interaktivní generování fraktálního stromu
- Reakce na pohyb myši v reálném čase
- Dynamická změna úhlu větví
- Nastavitelná hloubka rekurze
- Nastavitelná délka kmene
- Nastavitelné zkrácení větví
- Více barevných motivů
- Náhodné generování stromů
- Responzivní design
- Čistý JavaScript bez externích knihoven

---

## 🎮 Ovládání

### Pohyb myši

Pohyb vodorovně:

- mění úhel větví
- vytváří různé tvary stromu

Pohyb svisle:

- simuluje vítr
- ohýbá strom do stran

### Kliknutí myší

- přepíná barevná schémata

### Posuvníky

#### Hloubka větvení

Určuje počet úrovní rekurze.

#### Délka kmene

Určuje délku hlavního kmene stromu.

#### Zkrácení větví

Určuje, jak moc se každá další větev zkrátí oproti rodičovské větvi.

---

## 🧠 Jak to funguje

Strom je vytvářen pomocí **rekurzivního algoritmu**.

Každá větev vytvoří dvě nové větve:

```text
Větev
├── Levá větev
└── Pravá větev
```

Tento proces se opakuje, dokud není dosažena nastavená hloubka.

Výsledkem je fraktální struktura připomínající skutečný strom.

---

## 📚 Co si můžeš procvičit

- Rekurzi
- Fraktály
- Matematické vizualizace
- Práci s Canvas API
- Události myši
- Interaktivní grafiku
- Creative Coding

---

## 🎯 Co se naučíš

- Jak fungují rekurzivní algoritmy
- Jak vznikají fraktály
- Jak kreslit pomocí Canvas API
- Jak reagovat na uživatelské vstupy
- Jak spojit matematiku, programování a grafiku

---

## 🌟 Nápady na rozšíření

- Animovaný růst stromu
- Padající listí
- Roční období
- Simulace větru
- Particle efekty
- Export do PNG
- Fullscreen režim
- Přednastavené styly stromů

---

## 📜 License

This project is open-source and available for educational and personal use.

Tento projekt je open-source a je určen pro vzdělávací a osobní použití.

---

# 🌳 Creative Coding Lab #1

**Interactive Fractal Tree**

The first project in the Creative Coding Lab series exploring creative programming, mathematics and interactive web graphics.

**První projekt ze série Creative Coding Lab zaměřené na kreativní programování, matematiku a interaktivní webovou grafiku.**