# 🔷 Voronoi Art Generator

An interactive generative art project that transforms simple points into colorful Voronoi mosaics.

Built with pure **HTML, CSS and JavaScript** using the **Canvas API**.

---

## ✨ Overview

The **Voronoi Art Generator** creates dynamic geometric patterns based on Voronoi diagrams.

Each control point defines its own region. Every pixel belongs to the nearest point, producing a colorful mosaic of cells that constantly changes as the points move.

The final result can resemble:

* stained glass
* crystals
* biological cells
* abstract maps
* futuristic interfaces
* geometric artwork

Users can add, remove or drag points, animate the entire structure, display neighboring connections and export the generated artwork as a PNG image.

---

## 🚀 Features

* Interactive Voronoi diagram
* Animated control points
* Drag-and-drop point movement
* Add new points by clicking
* Remove points with right-click
* Adjustable point count
* Adjustable rendering detail
* Custom cell edge width
* Glow effect
* Multiple color palettes
* Approximate Delaunay connections
* Lloyd relaxation effect
* Color burst animation
* Responsive layout
* Collapsible control panel
* PNG image export
* Real-time FPS display
* Built without external libraries

---

## 🎮 Controls

### Mouse Controls

| Action         | Control                        |
| -------------- | ------------------------------ |
| Add a point    | Left-click on the canvas       |
| Move a point   | Click and drag a control point |
| Remove a point | Right-click a control point    |

---

### Point Count

Changes the number of generator points.

More points create smaller and more detailed cells.

---

### Detail

Controls the internal rendering resolution.

Lower values create smoother and more detailed results but require more processing power.

Higher values improve performance but make the image slightly less detailed.

---

### Edge Width

Changes the thickness of the visible borders between Voronoi cells.

Setting the value to zero creates a clean color-field effect without visible edges.

---

### Glow

Controls the intensity of the glow around points and visual highlights.

---

### Motion Speed

Changes how quickly the control points move around the canvas.

---

## 🌈 Color Palettes

The project includes several visual themes:

* Neon Glass
* Ocean
* Sunset
* Forest
* Candy
* Monochrome
* Rainbow

Each palette creates a different atmosphere and visual style.

---

## ⚙️ Display Options

### Animate Points

Automatically moves the control points around the canvas.

The Voronoi cells continuously change shape as the points move.

---

### Cell Edges

Displays the boundaries between neighboring Voronoi cells.

---

### Control Points

Shows the generator points responsible for creating the cells.

---

### Delaunay Links

Displays connections between nearby points.

These connections create an approximation of a Delaunay triangulation, which is closely related to the Voronoi diagram.

---

## 🔘 Buttons

### Randomize

Creates a completely new arrangement of control points.

---

### Add Point

Adds one randomly positioned point to the canvas.

---

### Relax

Moves points toward more evenly distributed positions.

This effect is inspired by **Lloyd's algorithm**, which is commonly used to create more balanced Voronoi cells.

---

### Color Burst

Randomizes color offsets and adds a burst of movement to the points.

---

### Reset

Returns all settings to their original values.

---

### Save PNG

Exports the current canvas artwork as a PNG image.

---

## 🧠 What Is a Voronoi Diagram?

A Voronoi diagram divides an area into regions based on a collection of points.

Each region contains all positions that are closer to one particular point than to any other point.

In simple terms:

```text
Every pixel belongs to its nearest control point.
```

This produces a collection of polygon-like cells.

Voronoi diagrams appear in:

* architecture
* biology
* geography
* urban planning
* computer graphics
* procedural generation
* data visualization
* game development

---

## 📐 How It Works

For every rendered pixel, the application calculates the distance to all control points.

The nearest point determines the pixel's color.

Simplified logic:

```javascript
for (const pixel of canvasPixels) {
    let nearestPoint = null;
    let nearestDistance = Infinity;

    for (const point of points) {
        const distance = getDistance(pixel, point);

        if (distance < nearestDistance) {
            nearestDistance = distance;
            nearestPoint = point;
        }
    }

    pixel.color = nearestPoint.color;
}
```

The application also compares the nearest and second-nearest points to detect cell borders.

---

## 📏 Distance Calculation

The squared Euclidean distance is used:

```text
distance² = (x₂ - x₁)² + (y₂ - y₁)²
```

The square root is not required when only comparing distances, which improves performance.

---

## 🔺 Voronoi and Delaunay

Voronoi diagrams and Delaunay triangulations are closely connected.

* Voronoi cells show the area closest to each point.
* Delaunay triangulation connects neighboring points.
* A Delaunay edge usually exists when two Voronoi cells share a border.

This project uses nearby-point connections to create a lightweight visual approximation of Delaunay links.

---

## 🌀 Lloyd Relaxation

Lloyd's algorithm improves the distribution of Voronoi points.

The basic process is:

1. Generate a Voronoi diagram.
2. Find the center of every cell.
3. Move each point toward the center of its cell.
4. Repeat the process.

This gradually produces more evenly sized and balanced cells.

The project uses sampled positions to create a fast approximation of this behavior.

---

## 🛠 Technologies

* HTML5
* CSS3
* Vanilla JavaScript
* Canvas API
* ImageData API
* RequestAnimationFrame

No frameworks or external libraries are used.

---

## 📂 Project Structure

```text
13-VoronoiArtGenerator/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

---

## ▶️ How to Run

Clone or download the project and open:

```text
index.html
```

You can also run it with the **Live Server** extension in Visual Studio Code.

No installation or build process is required.

---

## 🎓 Educational Topics

This project demonstrates:

* Voronoi diagrams
* computational geometry
* Euclidean distance
* pixel manipulation
* Canvas rendering
* generative art
* procedural animation
* particle movement
* user interaction
* color interpolation
* performance optimization
* responsive interfaces

---

## 💡 Possible Future Improvements

* True Delaunay triangulation
* Accurate polygon-based Voronoi rendering
* SVG export
* Video recording
* Gradient-filled cells
* Image-based color sampling
* Weighted Voronoi diagrams
* Manhattan distance mode
* Circular distance fields
* Custom point colors
* More relaxation iterations
* Touch gesture support
* Preset artwork gallery
* Fullscreen mode

---

## 🌐 Browser Support

The project works in modern browsers that support:

* HTML5 Canvas
* ImageData
* requestAnimationFrame
* ES6 JavaScript

Recommended browsers:

* Google Chrome
* Microsoft Edge
* Mozilla Firefox
* Safari

---

## 📜 License

This project is open-source and available for educational and personal use.

---

## 🔷 Creative Coding Lab #13

**Voronoi Art Generator**

Transform simple points into living geometric mosaics and discover the beauty of computational geometry.
