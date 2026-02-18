export const examples: Record<string, { label: string; code: string }> = {
  canvas: {
    label: "Canvas",
    code: `import { motif } from "motif.js";
import * as d3 from "d3";
import * as d3Projections from "d3-geo-projection";
import countries110m from "./countries110m.json";
import countries110m_borders from "./countries110m_borders.json";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const width = 800;
const height = width / 1.5;
const dpr = window.devicePixelRatio || 1;

canvas.width = width * dpr;
canvas.height = height * dpr;
canvas.style.width = width + "px";
canvas.style.height = height + "px";
ctx.scale(dpr, dpr);

// Define projection
const sphere = { type: "Sphere" };
const proj = d3Projections.geoVanDerGrinten4()
  .fitSize([width, height], sphere);
const path = d3.geoPath(proj).context(ctx);

// Sphere background
const spherePattern = motif({
  type: "circle", scale: 0.3, size: 10, angle: 45,
  fill: "grey", background: "white",
});
ctx.fillStyle = spherePattern.context(ctx);
ctx.beginPath();
path(sphere);
ctx.fill();
spherePattern.apply();

// Palette of patterns for countries
const palette = [
  motif({ type: "line", scale: 0.5, angle: -45, fill: "goldenrod", size: 10 }),
  motif({ type: "line", scale: 0.5, angle: -45, fill: "goldenrod", size: 30 }),
  motif({ type: "line", scale: 0.5, angle: -45, fill: "goldenrod", size: 50 }),
  motif({ type: "line", scale: 0.5, angle: -45, fill: "goldenrod", size: 70 }),
];
const patterns = palette.map((p) => p.context(ctx));

// Draw countries
countries110m.features.forEach((feature) => {
  const pattern = patterns[Math.floor(Math.random() * patterns.length)];
  ctx.beginPath();
  ctx.fillStyle = pattern;
  path(feature);
  pattern.apply();
});

// Border halo
ctx.beginPath();
ctx.strokeStyle = "white";
ctx.lineJoin = "round";
ctx.lineWidth = 3;
path(countries110m_borders);
ctx.stroke();

// Border lines
ctx.beginPath();
ctx.strokeStyle = "grey";
ctx.lineJoin = "round";
ctx.lineWidth = 1;
path(countries110m_borders);
ctx.stroke();`,
  },
  plot: {
    label: "Observable Plot",
    code: `import * as Plot from "@observablehq/plot";
import { motif } from "motif.js";

const params_pattern = { type: "line", scale: 0.5, size: 15 };
const pattern_up = motif({
    ...params_pattern,
    angle: 45,
    fill: "coral",
    background: "color-mix(in oklch, coral 20%, white)",
  });
const pattern_down = motif({
    ...params_pattern,
    angle: -45,
    fill: "cadetblue",
    background: "color-mix(in oklch, cadetblue 20%, white)",
  });

Plot.plot({
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
      () => pattern_up.defs,
      () => pattern_down.defs,
      Plot.rectY(climate_data, {
        x: (d) => new Date(d.date),
        y: "anomaly_1850_1900",
        inset: -0.2,
        fill: (d) =>
          d.anomaly_1850_1900 >= 0
            ? pattern_up.url
            : pattern_down.url,
      }),
      Plot.ruleY([0]),
    ],
  });`,
  },
  bertin: {
    label: "Bertin.js",
    code: `import { draw } from "bertin";
import * as d3 from "d3";
import { motif } from "motif.js";
// france_dep.json already has a "density" property on each feature
import france_dep from "./france_dep.json";

// Projection fitted to the data
const width = 500;
const height = 700;
const projection = d3.geoIdentity()
  .reflectY(true)
  .fitSize([width, height], france_dep);

// Palette of circle patterns (low → high density)
const params = { type: "circle", scale: 0.7 };
const palette = [
  motif({ ...params, size: 3 }),
  motif({ ...params, size: 15 }),
  motif({ ...params, size: 35 }),
  motif({ ...params, size: 55 }),
];

draw({
  params: { projection },
  layers: [
    // Inject patterns into <defs>
    {
      type: "custom",
      render: (svg) =>
        svg.select("defs").node()
          .append(...palette.map((d) => d.defs)),
    },
    // Header
    {
      type: "header",
      text: "Population Density by department",
      fontSize: 20,
      anchor: "start",
    },
    // Footer
    { type: "footer", text: "Source: INSEE", anchor: "start" },
    // Border halo
    {
      type: "layer",
      geojson: france_dep,
      fill: "none",
      stroke: "white",
      strokeWidth: 4,
    },
    // Border lines
    {
      type: "layer",
      geojson: france_dep,
      fill: "none",
      stroke: "black",
      strokeWidth: 1,
    },
    // Choropleth fill
    {
      type: "layer",
      geojson: france_dep,
      fill: {
        type: "choro",
        values: "density",
        nbreaks: 4,
        method: "quantile",
        colors: palette.map((d) => d.url),
      },
    },
  ],
});`,
  },
  svelteplot: {
    label: "SveltePlot",
    code: `<script>
  import { Plot, BarY, RuleY } from "@svelteplot/svelteplot";
  import { motif } from "motif.js";

  const data = [
    { category: "A", value: 28 },
    { category: "B", value: 55 },
    { category: "C", value: 43 },
    { category: "D", value: 91 },
    { category: "E", value: 81 },
    { category: "F", value: 53 },
  ];

  const pattern = motif({
    type: "line",
    angle: 45,
    size: 25,
    fill: "#2563eb",
    background: "#dbeafe",
  });
<\/script>

<Plot>
  {@html pattern.defs}
  <BarY
    {data}
    x="category"
    y="value"
    fill={pattern.url}
  />
  <RuleY data={[0]} />
</Plot>`,
  },
};
