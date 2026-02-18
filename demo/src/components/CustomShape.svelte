<script lang="ts">
  import { canvasPattern } from "../lib/canvasPattern";
  import { highlight } from "../lib/shiki";

  // Custom shape examples
  const starShape = (tile: number, shapeArea: number): string => {
    const r = Math.sqrt(shapeArea / Math.PI);
    const points = 5;
    let path = "";
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? r : r * 0.38;
      const a = (i * Math.PI) / points - Math.PI / 2;
      const x = Math.cos(a) * radius;
      const y = Math.sin(a) * radius;
      path += (i === 0 ? "M" : "L") + ` ${x} ${y} `;
    }
    return path + "Z";
  };

  const hexShape = (tile: number, shapeArea: number): string => {
    const s = Math.sqrt((2 * shapeArea) / (3 * Math.sqrt(3)));
    let path = "";
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3;
      const x = Math.cos(a) * s;
      const y = Math.sin(a) * s;
      path += (i === 0 ? "M" : "L") + ` ${x} ${y} `;
    }
    return path + "Z";
  };

  const starCode = `// Star shape
const star = (tile, shapeArea) => {
  const r = Math.sqrt(shapeArea / Math.PI);
  const points = 5;
  let path = "";
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? r : r * 0.38;
    const a = (i * Math.PI) / points - Math.PI / 2;
    const x = Math.cos(a) * radius;
    const y = Math.sin(a) * radius;
    path += (i === 0 ? "M" : "L") + \` \${x} \${y} \`;
  }
  return path + "Z";
};

const pattern = motif({
  type: "custom",
  custom: { shape: star },
  size: 35,
  fill: "#f59e0b",
  background: "#fffbeb",
});`;

  const hexCode = `// Hexagon shape
const hexagon = (tile, shapeArea) => {
  const s = Math.sqrt(
    (2 * shapeArea) / (3 * Math.sqrt(3))
  );
  let path = "";
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3;
    const x = Math.cos(a) * s;
    const y = Math.sin(a) * s;
    path += (i === 0 ? "M" : "L") + \` \${x} \${y} \`;
  }
  return path + "Z";
};

const pattern = motif({
  type: "custom",
  custom: { shape: hexagon },
  size: 40,
  fill: "#6366f1",
  background: "#eef2ff",
});`;

  const starOptions = {
    type: "custom",
    custom: { shape: starShape },
    size: 35,
    fill: "#f59e0b",
    background: "#fffbeb",
    scale: 2,
  };

  const hexOptions = {
    type: "custom",
    custom: { shape: hexShape },
    size: 40,
    fill: "#6366f1",
    background: "#eef2ff",
    scale: 2,
  };

  let starCodeHighlighted = $state("");
  let hexCodeHighlighted = $state("");

  // Highlight star code
  $effect(() => {
    highlight(starCode, "javascript").then((html) => {
      starCodeHighlighted = html;
    });
  });

  // Highlight hex code
  $effect(() => {
    highlight(hexCode, "javascript").then((html) => {
      hexCodeHighlighted = html;
    });
  });

  const starWidth = 280;
  const starHeight = 200;
  const hexWidth = 280;
  const hexHeight = 200;
</script>

<section id="custom" class="section">
  <div class="container">
    <h2 class="section-title">Custom Shape</h2>
    <p class="section-subtitle">Create your own shapes for unique patterns.</p>

    <!-- Rules -->
    <div class="rules-block">
      <h3>Rules to Follow</h3>
      <div class="rules-grid">
        <div class="rule">
          <div class="rule-num">1</div>
          <div>
            <strong>The function</strong> receives two arguments:
            <code>tile</code>
            (the tile size) and <code>shapeArea</code> (the target shape area in
            px²).
          </div>
        </div>
        <div class="rule">
          <div class="rule-num">2</div>
          <div>
            <strong>Return an SVG path</strong> (a string of type
            <code>d</code>
            for a <code>&lt;path&gt;</code> element). The path must be
            <strong>centered at the origin (0, 0)</strong>.
          </div>
        </div>
        <div class="rule">
          <div class="rule-num">3</div>
          <div>
            <strong>Respect <code>shapeArea</code></strong>: your shape's area
            must match
            <code>shapeArea</code> so that the <code>size</code> parameter works
            correctly.
          </div>
        </div>
        <div class="rule">
          <div class="rule-num">4</div>
          <div>
            <strong>Option <code>custom.patch</code></strong>: defines the
            threshold for <code>patchSize</code>. Default value: 50. Adjust if
            your shape overflows visually at large sizes.
          </div>
        </div>
      </div>
    </div>

    <!-- Examples -->
    <div class="examples-grid">
      <div class="example-card">
        <div class="example-preview">
          <canvas
            width={starWidth}
            height={starHeight}
            use:canvasPattern={{
              options: starOptions,
              width: starWidth,
              height: starHeight,
            }}
          ></canvas>
        </div>
        <div class="example-code">
          <div class="code-block-wrapper">{@html starCodeHighlighted}</div>
        </div>
      </div>

      <div class="example-card">
        <div class="example-preview">
          <canvas
            width={hexWidth}
            height={hexHeight}
            use:canvasPattern={{
              options: hexOptions,
              width: hexWidth,
              height: hexHeight,
            }}
          ></canvas>
        </div>
        <div class="example-code">
          <div class="code-block-wrapper">{@html hexCodeHighlighted}</div>
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

  .rules-block h3 {
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 1.25rem;
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
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }

  .example-card {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
  }

  .example-preview {
    background: #fff;
    display: flex;
    justify-content: center;
    padding: 1rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .example-preview canvas {
    display: block;
    border-radius: 4px;
    width: 100%;
    height: auto;
  }

  .example-code {
    overflow: hidden;
  }

  .code-block-wrapper {
    overflow-y: auto;
    max-height: 320px;
  }

  .code-block-wrapper :global(pre) {
    margin: 0;
    font-size: 0.78rem;
  }

  @media (max-width: 768px) {
    .rules-grid,
    .examples-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
