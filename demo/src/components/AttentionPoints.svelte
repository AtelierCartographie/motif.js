<script lang="ts">
  import { type PatternType } from "@ateliercartographie/motif.js";
  import { canvasPattern } from "../lib/canvasPattern";

  // ---- Scale Demo ----
  const scales = [0.25, 0.5, 1, 2, 4];

  // ---- PatchSize Demo ----
  const patchTypes: PatternType[] = [
    "line",
    "plaid",
    "circle",
    "plus",
    "cross",
    "triangle",
    "square",
    "diamond",
    "dithering",
  ];
  const patchSizes = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  let patchEnabled = $state(true);

  function scaleLabel(s: number): string {
    if (s === 0.25) return "¼";
    if (s === 0.5) return "½";
    return String(s);
  }
</script>

<section id="details" class="section section-alt">
  <div class="container">
    <h2 class="section-title">Key Considerations</h2>
    <p class="section-subtitle">
      Understanding key parameters for perfect patterns.
    </p>

    <!-- SCALE -->
    <div class="detail-block">
      <div class="detail-text">
        <h3>Scale — Tile Size</h3>
        <p>
          The <code>scale</code> parameter controls the tile size (the base
          "square" that repeats). It acts as a
          <strong>multiplier</strong> of the reference tile size (10px).
        </p>
        <p>
          Unlike a simple zoom, motif.js <strong
            >preserves the ratio between the shape area and the tile area</strong
          >. Thus, at <code>size: 25</code>, the shape always occupies 25% of
          the tile area, regardless of scale. This ensures consistent visual
          density.
        </p>
      </div>
      <div class="scale-demo">
        <div class="scale-strip">
          {#each scales as s, i}
            <div class="scale-tile">
              <canvas
                width={160}
                height={160}
                use:canvasPattern={{
                  options: {
                    type: "circle",
                    size: 25,
                    scale: s,
                    fill: "#000",
                    background: "#fff",
                  },
                  width: 160,
                  height: 160,
                }}
              ></canvas>
              <span class="scale-label">scale: {scaleLabel(s)}</span>
            </div>
          {/each}
        </div>
        <p class="demo-caption">
          Pattern <code>circle</code> with <code>size: 25</code> — the shape/tile
          ratio remains constant.
        </p>
      </div>
    </div>

    <!-- PATCHSIZE -->
    <div class="detail-block">
      <div class="detail-text">
        <h3>patchSize — Visual Ratio Correction</h3>
        <p>
          For shapes whose visual area overflows the tile at large sizes (e.g.,
          circle at 80%), the <code>patchSize</code> option intelligently
          inverts the background and shape beyond an empirical threshold. The
          result: the <em>perceived</em> ratio between shape and tile is respected
          even at high sizes.
        </p>
        <p>
          Enable or disable to see the difference across all shapes, from 10% to
          100%.
        </p>
      </div>

      <div class="patch-toggle">
        <label class="toggle-switch">
          <input type="checkbox" bind:checked={patchEnabled} />
          <span class="toggle-track">
            <span class="toggle-thumb"></span>
          </span>
          <span class="toggle-label"
            >patchSize {patchEnabled ? "enabled" : "disabled"}</span
          >
        </label>
      </div>

      <div class="patch-matrix">
        {#each patchTypes as patType}
          <div class="patch-row">
            <span class="patch-type-label">{patType}</span>
            <div class="patch-tiles">
              {#each patchSizes as sz}
                {@const key = `${patType}-${sz}`}
                <div class="patch-tile">
                  {#if patType === patchTypes[0]}
                    <span class="patch-size-label">{sz}%</span>
                  {/if}
                  <canvas
                    width={60}
                    height={60}
                    use:canvasPattern={{
                      options: {
                        type: patType,
                        size: sz,
                        fill: "#000",
                        background: "#fff",
                        patchSize: patchEnabled,
                      },
                      width: 60,
                      height: 60,
                    }}
                  ></canvas>
                </div>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>

<style>
  .detail-block {
    margin-bottom: 4rem;
  }

  .detail-block:last-child {
    margin-bottom: 0;
  }

  .detail-text {
    max-width: 720px;
    margin-bottom: 2rem;
  }

  .detail-text h3 {
    font-size: 1.35rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
  }

  .detail-text p {
    font-size: 0.95rem;
    line-height: 1.7;
    margin-bottom: 0.75rem;
    opacity: 0.7;
  }

  .detail-text p:last-child {
    margin-bottom: 0;
  }

  .detail-text code {
    background: #f3f4f6;
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-family: "Courier New", monospace;
    font-size: 0.9em;
  }

  /* ---- Scale Demo ---- */
  .scale-demo {
    overflow-x: auto;
  }

  .scale-strip {
    display: flex;
    gap: 0.5rem;
    align-items: flex-end;
  }

  .scale-tile {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .scale-tile canvas {
    display: block;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
  }

  .scale-label {
    font-size: 0.75rem;
    font-family: "Courier New", monospace;
    opacity: 0.6;
    white-space: nowrap;
  }

  .demo-caption {
    margin-top: 1rem;
    font-size: 0.8rem;
    opacity: 0.6;
    font-style: italic;
  }

  /* ---- PatchSize Demo ---- */
  .patch-toggle {
    display: flex;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .toggle-switch {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    user-select: none;
  }

  .toggle-switch input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .toggle-track {
    position: relative;
    width: 44px;
    height: 24px;
    border-radius: 12px;
    background: #d1d5db;
    transition: background 0.25s ease;
    flex-shrink: 0;
  }

  .toggle-switch input:checked ~ .toggle-track {
    background: #e6142d;
  }

  .toggle-thumb {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    transition: transform 0.25s ease;
  }

  .toggle-switch input:checked ~ .toggle-track .toggle-thumb {
    transform: translateX(20px);
  }

  .toggle-label {
    font-size: 0.9rem;
    font-weight: 500;
    min-width: 130px;
  }

  .patch-matrix {
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }

  .patch-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.35rem;
  }

  .patch-type-label {
    width: 70px;
    flex-shrink: 0;
    font-size: 0.75rem;
    font-family: "Courier New", monospace;
    opacity: 0.6;
    text-align: right;
  }

  .patch-tiles {
    display: flex;
    gap: 0.25rem;
  }

  .patch-tile {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.2rem;
  }

  .patch-tile canvas {
    display: block;
    width: 60px;
    height: 60px;
    border: 1px solid #e5e7eb;
    border-radius: 3px;
  }

  .patch-size-label {
    font-size: 0.65rem;
    font-family: "Courier New", monospace;
    opacity: 0.6;
  }
</style>
