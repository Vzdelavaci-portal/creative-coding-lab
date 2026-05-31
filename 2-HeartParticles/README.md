# ❤️ Heart Particles

## 🇬🇧 English

An interactive particle animation built with **HTML, CSS and JavaScript** using the **HTML5 Canvas API**.

Thousands of particles come together to form a glowing heart shape. Move your mouse near the heart and watch the particles scatter away before smoothly returning to their original positions.

This project demonstrates how mathematics, physics-inspired movement and user interaction can be combined to create visually engaging effects.

---

## 🚀 Live Demo

GitHub Pages:

```text
https://your-username.github.io/creative-coding-lab/2-HeartParticles/
```

---

## ✨ Features

- Interactive particle heart
- Real-time mouse interaction
- Particle repulsion effect
- Smooth particle movement
- Multiple color themes
- Adjustable particle count
- Adjustable interaction force
- Responsive design
- Built with pure JavaScript

---

## 🎮 Controls

### Mouse Movement

Move your mouse near the heart:

- Particles are pushed away
- The heart temporarily breaks apart
- Particles smoothly return to their original positions

### Mouse Click

- Switches between color themes

### Particle Count

Controls the number of particles used to create the heart.

Lower values:

```text
Better performance
Less detail
```

Higher values:

```text
More detail
Smoother shape
```

### Repel Force

Controls how strongly particles react to the mouse.

Lower values:

```text
Gentle movement
```

Higher values:

```text
Explosive particle effects
```

---

## 🧠 How It Works

The heart shape is generated using a mathematical parametric equation:

```text
x = 16 sin³(t)

y = 13 cos(t)
    - 5 cos(2t)
    - 2 cos(3t)
    - cos(4t)
```

Random points are generated along this curve.

Each particle stores:

- Current position
- Target position
- Velocity
- Movement force

When the mouse approaches:

1. A repulsion force pushes particles away.
2. Particles gain velocity.
3. A "home force" pulls them back to their original positions.
4. Friction smooths the movement.

The result is a fluid and natural animation.

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
2-HeartParticles/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

---

## 📚 Educational Topics

This project demonstrates:

- Particle systems
- Vector movement
- Mouse interaction
- Animation loops
- Physics-inspired motion
- Canvas rendering
- Mathematical curves

---

## 🎯 Learning Goals

By exploring this project you can learn:

- How particle systems work
- How to create interactive animations
- How to use Canvas efficiently
- How mathematical equations generate shapes
- How to implement simple physics effects

---

## 🌟 Future Ideas

Possible improvements:

- Particle trails
- Heart pulse animation
- Particle explosions
- Touch support
- Custom color pickers
- Export as image
- Fullscreen mode
- Background music
- Different shapes (star, flower, logo)

---

## 🇨🇿 Česky

Interaktivní animace vytvořená pomocí **HTML, CSS a JavaScriptu** s využitím **HTML5 Canvas API**.

Tisíce částic společně vytvářejí zářící tvar srdce. Když se přiblížíte myší, částice se rozletí do okolí a následně se plynule vrátí zpět na své původní pozice.

Projekt ukazuje, jak lze propojit matematiku, jednoduchou fyziku a interaktivitu do atraktivního vizuálního efektu.

---

## ✨ Funkce

- Interaktivní srdce z částic
- Reakce na pohyb myši
- Efekt odpuzování částic
- Plynulý návrat částic
- Více barevných schémat
- Nastavitelný počet částic
- Nastavitelná síla interakce
- Responzivní design
- Čistý JavaScript bez knihoven

---

## 🎮 Ovládání

### Pohyb myši

Přibližte kurzor k srdci:

- částice se rozletí
- tvar srdce se rozpadne
- částice se následně vracejí zpět

### Kliknutí myší

- přepíná barevná schémata

### Počet částic

Určuje počet částic použitých pro vytvoření srdce.

Nižší hodnoty:

```text
Vyšší výkon
Méně detailů
```

Vyšší hodnoty:

```text
Více detailů
Plynulejší tvar
```

### Síla odpuzování

Určuje, jak silně budou částice reagovat na pohyb myši.

---

## 🧠 Jak to funguje

Tvar srdce je generován pomocí matematické parametrické rovnice:

```text
x = 16 sin³(t)

y = 13 cos(t)
    - 5 cos(2t)
    - 2 cos(3t)
    - cos(4t)
```

Body na této křivce tvoří cílové pozice částic.

Každá částice si pamatuje:

- aktuální pozici
- cílovou pozici
- rychlost pohybu

Při přiblížení kurzoru:

1. částice získají odpudivou sílu,
2. odletí od kurzoru,
3. následně jsou přitahovány zpět,
4. tření zajistí plynulý pohyb.

Výsledkem je živá a přirozeně působící animace.

---

## 📚 Co si můžeš procvičit

- Particle systémy
- Animace
- Canvas API
- Práci s vektory
- Matematické křivky
- Události myši
- Základy simulace fyziky

---

## 🎯 Co se naučíš

- Jak fungují particle efekty
- Jak vytvářet interaktivní animace
- Jak používat Canvas API
- Jak matematické rovnice vytvářejí tvary
- Jak implementovat jednoduché fyzikální chování

---

## 🌟 Nápady na rozšíření

- Stopy za částicemi
- Pulzující srdce
- Exploze částic
- Podpora dotykového ovládání
- Vlastní výběr barev
- Export do obrázku
- Fullscreen režim
- Hudební doprovod
- Další tvary (hvězda, květina, logo)

---

## 📜 License

This project is open-source and available for educational and personal use.

Tento projekt je open-source a je určen pro vzdělávací a osobní použití.

---

# ❤️ Creative Coding Lab #2

**Heart Particles**

An interactive particle animation where thousands of particles form a glowing heart and react to mouse movement.

**Interaktivní animace, ve které tisíce částic vytvářejí zářící srdce reagující na pohyb myši.**