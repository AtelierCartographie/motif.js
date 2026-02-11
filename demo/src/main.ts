import "../src/style.css";
import { motif, type PatternOptions } from "./motif";

// Setup the demo app
const app = document.getElementById("app");
if (!app) throw new Error("Could not find app container");

app.innerHTML = `
  <header class="header">
    <div class="container">
      <h1>Motif.js</h1>
      <p class="subtitle">A pattern generator for SVG and Canvas</p>
      <p class="description">
        Create beautiful, customizable patterns for data visualization and design.
        Use in SVG documents, Canvas contexts, or Observable Plot charts.
      </p>
      <div class="links">
        <a href="https://observablehq.com/@ateliercartographie/motif" target="_blank">Observable Notebook</a>
        <a href="https://github.com/ateliercartographie/motif.js" target="_blank">GitHub</a>
      </div>
    </div>
  </header>

  <main class="container">
    <section class="demo-section">
      <h2>Interactive Pattern Editor</h2>
      <div class="demo-grid">
        <div class="controls-panel">
          <div class="control-group">
            <label for="type-select">Pattern Type</label>
            <select id="type-select">
              <option value="line">Line</option>
              <option value="plaid">Plaid</option>
              <option value="circle">Circle</option>
              <option value="plus">Plus</option>
              <option value="cross">Cross</option>
              <option value="triangle">Triangle</option>
              <option value="square">Square</option>
              <option value="diamond">Diamond</option>
            </select>
          </div>

          <div class="control-group">
            <label for="size-slider">Size: <span id="size-value">20</span>%</label>
            <input type="range" id="size-slider" min="1" max="100" value="20" />
          </div>

          <div class="control-group">
            <label for="scale-slider">Scale: <span id="scale-value">1</span></label>
            <input type="range" id="scale-slider" min="0.5" max="3" step="0.5" value="1" />
          </div>

          <div class="control-group">
            <label for="angle-slider">Angle: <span id="angle-value">0</span>°</label>
            <input type="range" id="angle-slider" min="0" max="360" step="15" value="0" />
          </div>

          <div class="control-group">
            <label for="fill-color">Fill Color</label>
            <input type="color" id="fill-color" value="#000000" />
          </div>

          <div class="control-group">
            <label for="stroke-color">Stroke Color</label>
            <input type="color" id="stroke-color" value="#ff0000" />
          </div>

          <div class="control-group">
            <label for="stroke-width">Stroke Width: <span id="stroke-value">0</span>px</label>
            <input type="range" id="stroke-width" min="0" max="10" step="0.5" value="0" />
          </div>

          <div class="control-group">
            <label for="bg-color">Background</label>
            <input type="color" id="bg-color" value="#ffffff" />
          </div>
        </div>

        <div class="preview-panel">
          <div class="preview-tabs">
            <button class="tab-btn active" data-tab="svg">SVG</button>
            <button class="tab-btn" data-tab="canvas">Canvas</button>
          </div>
          
          <div class="tab-content active" id="svg-preview">
            <svg id="svg-sample" width="400" height="300" style="border: 1px solid #ddd; background: white;"></svg>
          </div>
          
          <div class="tab-content" id="canvas-preview">
            <canvas id="canvas-sample" width="400" height="300" style="border: 1px solid #ddd; background: white;"></canvas>
          </div>
        </div>
      </div>
    </section>

    <section class="examples-section">
      <h2>Examples</h2>
      
      <div class="example-grid">
        <div class="example-card">
          <h3>Colored Stripes</h3>
          <svg id="example-stripes" width="100%" height="200" style="border: 1px solid #ddd;"></svg>
          <code>type: 'line', angle: 45, fill: '#ff6b6b'</code>
        </div>

        <div class="example-card">
          <h3>Polka Dots</h3>
          <svg id="example-dots" width="100%" height="200" style="border: 1px solid #ddd;"></svg>
          <code>type: 'circle', size: 25, fill: '#4ecdc4'</code>
        </div>

        <div class="example-card">
          <h3>Grid Pattern</h3>
          <svg id="example-grid" width="100%" height="200" style="border: 1px solid #ddd;"></svg>
          <code>type: 'plaid', fill: '#333', stroke: '#ddd'</code>
        </div>

        <div class="example-card">
          <h3>Plus Signs</h3>
          <svg id="example-plus" width="100%" height="200" style="border: 1px solid #ddd;"></svg>
          <code>type: 'plus', size: 30, fill: '#8b5cf6'</code>
        </div>

        <div class="example-card">
          <h3>Triangles</h3>
          <svg id="example-triangles" width="100%" height="200" style="border: 1px solid #ddd;"></svg>
          <code>type: 'triangle', angle: 30, fill: '#f59e0b'</code>
        </div>

        <div class="example-card">
          <h3>Cross Pattern</h3>
          <svg id="example-cross" width="100%" height="200" style="border: 1px solid #ddd;"></svg>
          <code>type: 'cross', size: 20, fill: '#06b6d4'</code>
        </div>
      </div>
    </section>

    <section class="info-section">
      <h2>Features</h2>
      <ul class="features-list">
        <li><strong>8 Built-in Patterns:</strong> line, plaid, circle, plus, cross, triangle, square, diamond</li>
        <li><strong>SVG Support:</strong> Generate SVG patterns for scalable graphics</li>
        <li><strong>Canvas Support:</strong> Generate Canvas patterns with automatic DPI handling</li>
        <li><strong>Full Customization:</strong> Control size, scale, angle, colors, and more</li>
        <li><strong>TypeScript:</strong> Fully typed for excellent developer experience</li>
        <li><strong>Observable Plot Integration:</strong> Use patterns in data visualizations</li>
        <li><strong>Custom Shapes:</strong> Define your own pattern shapes</li>
      </ul>

      <h2>Usage</h2>
      <pre><code>import { motif } from 'motif.js';

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

// Use in Canvas
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const canvasPattern = pattern.context(ctx);
ctx.fillStyle = canvasPattern;
ctx.fillRect(0, 0, canvas.width, canvas.height);
pattern.apply();</code></pre>
    </section>
  </main>

  <footer class="footer">
    <div class="container">
      <p>&copy; 2024-2026 Thomas Ansart. Licensed under ISC.</p>
      <p>
        <a href="https://github.com/ateliercartographie/motif.js">GitHub</a> •
        <a href="https://observablehq.com/@ateliercartographie/motif">Observable</a>
      </p>
    </div>
  </footer>
`;

