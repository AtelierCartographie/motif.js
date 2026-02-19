<script lang="ts">
  import { canvasPattern } from "../lib/canvasPattern";
  import { highlight } from "../lib/shiki";

  // ---- Square shape ----
  const squareShapeSVG = (tile: number, shapeArea: number): string => {
    const side = Math.sqrt(shapeArea);
    return `M ${-side / 2} ${-side / 2}
            h ${side} v ${side} h ${-side}
            Z`;
  };

  // ---- Wye shape ----
  const wyeShapeSVG = (tile: number, shapeArea: number): string => {
    const c = -0.5;
    const s = Math.sqrt(3) / 2;
    const k = 1 / Math.sqrt(12);
    const a = (k / 2 + 1) * 3;
    const r = Math.sqrt(shapeArea / a);
    const x0 = r / 2,
      y0 = r * k;
    const x1 = x0,
      y1 = r * k + r;
    const x2 = -x1,
      y2 = y1;
    return `M ${x0} ${y0}
            L ${x1} ${y1}
            L ${x2} ${y2}
            L ${c * x0 - s * y0} ${s * x0 + c * y0}
            L ${c * x1 - s * y1} ${s * x1 + c * y1}
            L ${c * x2 - s * y2} ${s * x2 + c * y2}
            L ${c * x0 + s * y0} ${c * y0 - s * x0}
            L ${c * x1 + s * y1} ${c * y1 - s * x1}
            L ${c * x2 + s * y2} ${c * y2 - s * x2}
            Z`;
  };

  // ---- Options for preview ----
  const squareOptions = {
    type: "custom",
    custom: { shape: squareShapeSVG },
    size: 40,
    fill: "#1e293b",
    background: "#f8fafc",
    scale: 2,
  };

  const wyeOptions = {
    type: "custom",
    custom: { shape: wyeShapeSVG },
    size: 40,
    fill: "#6366f1",
    background: "#eef2ff",
    scale: 2,
  };

  // ---- Code strings ----
  const squareSvgCode = `function squareShapeSVG(tile, shapeArea) {
  // Derive side length from target area
  const side = Math.sqrt(shapeArea);

  // Origin (0,0) is at the center of the tile
  return \`M \${-side / 2} \${-side / 2}
          h \${side} v \${side} h \${-side}
          Z\`;
}

const pattern = motif({
  type: "custom",
  custom: { shape: squareShapeSVG },
  size: 40,
  fill: "#1e293b",
  background: "#f8fafc",
});`;

  const squareCanvasCode = `function squareShapeCanvas(tile, shapeArea, context) {
  // Derive side length from target area
  const side = Math.sqrt(shapeArea);

  // context is replaced by d3.path() internally,
  // use standard Canvas path methods
  context.rect(-side / 2, -side / 2, side, side);

  return context;
}

const pattern = motif({
  type: "custom",
  custom: { shape: squareShapeCanvas },
  size: 40,
  fill: "#1e293b",
  background: "#f8fafc",
});`;

  const wyeSvgCode = `function wyeShapeSVG(tile, shapeArea) {
  // Borrowed from d3-shape
  // https://github.com/d3/d3-shape/blob/main/src/symbol/wye.js
  const c = -0.5, s = Math.sqrt(3) / 2;
  const k = 1 / Math.sqrt(12);
  const a = (k / 2 + 1) * 3;
  const r = Math.sqrt(shapeArea / a);
  const x0 = r / 2, y0 = r * k;
  const x1 = x0, y1 = r * k + r;
  const x2 = -x1, y2 = y1;

  return \`M \${x0} \${y0}
          L \${x1} \${y1}
          L \${x2} \${y2}
          L \${c * x0 - s * y0} \${s * x0 + c * y0}
          L \${c * x1 - s * y1} \${s * x1 + c * y1}
          L \${c * x2 - s * y2} \${s * x2 + c * y2}
          L \${c * x0 + s * y0} \${c * y0 - s * x0}
          L \${c * x1 + s * y1} \${c * y1 - s * x1}
          L \${c * x2 + s * y2} \${c * y2 - s * x2}
          Z\`;
}

const pattern = motif({
  type: "custom",
  custom: { shape: wyeShapeSVG },
  size: 40,
  fill: "#6366f1",
  background: "#eef2ff",
});`;

  const wyeCanvasCode = `function wyeShapeCanvas(tile, shapeArea, context) {
  // Borrowed from d3-shape
  // https://github.com/d3/d3-shape/blob/main/src/symbol/wye.js
  const c = -0.5, s = Math.sqrt(3) / 2;
  const k = 1 / Math.sqrt(12);
  const a = (k / 2 + 1) * 3;
  const r = Math.sqrt(shapeArea / a);
  const x0 = r / 2, y0 = r * k;
  const x1 = x0, y1 = r * k + r;
  const x2 = -x1, y2 = y1;

  // context is replaced by d3.path() internally
  context.moveTo(x0, y0);
  context.lineTo(x1, y1);
  context.lineTo(x2, y2);
  context.lineTo(c * x0 - s * y0, s * x0 + c * y0);
  context.lineTo(c * x1 - s * y1, s * x1 + c * y1);
  context.lineTo(c * x2 - s * y2, s * x2 + c * y2);
  context.lineTo(c * x0 + s * y0, c * y0 - s * x0);
  context.lineTo(c * x1 + s * y1, c * y1 - s * x1);
  context.lineTo(c * x2 + s * y2, c * y2 - s * x2);
  context.closePath();

  return context;
}

const pattern = motif({
  type: "custom",
  custom: { shape: wyeShapeCanvas },
  size: 40,
  fill: "#6366f1",
  background: "#eef2ff",
});`;

  // ---- Highlighted code state ----
  let squareSvgHighlighted = $state("");
  let squareCanvasHighlighted = $state("");
  let wyeSvgHighlighted = $state("");
  let wyeCanvasHighlighted = $state("");

  $effect(() => {
    highlight(squareSvgCode, "javascript").then(
      (h) => (squareSvgHighlighted = h),
    );
    highlight(squareCanvasCode, "javascript").then(
      (h) => (squareCanvasHighlighted = h),
    );
    highlight(wyeSvgCode, "javascript").then((h) => (wyeSvgHighlighted = h));
    highlight(wyeCanvasCode, "javascript").then(
      (h) => (wyeCanvasHighlighted = h),
    );
  });

  // ---- Tab state ----
  let squareTab = $state<"svg" | "canvas">("svg");
  let wyeTab = $state<"svg" | "canvas">("svg");

  const previewSize = 200;
