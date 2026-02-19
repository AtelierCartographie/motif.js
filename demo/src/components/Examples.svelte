<script lang="ts">
  import { motif } from "motif.js";
  import { examples } from "../lib/examples";
  import { highlight } from "../lib/shiki";
  import PlotComponent from "./PlotComponent.svelte";
  import * as Plot from "@observablehq/plot";
  import * as d3 from "d3";
  import * as d3Projections from "d3-geo-projection";
  import * as bertin from "bertin";
  import climate_data from "../lib/assets/annual_data.json";
  import countries110m from "../lib/assets/countries110m.json";
  import france_dep from "../lib/assets/france_dep.json";
  import france_limits from "../lib/assets/france_limits.json";
  import france_dep_density from "../lib/assets/france_pop_density.json";
  import countries110m_borders from "../lib/assets/countries110m_borders.json";

  type LibKey = keyof typeof examples;

  let selectedLib: LibKey = $state("canvas");
  let showCode = $state(false);
  let highlightedCode = $state("");

  let canvasEl: HTMLCanvasElement | undefined = $state();
  let canvasWrapperWidth = $state(0);

  // Highlight code when example or code tab changes
  $effect(() => {
    if (!showCode) return;
    const code = examples[selectedLib].code;
    highlight(code, "javascript").then((html) => {
      highlightedCode = html;
    });
  });
  // Action to render the Bertin map
  function renderBertin(node: HTMLElement) {
    // Prepare data
    const features = structuredClone(france_dep.features).map((f: any) => {
      const code = f.properties.dep;
      // @ts-ignore
      const density = france_dep_density[code] ?? 0;
      f.properties.density = density;
      return f;
    });
    const regions = { type: "FeatureCollection", features };

    // Create a palette of patterns
    const params = {
      type: "circle",
      scale: 0.7,
    };
    const palette = [
      motif({ ...params, size: 3 }),
      motif({ ...params, size: 15 }),
      motif({ ...params, size: 35 }),
      motif({ ...params, size: 55 }),
    ];

    // node.innerHTML = "";

    // Define projection manually to ensure fit
    const width = 500;
    const height = 700;
    const projection = d3
      .geoIdentity()
      .reflectY(true)
      .fitSize([width, height], regions as any);

    const map = bertin.draw({
      params: { projection },
      layers: [
        // 1. Inject Patterns into <defs> (Using a custom layer render function)
        {
          type: "custom",
          render: (svg) =>
            svg
              .select("defs")
              .node()
              .append(...palette.map((d) => d.defs)),
        },
        // 5. Header
        {
          type: "header",
          text: "Population Density by department",
          fontSize: 20,
          anchor: "start",
        },
        // 6. Footer
        {
          type: "footer",
          text: "Source: INSEE",
          anchor: "start",
        },
        // 4. Black stroke
        {
          type: "layer",
          geojson: regions,
          fill: "none",
          stroke: "black",
          strokeWidth: 1,
          strokeLinejoin: "round",
        },
        // 3. White halo stroke
        {
          type: "layer",
          geojson: regions,
          fill: "none",
          stroke: "white",
          strokeWidth: 4,
          strokeLinejoin: "round",
        },
        // 2. Choropleth Map
        {
          type: "layer",
          geojson: regions,
          fill: {
            type: "choro",
            values: "density",
            nbreaks: 4,
            method: "quantile",
            colors: palette.map((d) => d.url),
          },
        },
      ],
    });

    node.appendChild(map);
  }

  //
  // Action to render the map
  function renderMap(node: HTMLCanvasElement, dimensions: { width: number }) {
    function draw(w: number) {
      if (!w) return;
      const ctx = node.getContext("2d");
      if (!ctx) return;

      const width = w;
      const height = width / 1.5; // Aspect ratio
      const dpr = window.devicePixelRatio || 1;

      // Adjust canvas resolution for DPI
      node.width = width * dpr;
      node.height = height * dpr;
      node.style.width = `${width}px`;
      node.style.height = `${height}px`;

      // Scale context
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height); // Clear logical dimensions

      // Define projection
      const sphere = { type: "Sphere" };
      // @ts-ignore - d3-geo-projection types might be missing
      const proj = d3Projections
        .geoVanDerGrinten4()
        .fitSize([width, height], sphere as any);
      const path = d3.geoPath(proj).context(ctx);

      // Create a sphere pattern
      const spherePattern = motif({
        type: "circle",
        scale: 0.3,
        size: 10,
        angle: 45,
        fill: "grey",
        background: "white",
      });
      ctx.fillStyle = spherePattern.context(ctx);
      ctx.beginPath();
      path(sphere as any);
      ctx.fill();
      spherePattern.apply();

      // Create a palette of patterns
      const params = {
        type: "line",
        scale: 0.5,
        angle: -45,
        fill: "goldenrod",
      };
      const palette = [
        motif({ ...params, size: 10 }),
        motif({ ...params, size: 30 }),
        motif({ ...params, size: 50 }),
        motif({ ...params, size: 70 }),
      ];

      // Initialize patterns
      const patterns = palette.map((p) => p.context(ctx));

      // Draw countries
      (countries110m as any).features.forEach((feature: any) => {
        const pattern = patterns[Math.floor(Math.random() * patterns.length)];

        ctx.beginPath();
        ctx.fillStyle = pattern;
        path(feature);
        // Apply the pattern transformation
        pattern.apply();
      });

      // Draw lines (blue-gray border)
      // buffer lines
      ctx.beginPath();
      ctx.strokeStyle = "white";
      ctx.lineJoin = "round";
      ctx.lineWidth = 3;
      path(countries110m_borders as any);
      ctx.stroke();

      // lines
      ctx.beginPath();
      ctx.strokeStyle = "grey";
      ctx.lineJoin = "round";
      ctx.lineWidth = 1;
      path(countries110m_borders as any);
      ctx.stroke();

      // Credits
      ctx.fillStyle = "black";
      ctx.textBaseline = "bottom";
      ctx.textAlign = "right";
      ctx.font = "10px monospace";
      ctx.fillText("Basemap: Natural Earth", width - 10, height - 10);
    }

    // Initial draw
    draw(dimensions.width);

    return {
      update(newDimensions: { width: number }) {
        draw(newDimensions.width);
      },
    };
  }

  // PLOT EXEMPLE
  const plot_pattern_up = motif({
    type: "line",
    scale: 0.5,
    size: 15,
    angle: 45,
    fill: "coral",
    background: "color-mix(in oklch, coral 20%, white)",
  });
  const plot_pattern_down = motif({
    type: "line",
    scale: 0.5,
    size: 15,
    angle: -45,
    fill: "cadetblue",
    background: "color-mix(in oklch, cadetblue 20%, white)",
  });
  const plotExample = Plot.plot({
    title: "Global surface temperature anomaly, 1850-2024",
    subtitle: "From pre-industrial period",
    caption: "Source: Berkeley Earth Land/Ocean Temperature.",
    x: { interval: "year" },
    y: {
      ticks: 4,
      grid: true,
      label: "temperature deviation (°C)\n    from 1850-1900 average",
    },
    marks: [
      () => plot_pattern_up.defs,
      () => plot_pattern_down.defs,
      Plot.rectY(climate_data, {
        x: (d) => new Date(d.date),
        y: "anomaly_1850_1900",
        inset: -0.2,
        fill: (d) =>
          d.anomaly_1850_1900 >= 0
            ? plot_pattern_up.url
            : plot_pattern_down.url,
      }),
      Plot.ruleY([0]),
    ],
  });

  const libKeys: LibKey[] = ["canvas", "plot", "bertin"];
