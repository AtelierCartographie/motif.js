# Motif.js

A pattern generator that can be used in SVG environments or Canvas contexts. Create beautiful, customizable patterns for data visualization, cartography, and design.

**Created by:** [Thomas Ansart](https://github.com/ateliercartographie)  
**View the original notebook:** [Observable](https://observablehq.com/@ateliercartographie/motif)  
**License:** ISC

## ✨ Features

- **8 Built-in Patterns**: line, plaid, circle, plus, cross, triangle, square, diamond
- **SVG Support**: Generate SVG patterns for scalable graphics
- **Canvas Support**: Generate Canvas patterns with automatic DPI handling
- **Full Customization**: Control size, scale, angle, colors, strokes, and more
- **TypeScript**: Fully typed for excellent developer experience
- **Observable Plot Integration**: Use patterns in data visualizations
- **Custom Shapes**: Define your own pattern shapes
- **Responsive**: Patterns scale beautifully at any resolution

## 📦 Installation

### With pnpm (recommended)

```bash
pnpm add motif.js
```

### With npm

```bash
npm install motif.js
```

### With yarn

```bash
yarn add motif.js
```

## 🚀 Quick Start

### SVG Pattern

```typescript
import { motif } from "motif.js";

const pattern = motif({
  type: "circle",
  size: 30,
  fill: "#3b82f6",
  background: "#f0f0f0"
});

// Insert pattern definitions
const svg = document.querySelector("svg");
svg.innerHTML = pattern.defs;

// Use pattern as fill
const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
rect.setAttribute("x", "0");
rect.setAttribute("y", "0");
rect.setAttribute("width", "400");
rect.setAttribute("height", "300");
rect.setAttribute("fill", pattern.url);
svg.appendChild(rect);
```

### Canvas Pattern

```typescript
import { motif } from "motif.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const pattern = motif({
  type: "line",
  size: 25,
  angle: 45,
  fill: "#000"
});

const canvasPattern = pattern.context(ctx);
ctx.fillStyle = canvasPattern;
ctx.fillRect(0, 0, canvas.width, canvas.height);
pattern.apply();
```

### Observable Plot Integration

```typescript
import * as Plot from "@observablehq/plot";
import { motif } from "motif.js";

const pattern = motif({
  type: "circle",
  size: 20,
  fill: "#ff6b6b"
});

const chart = Plot.plot({
  marks: [
    () => pattern.defs,
    Plot.areaY(data, {
      x: "date",
      y: "value",
      fill: pattern.url
    })
  ]
});
```

## 📋 API Reference

### `motif(options)`

Creates a pattern that can be used in SVG or Canvas.

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `type` | string | `"line"` | Pattern type: "line", "plaid", "circle", "plus", "cross", "triangle", "square", "diamond", "custom" |
| `scale` | number | `1` | Scale of the tile (multiplier) |
| `size` | number | `20` | Shape size as a percentage of tile area (0-100) |
| `angle` | number | `0` | Rotation angle in degrees (0-360) |
| `fill` | string | `"black"` | Fill color (CSS color) |
| `stroke` | string | `"transparent"` | Stroke color (CSS color) |
| `strokeWidth` | number | `0` | Stroke width in pixels |
| `dash` | number[] | `[]` | Dash pattern for stroke (e.g., `[5, 5]`) |
| `background` | string | `"white"` | Background color of the pattern tile |
| `border` | number | `0` | Border width around tile edges |
| `patchSize` | boolean | `false` | Intelligently swap foreground/background for better appearance at high sizes |
| `custom.shape` | function | - | Custom shape function (for type: "custom") |
| `custom.patch` | number | `50` | Patch size for custom shapes |

#### Return Value

The function returns an object with:

- **`defs`** (string): SVG pattern definitions (use in `<defs>` tag)
- **`url`** (string): CSS url reference (e.g., `url(#pattern-xyz)`)
- **`context(ctx)`** (function): Creates a Canvas pattern from a 2D context
- **`apply()`** (function): Applies pattern transformation to Canvas context

## 🎨 Pattern Types

### Line
Horizontal lines pattern
```typescript
motif({ type: "line", angle: 45 })
```

### Plaid
Grid/plaid pattern
```typescript
motif({ type: "plaid", size: 30 })
```

### Circle
Circular dots pattern
```typescript
motif({ type: "circle", size: 25 })
```

### Plus & Cross
Plus sign pattern (cross is 45° rotated)
```typescript
motif({ type: "plus", size: 30 })
motif({ type: "cross", size: 30 })
```

### Triangle
Triangular pattern
```typescript
motif({ type: "triangle", angle: 30 })
```

### Square & Diamond
Square pattern (diamond is 45° rotated)
```typescript
motif({ type: "square", size: 25 })
motif({ type: "diamond", size: 25 })
```

### Custom
Define your own pattern shape
```typescript
motif({
  type: "custom",
  custom: {
    shape: (tile, shapeArea) => {
      // Return SVG path or canvas path
      return `M 0 0 L ${tile} ${tile} Z`;
    }
  }
})
```

## 💡 Examples

### Colored Stripes
```typescript
const stripes = motif({
  type: "line",
  angle: 45,
  fill: "#ff6b6b",
  background: "#fff1f2",
  size: 15
});
```

### Polka Dots
```typescript
const dots = motif({
  type: "circle",
  size: 25,
  fill: "#4ecdc4",
  background: "#ecf9f7"
});
```

### Complex Grid
```typescript
const grid = motif({
  type: "plaid",
  size: 25,
  fill: "#333",
  stroke: "#ddd",
  strokeWidth: 1,
  background: "#f5f5f5"
});
```

### Cartography Example

Use patterns to fill geographic regions:

```typescript
import * as d3 from "d3";
import { motif } from "motif.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// Create multiple patterns
const patterns = [
  motif({ type: "circle", fill: "#3b82f6" }),
  motif({ type: "line", angle: 45, fill: "#f59e0b" }),
  motif({ type: "plaid", fill: "#10b981" })
];

// Load GeoJSON
const [departments, borders] = await Promise.all([
  fetch("departments.json").then(r => r.json()),
  fetch("borders.json").then(r => r.json())
]);

// Create projection
const proj = d3.geoIdentity().fitSize([width, height], borders);
const path = d3.geoPath(proj).context(ctx);

// Fill departments with random patterns
departments.features.forEach(feature => {
  const pattern = patterns[Math.floor(Math.random() * patterns.length)];
  ctx.fillStyle = pattern.context(ctx);
  path(feature);
  pattern.apply();
});

// Draw borders
ctx.strokeStyle = "black";
path(borders);
ctx.stroke();
```

## 🔧 Development

### Setup

```bash
pnpm install
```

### Local Demo

Start the interactive demo at http://localhost:5173:

```bash
pnpm dev
```

The demo includes:
- Pattern editor with live preview
- SVG and Canvas preview
- 6 example patterns
- Interactive controls for all options

### Build Library

```bash
pnpm run build
```

Outputs:
- `dist/motif.mjs` (ES Module)
- `dist/motif.js` (UMD)
- `dist/index.d.ts` (TypeScript declarations)

### Build Demo for Deploy

```bash
pnpm run build:demo
```

Outputs to `dist-demo/` for deployment to GitHub Pages or static hosting.

## 📚 Learn More

- **Observable Notebook**: [Full source and examples](https://observablehq.com/@ateliercartographie/motif)
- **Observable Plot**: [Plotting library documentation](https://observablehq.com/plot/)
- **D3.js**: [Data visualization library](https://d3js.org/)

## 🌐 Browser Support

- All modern browsers (Chrome, Firefox, Safari, Edge)
- Requires support for Canvas 2D context and SVG
- Uses OffscreenCanvas when available for better performance

## 📝 License

ISC License - © 2024-2026 Thomas Ansart

## 🙏 Credits

Original development as an Observable notebook by [Thomas Ansart](https://github.com/ateliercartographie) at [Atelier de Cartographie de Sciences Po](https://sciencespo.fr/).

---

Built with ❤️ for data visualization and cartography