// State for the current pattern
let currentOptions: PatternOptions = {
  type: "line",
  size: 20,
  scale: 1,
  angle: 0,
  fill: "#000000",
  stroke: "#ff0000",
  strokeWidth: 0,
  background: "#ffffff"
};

// Update preview when controls change
function updatePreview() {
  // Re-import motif to use the updated library
  const pattern = motif(currentOptions);

  // SVG Preview
  const svgSample = document.getElementById("svg-sample") as SVGSVGElement;
  if (svgSample) {
    svgSample.innerHTML = `
      ${pattern.defs}
      <rect x="0" y="0" width="400" height="300" fill="${pattern.url}" />
    `;
  }

  // Canvas Preview
  const canvasSample = document.getElementById("canvas-sample") as HTMLCanvasElement;
  if (canvasSample) {
    const ctx = canvasSample.getContext("2d");
    if (ctx) {
      ctx.fillStyle = currentOptions.background || "#ffffff";
      ctx.fillRect(0, 0, 400, 300);

      const canvasPattern = pattern.context(ctx);
      ctx.fillStyle = canvasPattern;
      ctx.fillRect(0, 0, 400, 300);
      pattern.apply();
    }
  }
}

// Setup event listeners
document.getElementById("type-select")?.addEventListener("change", (e) => {
  currentOptions.type = (e.target as HTMLSelectElement).value as any;
  updatePreview();
});

document.getElementById("size-slider")?.addEventListener("input", (e) => {
  const value = parseInt((e.target as HTMLInputElement).value);
  currentOptions.size = value;
  document.getElementById("size-value")!.textContent = value.toString();
  updatePreview();
});

document.getElementById("scale-slider")?.addEventListener("input", (e) => {
  const value = parseFloat((e.target as HTMLInputElement).value);
  currentOptions.scale = value;
  document.getElementById("scale-value")!.textContent = value.toFixed(1);
  updatePreview();
});

document.getElementById("angle-slider")?.addEventListener("input", (e) => {
  const value = parseInt((e.target as HTMLInputElement).value);
  currentOptions.angle = value;
  document.getElementById("angle-value")!.textContent = value.toString();
  updatePreview();
});

document.getElementById("fill-color")?.addEventListener("input", (e) => {
  currentOptions.fill = (e.target as HTMLInputElement).value;
  updatePreview();
});

document.getElementById("stroke-color")?.addEventListener("input", (e) => {
  currentOptions.stroke = (e.target as HTMLInputElement).value;
  updatePreview();
});

document.getElementById("stroke-width")?.addEventListener("input", (e) => {
  const value = parseFloat((e.target as HTMLInputElement).value);
  currentOptions.strokeWidth = value;
  document.getElementById("stroke-value")!.textContent = value.toFixed(1);
  updatePreview();
});

document.getElementById("bg-color")?.addEventListener("input", (e) => {
  currentOptions.background = (e.target as HTMLInputElement).value;
  updatePreview();
});

// Tab switching
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const tabName = (e.target as HTMLElement).dataset.tab;
    document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"));
    (e.target as HTMLElement).classList.add("active");
    document.getElementById(`${tabName}-preview`)?.classList.add("active");
  });
});

// Generate examples
function generateExample(elementId: string, options: PatternOptions) {
  const svg = document.getElementById(elementId) as SVGSVGElement;
  if (svg) {
    const pattern = motif(options);
    svg.innerHTML = `
      ${pattern.defs}
      <rect x="0" y="0" width="100%" height="100%" fill="${pattern.url}" />
    `;
  }
}

generateExample("example-stripes", {
  type: "line",
  angle: 45,
  fill: "#ff6b6b",
  background: "#fff1f2"
});

generateExample("example-dots", {
  type: "circle",
  size: 25,
  fill: "#4ecdc4",
  background: "#ecf9f7"
});

generateExample("example-grid", {
  type: "plaid",
  size: 25,
  fill: "#333",
  stroke: "#ddd",
  strokeWidth: 1,
  background: "#f5f5f5"
});

generateExample("example-plus", {
  type: "plus",
  size: 30,
  fill: "#8b5cf6",
  background: "#f5f3ff"
});

generateExample("example-triangles", {
  type: "triangle",
  angle: 30,
  fill: "#f59e0b",
  background: "#fffbeb"
});

generateExample("example-cross", {
  type: "cross",
  size: 20,
  fill: "#06b6d4",
  background: "#ecfdf5"
});

// Initial preview
updatePreview();