</script>

<section id="examples" class="section">
  <h2 class="section-title">Examples</h2>
  <p class="section-subtitle">
    See how to integrate patterns in Canvas, Observable Plot, and Bertin.js.
  </p>

  <div class="examples-layout">
    <!-- Left: libraries list -->
    <div class="lib-selector">
      {#each libKeys as key}
        <button
          class="lib-btn"
          class:active={selectedLib === key}
          onclick={() => {
            selectedLib = key;
            showCode = false;
          }}
        >
          <span class="lib-btn-left">
            <span class="lib-icon">
              {#if key === "canvas"}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  ><rect x="3" y="3" width="18" height="18" rx="2" /><path
                    d="m9 9 3 3-3 3"
                  /></svg
                >
              {:else if key === "plot"}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  ><rect x="3" y="12" width="4" height="9" /><rect
                    x="10"
                    y="6"
                    width="4"
                    height="15"
                  /><rect x="17" y="3" width="4" height="18" /></svg
                >
              {:else if key === "bertin"}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  ><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path
                    d="M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10"
                  /></svg
                >
              {:else}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  ><polygon
                    points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5"
                  /><line x1="12" y1="22" x2="12" y2="15.5" /><polyline
                    points="22 8.5 12 15.5 2 8.5"
                  /></svg
                >
              {/if}
            </span>
            {examples[key].label}
          </span>
          {#if key === "plot"}
            <a
              href="https://observablehq.com/plot/"
              target="_blank"
              rel="noopener noreferrer"
              class="lib-link"
              onclick={(e) => e.stopPropagation()}
              title="Observable Plot documentation"
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                ><path
                  d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                /><polyline points="15 3 21 3 21 9" /><line
                  x1="10"
                  y1="14"
                  x2="21"
                  y2="3"
                /></svg
              >
            </a>
          {:else if key === "bertin"}
            <a
              href="https://github.com/riatelab/bertin"
              target="_blank"
              rel="noopener noreferrer"
              class="lib-link"
              onclick={(e) => e.stopPropagation()}
              title="Bertin.js on GitHub"
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                ><path
                  d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                /><polyline points="15 3 21 3 21 9" /><line
                  x1="10"
                  y1="14"
                  x2="21"
                  y2="3"
                /></svg
              >
            </a>
          {/if}
        </button>
      {/each}
    </div>

    <!-- Right: display area -->
    <div class="example-display">
      <div class="display-tabs">
        <button
          class="tab-btn"
          class:active={!showCode}
          onclick={() => (showCode = false)}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            ><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle
              cx="12"
              cy="12"
              r="3"
            /></svg
          >
          Preview
        </button>
        <button
          class="tab-btn"
          class:active={showCode}
          onclick={() => (showCode = true)}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            ><polyline points="16 18 22 12 16 6" /><polyline
              points="8 6 2 12 8 18"
            /></svg
          >
          Code
        </button>
      </div>

      <div class="display-content">
        {#if showCode}
          <div class="code-block-wrapper">{@html highlightedCode}</div>
        {:else if selectedLib === "canvas"}
          <div class="preview-area" bind:clientWidth={canvasWrapperWidth}>
            <canvas use:renderMap={{ width: canvasWrapperWidth }}></canvas>
          </div>
        {:else if selectedLib === "plot"}
          <div class="preview-area">
            <PlotComponent svgElement={plotExample} />
          </div>
        {:else if selectedLib === "bertin"}
          <div class="preview-area" use:renderBertin></div>
        {:else if selectedLib === "svelteplot"}
          <div class="preview-area preview-placeholder">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              ><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" /></svg
            >
            <p>
              Install <code>@svelteplot/svelteplot</code> to see this example live.
            </p>
          </div>
        {/if}
      </div>
    </div>
  </div>
</section>

<style>
  .examples-layout {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 1.5rem;
    align-items: start;
  }

  .lib-selector {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .lib-btn {
    display: flex;
    align-items: center;
    padding: 0.7rem 1rem;
    font-size: 0.9rem;
    font-weight: 500;
    color: inherit;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;
    text-align: left;
    opacity: 0.6;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .lib-btn:hover {
    background: rgba(0, 0, 0, 0.05);
    color: inherit;
    opacity: 0.8;
  }

  .lib-btn.active {
    background: rgba(0, 0, 0, 0.05);
    color: inherit;
    opacity: 1;
    border-color: #d1d5db;
    font-weight: 600;
  }

  .lib-icon {
    display: flex;
    align-items: center;
    opacity: 0.6;
  }

  .lib-btn-left {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .lib-link {
    display: flex;
    align-items: center;
    margin-left: auto;
    opacity: 0;
    color: inherit;
    transition: opacity 0.2s;
    flex-shrink: 0;
  }

  .lib-btn:hover .lib-link,
  .lib-btn.active .lib-link {
    opacity: 0.5;
  }

  .lib-link:hover {
    opacity: 1 !important;
  }

  .lib-btn.active .lib-icon {
    opacity: 1;
  }

  .example-display {
    /* background: #f9fafb; */
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
  }

  .display-tabs {
    display: flex;
    gap: 0;
    border-bottom: 1px solid #e5e7eb;
    background: #f9fafb;
  }

  .tab-btn {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.65rem 1.25rem;
    font-size: 0.8rem;
    font-weight: 500;
    color: inherit;
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    transition: all 0.3s;
    opacity: 0.6;
  }

  .tab-btn:hover {
    opacity: 0.8;
  }

  .tab-btn.active {
    opacity: 1;
    border-bottom-color: current;
  }

  .display-content {
    min-height: 300px;
  }

  .code-block-wrapper {
    overflow-x: auto;
    font-size: 0.9rem;
    line-height: 1.6;
  }

  .code-block-wrapper :global(pre) {
    margin: 0;
    padding: 1.5rem;
    border-radius: 0;
  }

  .code-block-wrapper :global(code) {
    font-family: "Courier New", monospace;
    font-size: 0.9rem;
  }

  .preview-area {
    padding: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .preview-area canvas {
    border-radius: 4px;
    max-width: 100%;
    height: auto;
  }

  .preview-placeholder {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
    opacity: 0.5;
    padding: 3rem 2rem;
  }

  .preview-placeholder p {
    font-size: 0.9rem;
    line-height: 1.6;
  }

  @media (max-width: 768px) {
    .examples-layout {
      grid-template-columns: 1fr;
    }

    .lib-selector {
      flex-direction: row;
      flex-wrap: wrap;
    }
  }
</style>
