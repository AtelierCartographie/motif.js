# Development Guide

This guide explains how to contribute to and work with the Motif.js project.

## Project Structure

```
motif.js/
├── src/                    # Library source code
│   ├── motif.ts           # Main pattern generator function
│   └── index.ts           # Library exports
├── demo/                  # Interactive demo application
│   ├── index.html         # Demo HTML entry point
│   └── src/
│       ├── main.ts        # Demo UI and controls
│       ├── style.css      # Demo styling
│       ├── motif.ts       # Copy of library for demo
│       └── index.ts       # Copy of library exports
├── .github/
│   └── workflows/
│       └── deploy-demo.yml # GitHub Actions deployment
├── dist/                  # Built library (generated)
├── dist-demo/             # Built demo (generated)
├── LICENSE                # ISC License
├── README.md              # Main documentation
├── package.json           # Project metadata
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

## Commands

### Development

**Start the interactive demo server:**
```bash
pnpm dev
```

Opens http://localhost:5173 with hot module reloading enabled.

### Building

**Build the library:**
```bash
pnpm run build
```

Outputs:
- `dist/motif.mjs` - ES Module (modern browsers, bundlers)
- `dist/motif.js` - UMD (browsers, Node.js)
- `dist/index.d.ts` - TypeScript type definitions

**Build the demo for deployment:**
```bash
pnpm run build:demo
```

Outputs:
- `dist-demo/` - Static site ready for GitHub Pages

## How the Project Works

### Library Mode (src/)

The library exports a single function `motif()` that generates patterns. It works in:
- **SVG**: Generates pattern definitions that can be used with `<pattern>` elements
- **Canvas**: Generates patterns for Canvas 2D rendering contexts

Key files:
- `src/motif.ts` - Core pattern generation logic
- `src/index.ts` - Public API exports

### Demo Mode (demo/)

An interactive web application that showcases the library with:
- Pattern editor with real-time preview
- Live controls for all options
- Side-by-side SVG and Canvas previews
- 6 example patterns

The demo imports from a local copy of the library files (`demo/src/motif.ts`).

## Dual Build Configuration

`vite.config.ts` intelligently handles two different build modes:

1. **Library Build** (`pnpm run build`):
   - Targets `src/index.ts`
   - Generates ESM and UMD formats
   - Produces TypeScript declarations

2. **Demo Build** (`pnpm run build:demo`):
   - Targets `demo/index.html`
   - Generates a standalone HTML/JS/CSS bundle
   - Outputs to `dist-demo/`

## Making Changes to the Library

1. Edit files in `src/`
2. Run `pnpm dev` to test in the demo
3. Run `pnpm run build` to create distribution files
4. Commit your changes

### Syncing Changes to Demo

When you update `src/motif.ts` or `src/index.ts`, you should also update the copies in `demo/src/`:

```bash
cp src/motif.ts src/index.ts demo/src/
```

This ensures the demo always uses the latest code.

## Adding New Patterns

To add a new pattern type:

1. Create a shape function in `src/motif.ts`:
   ```typescript
   function myPattern(t: number, shapeArea: number): string {
     // Calculate shape dimensions
     const size = Math.sqrt(shapeArea);
     // Return SVG path
     return `M ${-size/2} ${-size/2} h ${size} v ${size} h ${-size} Z`;
   }
   ```

2. Add it to the `shapePath` Map:
   ```typescript
   shapePath.set("mypattern", myPattern);
   ```

3. Update the TypeScript type in the interface:
   ```typescript
   type: "line" | "plaid" | /* ... */ | "mypattern"
   ```

4. Sync to demo:
   ```bash
   cp src/motif.ts demo/src/
   ```

5. Test in demo with `pnpm dev`

## Testing Patterns

Use the interactive demo to test new patterns:

```bash
pnpm dev
```

Then use the pattern editor to:
- Select your new pattern type
- Adjust size, scale, angle, colors
- Preview in both SVG and Canvas
- See real-time updates

## Publishing to npm

1. Update version in `package.json`
2. Update `CHANGELOG.md` (if you have one)
3. Build library: `pnpm run build`
4. Publish: `npm publish`

## Deployment

The demo is automatically deployed to GitHub Pages via GitHub Actions when you push to the `main` branch.

To manually deploy:

```bash
pnpm run build:demo
# Then commit and push dist-demo/ or configure your hosting
```

## Debugging

### Library Issues

- Check TypeScript compilation: `pnpm run build`
- Test with demo: `pnpm dev`
- Check browser console for errors

### Demo Issues

- Check network tab for failed resources
- Use browser DevTools to inspect the canvas/SVG
- Check that pattern definitions are rendering correctly

## Code Style

The project uses TypeScript with strict type checking. Keep the code:
- Well-typed with proper interfaces
- Clear and documented with JSDoc comments
- Consistent with the existing style
- Properly formatted (consider using Prettier)

## Resources

- [Observable Notebook](https://observablehq.com/@ateliercartographie/motif) - Original implementation
- [MDN: SVG Patterns](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/pattern)
- [MDN: Canvas Patterns](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createPattern)
- [Observable Plot](https://observablehq.com/plot/)
- [D3.js](https://d3js.org/) - For geographic data visualization

## Questions?

See the main [README.md](./README.md) or check the Observable notebook for detailed examples and explanations.
