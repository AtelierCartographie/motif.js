<script lang="ts">
  import { highlight } from "../lib/shiki";

  let creationCode = `import { motif } from "motif.js";

// Create your pattern
const pattern = motif({ type: "circle", scale: 2, size: 30 });`;

  let svgCode = `<svg>
  \${pattern.defs.outerHTML}
  <rect x="0" width="100" height="50" fill="\${pattern.url}" />
</svg>`;

  let canvasCode = `// Pass the current canvas context
// and set the fill style
ctx.fillStyle = pattern.context(ctx);

// Draw what you need
ctx.moveTo(10, 10);
ctx.lineTo(100, 10);
// ...

// Apply your pattern, no need to do a ctx.fill()
pattern.apply();`;

  let highlightedCreation = $state("");
  let highlightedSvg = $state("");
  let highlightedCanvas = $state("");

  $effect(() => {
    highlight(creationCode, "javascript").then((html) => {
      highlightedCreation = html;
    });
    highlight(svgCode, "html").then((html) => {
      highlightedSvg = html;
    });
    highlight(canvasCode, "javascript").then((html) => {
      highlightedCanvas = html;
    });
  });
</script>

<section class="section">
  <h2 class="section-title">How to use</h2>
  <div class="howto-grid">
    <!-- Step 1: Create Pattern -->
    <div class="howto-step">
      <h3>1. Create your pattern</h3>
      <div class="code-block">
        {@html highlightedCreation}
      </div>
    </div>

    <!-- Step 2: Choose Environment -->
    <div class="howto-environments">
      <!-- SVG -->
      <div class="howto-step">
        <h3>In SVG environment</h3>
        <p>
          First insert <code>&lt;defs&gt;</code> tag with your pattern inside your
          SVG and apply your pattern by using its url.
        </p>
        <div class="code-block">
          {@html highlightedSvg}
        </div>
      </div>

      <!-- Canvas -->
      <div class="howto-step">
        <h3>In Canvas context</h3>
        <p>
          Pass the context to the pattern, use it as fillStyle, draw your shape
          and apply.
        </p>
        <div class="code-block">
          {@html highlightedCanvas}
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .howto-grid {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-top: 1.5rem;
  }

  .howto-environments {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: #1f2937;
  }

  p {
    margin-bottom: 1rem;
    color: #4b5563;
    line-height: 1.5;
  }

  code {
    background: #f3f4f6;
    padding: 0.2em 0.4em;
    border-radius: 4px;
    font-size: 0.9em;
    font-family: monospace;
  }

  .code-block {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
    background: #fff; /* fallback */
  }

  .code-block :global(pre) {
    margin: 0;
    padding: 1rem;
    font-size: 0.85rem;
    line-height: 1.6;
    overflow-x: auto;
  }

  @media (max-width: 768px) {
    .howto-environments {
      grid-template-columns: 1fr;
    }
  }
</style>
