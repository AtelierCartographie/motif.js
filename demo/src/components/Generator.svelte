<script lang="ts">
  import { type PatternType } from "motif.js";
  import { canvasPattern } from "../lib/canvasPattern";
  import { presets } from "../lib/presets";
  import { highlight } from "../lib/shiki";

  // State
  let type: PatternType = $state("circle");
  let size = $state(25);
  let scale = $state(1);
  let angle = $state(0);
  let fill = $state("#1e293b");
  let stroke = $state("#000000");
  let strokeWidth = $state(0);
  let dashInput = $state("");
  let background = $state("#ffffff");
  let border = $state(0);
  let patchSize = $state(false);
  let highlightedCode = $state("");

  const patternTypes: PatternType[] = [
    "line",
    "plaid",
    "circle",
    "plus",
    "cross",
    "triangle",
    "square",
    "diamond",
  ];

  let dash = $derived(
    dashInput
      .split(",")
      .map((s) => parseFloat(s.trim()))
      .filter((n) => !isNaN(n) && n > 0),
  );

  let options = $derived({
    type,
    size,
    scale,
    angle,
    fill,
    stroke,
    strokeWidth,
    dash,
    background,
    border,
    patchSize,
  });

  // Generate code string (only non-default values)
  let codeString = $derived.by(() => {
    const lines: string[] = [];
    lines.push(`import { motif } from "motif.js";`);
    lines.push(``);
    lines.push(`const pattern = motif({`);
    if (type !== "line") lines.push(`  type: "${type}",`);
    if (size !== 20) lines.push(`  size: ${size},`);
    if (scale !== 1) lines.push(`  scale: ${scale},`);
    if (angle !== 0) lines.push(`  angle: ${angle},`);
    if (fill !== "black") lines.push(`  fill: "${fill}",`);
    if (background !== "white" && background !== "#ffffff")
      lines.push(`  background: "${background}",`);
    if (stroke !== "transparent" && stroke !== "#000000" && strokeWidth > 0)
      lines.push(`  stroke: "${stroke}",`);
    if (strokeWidth > 0) lines.push(`  strokeWidth: ${strokeWidth},`);
    if (dash.length > 0) lines.push(`  dash: [${dash.join(", ")}],`);
    if (border > 0) lines.push(`  border: ${border},`);
    if (patchSize) lines.push(`  patchSize: true,`);
    lines.push(`});`);
    return lines.join("\n");
  });

  // Highlight code when it changes
  $effect(() => {
    const code = codeString;
    highlight(code, "javascript").then((html) => {
      highlightedCode = html;
    });
  });

  // Render preview
  let previewWidth = $state(0);
  let previewHeight = $state(0);

  function loadPreset(idx: number) {
    const p = presets[idx].options;
    type = p.type ?? "line";
    size = p.size ?? 20;
    scale = p.scale ?? 1;
    angle = p.angle ?? 0;
    fill = p.fill ?? "#000000";
    background = p.background ?? "#ffffff";
    stroke = p.stroke ?? "#000000";
    strokeWidth = p.strokeWidth ?? 0;
    dashInput = (p.dash ?? []).join(", ");
    border = p.border ?? 0;
    patchSize = p.patchSize ?? false;
  }
</script>