</script>

<section id="custom" class="section">
  <div class="container">
    <h2 class="section-title">Custom Shape</h2>
    <p class="section-subtitle">
      Define your own shapes with an SVG path string or Canvas path methods.
    </p>

    <!-- Rules -->
    <div class="rules-block">
      <div class="rules-grid">
        <div class="rule">
          <div class="rule-num">1</div>
          <div>
            <strong>The function</strong> accepts 2 or 3 arguments:
            <code>tile</code>
            (tile size), <code>shapeArea</code> (target area in px²), and
            optionally
            <code>context</code> (for the Canvas approach).
          </div>
        </div>
        <div class="rule">
          <div class="rule-num">2</div>
          <div>
            <strong>SVG approach</strong> (2 args): return an SVG path string (<code
              >d</code
            >
            attribute). <strong>Canvas approach</strong> (3 args): use Canvas
            path methods on
            <code>context</code> — replaced internally by <code>d3.path()</code>
            to produce the SVG string.
          </div>
        </div>
        <div class="rule">
          <div class="rule-num">3</div>
          <div>
            <strong>Respect <code>shapeArea</code></strong>: your shape's area
            must match
            <code>shapeArea</code> so that the <code>size</code> parameter works
            correctly. <strong>Origin (0,0) is at the center</strong> of the tile,
            y axis points down.
          </div>
        </div>
        <div class="rule">
          <div class="rule-num">4</div>
          <div>
            <strong>Option <code>custom.patch</code></strong>: threshold for
            <code>patchSize</code>. Default: <code>50</code>. Adjust if your
            shape overflows visually at large sizes.
          </div>
        </div>
      </div>
    </div>

    <!-- Examples -->
    <div class="examples-grid">
      <!-- Square -->
      <div class="example-card">
        <div class="example-header">
          <span class="example-title">Square</span>
          <span class="example-note"
            >Same shape as the built-in <code>square</code> type</span
          >
        </div>
        <div class="example-body">
          <div class="example-preview">
            <canvas
              width={previewSize}
              height={previewSize}
              use:canvasPattern={{
                options: squareOptions,
                width: previewSize,
                height: previewSize,
              }}
            ></canvas>
          </div>
          <div class="example-code">
            <div class="code-tabs">
              <button
                class="code-tab"
                class:active={squareTab === "svg"}
                onclick={() => (squareTab = "svg")}>SVG</button
              >
              <button
                class="code-tab"
                class:active={squareTab === "canvas"}
                onclick={() => (squareTab = "canvas")}>Canvas</button
              >
            </div>
            <div class="code-block-wrapper">
              {#if squareTab === "svg"}
                {@html squareSvgHighlighted}
              {:else}
                {@html squareCanvasHighlighted}
              {/if}
            </div>
          </div>
        </div>
      </div>

      <!-- Wye -->
      <div class="example-card">
        <div class="example-header">
          <span class="example-title">Wye (Y-shape)</span>
          <span class="example-note"
            >Borrowed from <a
              href="https://github.com/d3/d3-shape/blob/main/src/symbol/wye.js"
              target="_blank"
              rel="noopener">d3-shape</a
            ></span
          >
        </div>
        <div class="example-body">
          <div class="example-preview">
            <canvas
              width={previewSize}
              height={previewSize}
              use:canvasPattern={{
                options: wyeOptions,
                width: previewSize,
                height: previewSize,
              }}
            ></canvas>
          </div>
          <div class="example-code">
            <div class="code-tabs">
              <button
                class="code-tab"
                class:active={wyeTab === "svg"}
                onclick={() => (wyeTab = "svg")}>SVG</button
              >
              <button
                class="code-tab"
                class:active={wyeTab === "canvas"}
                onclick={() => (wyeTab = "canvas")}>Canvas</button
              >
            </div>
            <div class="code-block-wrapper">
              {#if wyeTab === "svg"}
                {@html wyeSvgHighlighted}
              {:else}
                {@html wyeCanvasHighlighted}
              {/if}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  /* ---- Rules ---- */
  .rules-block {
    margin-bottom: 3rem;
  }

  .rules-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .rule {
    display: flex;
    gap: 0.75rem;
    padding: 1rem 1.25rem;
    background: #f3f4f6;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    font-size: 0.9rem;
    line-height: 1.6;
  }

  .rule strong {
    font-weight: 600;
  }

  .rule code {
    background: white;
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-family: "Courier New", monospace;
    font-size: 0.85em;
  }

  .rule-num {
    flex-shrink: 0;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #1a1a1a;
    color: white;
    border-radius: 50%;
    font-size: 0.8rem;
    font-weight: 700;
  }

  /* ---- Examples ---- */
  .examples-grid {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .example-card {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
  }

  .example-header {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
    padding: 0.75rem 1.25rem;
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
  }

  .example-title {
    font-size: 0.95rem;
    font-weight: 700;
  }

  .example-note {
    font-size: 0.8rem;
    opacity: 0.6;
  }

  .example-note a {
    color: inherit;
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  .example-note code {
    background: #e5e7eb;
    padding: 0.1rem 0.35rem;
    border-radius: 3px;
    font-family: "Courier New", monospace;
    font-size: 0.85em;
  }

  .example-body {
    display: grid;
    grid-template-columns: 200px 1fr;
  }

  .example-preview {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    border-right: 1px solid #e5e7eb;
    background: #fff;
  }

  .example-preview canvas {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 4px;
  }

  /* ---- Code tabs ---- */
  .example-code {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .code-tabs {
    display: flex;
    border-bottom: 1px solid #e5e7eb;
    background: #f9fafb;
  }

  .code-tab {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
    font-weight: 500;
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    opacity: 0.6;
    transition: all 0.2s;
    font: inherit;
  }

  .code-tab:hover {
    opacity: 0.85;
  }

  .code-tab.active {
    opacity: 1;
    border-bottom-color: #1a1a1a;
  }

  .code-block-wrapper {
    overflow-y: auto;
    max-height: 340px;
  }

  .code-block-wrapper :global(pre) {
    margin: 0;
    font-size: 0.78rem;
    line-height: 1.65;
  }

  @media (max-width: 768px) {
    .rules-grid {
      grid-template-columns: 1fr;
    }

    .example-body {
      grid-template-columns: 1fr;
    }

    .example-preview {
      border-right: none;
      border-bottom: 1px solid #e5e7eb;
    }

    .example-preview canvas {
      max-width: 200px;
    }
  }
</style>
