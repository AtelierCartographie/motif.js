# Motif.js

A pattern generator that can be used in SVG environment or Canvas context.

## Features

- **Multiple pattern types**: line, plaid, circle, plus, cross, triangle, square, diamond, and custom
- **SVG support**: Generate SVG patterns for use in SVG documents
- **Canvas support**: Generate Canvas patterns with automatic DPI handling
- **Customizable**: Scale, size, angle, fill, stroke, and more
- **TypeScript**: Fully typed for better development experience

## Installation

```bash
pnpm add motif.js
```

Or with npm:

```bash
npm install motif.js
```

Or with yarn:

```bash
yarn add motif.js
```

## Usage

### Basic SVG Pattern

```typescript
import { motif } from 'motif.js';

const pattern = motif({
  type: 'circle',
  size: 30,
  fill: '#3b82f6',
  background: '#f0f0f0'
});

// Use in SVG
const svg = document.querySelector('svg');
svg.innerHTML = pattern.defs;
const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
rect.setAttribute('fill', pattern.url);
svg.appendChild(rect);
```

### Canvas Pattern

```typescript
import { motif } from 'motif.js';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const pattern = motif({
  type: 'line',
  size: 25,
  angle: 45,
  fill: '#000'
});

const canvasPattern = pattern.context(ctx);
ctx.fillStyle = canvasPattern;
ctx.fillRect(0, 0, canvas.width, canvas.height);
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `type` | string | `"line"` | Pattern type: "line", "plaid", "circle", "plus", "cross", "triangle", "square", "diamond", "custom" |
| `scale` | number | `1` | Scale of the tile |
| `size` | number | `20` | Shape size as a percentage of tile area (0-100) |
| `angle` | number | `0` | Rotation angle in degrees |
| `fill` | string | `"black"` | Fill color |
| `stroke` | string | `"transparent"` | Stroke color |
| `strokeWidth` | number | `0` | Line width of shape stroke in pixels |
| `dash` | number[] | `[]` | Dash pattern as in CSS |
| `background` | string | `"white"` | Background color of the pattern tile |
| `border` | number | `0` | Tile border width |
| `patchSize` | boolean | `false` | Patch the size to respect ratio between shape and tile area |
| `custom` | object | `undefined` | Custom shape configuration |
| `custom.shape` | function/string | - | Custom shape as SVG path function |
| `custom.patch` | number | `50` | Patch size for custom shape |

## Return Value

The `motif()` function returns an object with:

- `defs`: SVG defs element as string containing the pattern definition
- `url`: CSS url reference for the pattern (e.g., `url(#pattern-id-123)`)
- `context(ctx)`: Function to create a Canvas pattern from a CanvasRenderingContext2D
- `apply()`: Function to apply the pattern transformation to Canvas context

## Pattern Types

### line
Horizontal lines pattern

### plaid
Grid/plaid pattern

### circle
Circular dots pattern

### plus / cross
Plus sign pattern (cross is a 45° rotated variant)

### triangle
Triangular pattern

### square / diamond
Square pattern (diamond is a 45° rotated variant)

### custom
Define your own pattern shape

## Examples

### Colored Stripes

```typescript
import { motif } from 'motif.js';

const stripes = motif({
  type: 'line',
  size: 15,
  angle: 45,
  fill: '#ff6b6b',
  background: '#fff'
});
```

### Polka Dots

```typescript
const dots = motif({
  type: 'circle',
  size: 20,
  fill: '#4ecdc4',
  background: '#f7f7f7'
});
```

### Complex Grid

```typescript
const grid = motif({
  type: 'plaid',
  size: 30,
  fill: '#333',
  stroke: '#ddd',
  strokeWidth: 1,
  background: '#fff'
});
```

## Observable Plot Integration (Optional)

You can combine Motif.js with Observable Plot for advanced data visualization:

```bash
pnpm add @observablehq/plot
```

Then use patterns in your plots:

```typescript
import * as Plot from '@observablehq/plot';
import { motif } from 'motif.js';

const pattern = motif({
  type: 'circle',
  size: 25,
  fill: '#3b82f6'
});

const chart = Plot.plot({
  marks: [
    Plot.rect(data, {
      x: 'category',
      y: 'value',
      fill: pattern.url // Use pattern as fill
    })
  ]
});
```

## Browser Support

- All modern browsers (Chrome, Firefox, Safari, Edge)
- Requires support for Canvas 2D context and SVG
- Uses OffscreenCanvas when available for better performance

## Development

```bash
# Install dependencies
pnpm install

# Build the library
pnpm run build

# Build output
# - dist/motif.mjs (ES module)
# - dist/motif.js (UMD)
# - dist/index.d.ts (TypeScript declarations)
```

## License

MIT

## Author

Thomas Ansart