<section id="generator" class="section">
  <h2 class="section-title">Interactive Generator</h2>
  <p class="section-subtitle">
    Explore all parameters and build your ideal pattern.
  </p>

  <div class="gen-layout">
    <!-- LEFT: Controls -->
    <div class="gen-controls">
      <div class="control-group">
        <label for="gen-type">Type</label>
        <select id="gen-type" bind:value={type}>
          {#each patternTypes as t}
            <option value={t}>{t}</option>
          {/each}
        </select>
      </div>

      <div class="control-group">
        <label for="gen-size">Size <span class="value">{size}%</span></label>
        <input
          id="gen-size"
          type="range"
          min="1"
          max="100"
          step="1"
          bind:value={size}
        />
      </div>

      <div class="control-group">
        <label for="gen-scale">Scale <span class="value">{scale}</span></label>
        <input
          id="gen-scale"
          type="range"
          min="0.25"
          max="5"
          step="0.25"
          bind:value={scale}
        />
      </div>

      <div class="control-group">
        <label for="gen-angle">Angle <span class="value">{angle}°</span></label>
        <input
          id="gen-angle"
          type="range"
          min="0"
          max="360"
          step="1"
          bind:value={angle}
        />
      </div>

      <div class="control-row">
        <div class="control-group">
          <label for="gen-fill">Fill</label>
          <input id="gen-fill" type="color" bind:value={fill} />
        </div>
        <div class="control-group">
          <label for="gen-bg">Background</label>
          <input id="gen-bg" type="color" bind:value={background} />
        </div>
      </div>

      <div class="control-row">
        <div class="control-group">
          <label for="gen-stroke">Stroke</label>
          <input id="gen-stroke" type="color" bind:value={stroke} />
        </div>
        <div class="control-group">
          <label for="gen-sw"
            >Stroke W. <span class="value">{strokeWidth}</span></label
          >
          <input
            id="gen-sw"
            type="range"
            min="0"
            max="5"
            step="0.5"
            bind:value={strokeWidth}
          />
        </div>
      </div>

      <div class="control-group">
        <label for="gen-dash"
          >Dash <span class="value-light">(ex: 5, 3)</span></label
        >
        <input
          id="gen-dash"
          type="text"
          bind:value={dashInput}
          placeholder="5, 3"
        />
      </div>

      <div class="control-group">
        <label for="gen-border"
          >Border <span class="value">{border}</span></label
        >
        <input
          id="gen-border"
          type="range"
          min="0"
          max="3"
          step="0.5"
          bind:value={border}
        />
      </div>

      <div class="control-group toggle-row">
        <input id="gen-patch" type="checkbox" bind:checked={patchSize} />
        <label for="gen-patch" class="toggle-label">patchSize</label>
      </div>
    </div>

    <!-- CENTER: Preview + Code -->
    <div class="gen-center">
      <div
        class="preview-wrapper"
        bind:clientWidth={previewWidth}
        bind:clientHeight={previewHeight}
      >
        <canvas
          use:canvasPattern={{
            options,
            width: previewWidth,
            height: previewHeight,
            showError: true,
          }}
        ></canvas>
      </div>
      <div class="code-output">
        <div class="code-header">
          <span>Code</span>
        </div>
        <div class="code-block-wrapper">{@html highlightedCode}</div>
      </div>
    </div>

    <!-- RIGHT: Gallery -->
    <div class="gen-gallery">
      <div class="gallery-label">Examples</div>
      <div class="gallery-grid">
        {#each presets as preset, i}
          <button
            class="gallery-item"
            onclick={() => loadPreset(i)}
            title={preset.name}
          >
            <canvas
              use:canvasPattern={{
                options: preset.options,
                width: 80,
                height: 80,
              }}
              width={80}
              height={80}
            ></canvas>
            <span class="gallery-name">{preset.name}</span>
          </button>
        {/each}
      </div>
    </div>
  </div>
</section>

<style>
  .gen-layout {
    display: grid;
    grid-template-columns: repeat(
      3,
      auto
    ); /* Fixed width for controls & gallery, flexible center */
    gap: 2rem;
    align-items: start;
    max-width: 100%; /* Ensure it doesn't overflow container */
  }

  /* ---- Controls ---- */
  .gen-controls {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1.25rem;
    background: #f3f4f6;
    min-width: 0; /* Allow shrinking if needed */
  }

  .control-group {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .control-group label {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-weight: 600;
    font-size: 0.9rem;
  }

  .value {
    font-weight: 500;
    font-size: 0.8rem;
    font-variant-numeric: tabular-nums;
  }

  .value-light {
    font-weight: 400;
    font-size: 0.75rem;
    opacity: 0.6;
  }

  .control-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }

  .control-group input[type="color"] {
    width: 100%;
    height: 40px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    cursor: pointer;
    transition: border-color 0.3s;
  }

  .control-group input[type="color"]:hover {
    border-color: #9ca3af;
  }

  .control-group select,
  .control-group input[type="range"],
  .control-group input[type="text"] {
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    font-size: 0.9rem;
    transition: border-color 0.3s;
    font: inherit;
  }

  .control-group select:hover,
  .control-group input[type="range"]:hover,
  .control-group input[type="text"]:hover {
    border-color: #9ca3af;
  }

  .control-group select:focus,
  .control-group input[type="range"]:focus,
  .control-group input[type="text"]:focus {
    outline: none;
    border-color: #6b7280;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
  }

  .toggle-row {
    flex-direction: row !important;
    align-items: center;
    gap: 0.5rem;
    padding-top: 0.25rem;
  }

  .toggle-label {
    font-size: 0.85rem !important;
    font-weight: 500 !important;
    cursor: pointer;
    margin-bottom: 0 !important;
  }

  /* ---- Center: Preview + Code ---- */
  .gen-center {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    min-width: 0; /* Crucial for grid items to shrink & scroll */
  }

  .preview-wrapper {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
    background: #fff;
    aspect-ratio: 1 / 1;
  }

  .preview-wrapper canvas {
    display: block;
    width: 100%;
    height: 100%;
  }

  .code-output {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
  }

  .code-block-wrapper {
    overflow-x: auto;
    max-height: 400px;
  }

  .code-block-wrapper :global(pre) {
    margin: 0;
    font-size: 0.8rem;
    line-height: 1.65;
  }

  /* ---- Gallery ---- */
  .gen-gallery {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .gallery-label {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    opacity: 0.6;
  }

  .gallery-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-columns: min-content;
    justify-items: start;
    gap: 0.5rem;
    max-height: 550px;
    overflow-y: auto;
    padding-right: 0.25rem;
  }

  .gallery-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.35rem;
    padding: 0.35rem;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;
  }

  .gallery-item:hover {
    border-color: #9ca3af;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  .gallery-item canvas {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 3px;
  }

  .gallery-name {
    font-size: 0.7rem;
    font-weight: 500;
    opacity: 0.6;
  }

  @media (max-width: 908px) {
    .gen-layout {
      grid-template-columns: 1fr 1fr;
    }

    .gen-gallery {
      grid-column: 1 / -1; /* Span full width */
      width: 100%;
    }

    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
      gap: 0.5rem;
      max-height: none;
      padding-top: 1rem;
    }

    .control-row {
      grid-template-columns: 1fr; /* Stack controls vertically */
      gap: 0.5rem;
    }
  }
</style>
