/**
 * Creates a pattern/motif that can be used in SVG environment or Canvas context.
 * @param {object} [options={}] - An object containing the options for the pattern.
 * @param {string} [options.type="line"] - Type of pattern. Can be "line", "plaid", "circle", "plus", "cross", "triangle", square", "diamond" and "custom". If "custom" see options.custom
 * @param {number} [options.scale=1] - Scale of the tile.
 * @param {number} [options.size=20] - Shape size as a percentage of tile area.
 * @param {number} [options.angle=0] - Rotation angle, in degrees.
 * @param {string} [options.fill="black"] - Fill color.
 * @param {string} [options.stroke="transparent"] - Stroke color.
 * @param {number} [options.strokeWidth=0] - Line width of shape stroke, in pixels.
 * @param {number[]} [options.dash=[]] - Dash pattern as in CSS.
 * @param {string} [options.background="transparent"] - Background color of the pattern canvas.
 * @param {number} [options.border=0] - Tile border width. Default as 0 = no border.
 * @param {boolean} [options.patchSize=false] - Patch the size to truly respect ratio between shape and tile area.
 * @param {function} [option.custom.shape] - Custom shape as an SVG string data or Canvas path method.
 * @param {number} [option.custom.patch=50] - Patch size for the custom shape. Default: 50.
 * @returns {{ defs: SVGElement, url: string, context: Function, apply: Function }} An object containing SVG defs element with pattern, url id of the pattern and two functions for Canvas use: context and apply.
 */

// Constants
const DEFAULT_DPI_MULTIPLIER = 2;
const CROSS_DIAMOND_ROTATION = 45;
const TILE_BASE_SIZE = 10;

export type PatternType = "line" | "plaid" | "circle" | "plus" | "cross" | "triangle" | "square" | "diamond" | "custom";

export interface PatternOptions {
  type?: PatternType;
  scale?: number;
  size?: number;
  angle?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  dash?: number[];
  background?: string;
  border?: number;
  patchSize?: boolean;
  custom?: {
    shape: string | ((t: number, shapeArea: number) => string);
    patch?: number;
  };
}

export interface PatternResult {
  defs: SVGDefsElement;
  url: string;
  context: (ctx: CanvasRenderingContext2D) => CanvasPattern;
  apply: () => void;
  tile: () => HTMLCanvasElement;
}

function createSVGElement(svgString: string): SVGElement {
  if (typeof document === 'undefined') {
    // SSR / Node environment support
    return { outerHTML: svgString } as unknown as SVGElement;
  }
  const parser = new DOMParser();
  const doc = parser.parseFromString(
    `<svg xmlns="http://www.w3.org/2000/svg">${svgString}</svg>`, 
    "image/svg+xml"
  );
  return doc.documentElement.firstChild as SVGElement;
}

function degreeToRadian(degree: number): number {
  return (degree * Math.PI) / 180;
}

function line(t: number, shapeArea: number): string {
  const w = shapeArea / t;
  return `M ${-t / 2} ${-w / 2}
          h ${t} v ${w} h ${-t}
          Z`;
}

function plaid(t: number, shapeArea: number): string {
  const w = t - Math.sqrt(Math.pow(t, 2) - shapeArea);
  return `M ${-t / 2} ${-w / 2}
          h ${t} v ${w} h ${-t}
          Z
          M ${-w / 2} ${-t / 2}
          h ${w} v ${t} h ${-w}
          Z`;
}

function circle(t: number, shapeArea: number): string {
  const r = Math.sqrt(shapeArea / Math.PI);
  return `M ${-r} 0
          A ${r} ${r} 0 1 0 ${r} 0
          A ${r} ${r} 0 1 0 ${-r} 0`;
}

function plus(t: number, shapeArea: number): string {
  const B = Math.sqrt((16 * shapeArea) / 7); // big side
  const h_B = B / 2; // half big side
  const h_S = B / 4 / 2; // half small side

  return `M ${-h_B} ${-h_S}
          L ${-h_S} ${-h_S}
          L ${-h_S} ${-h_B}
          L ${h_S} ${-h_B}
          L ${h_S} ${-h_S}
          L ${h_B} ${-h_S}
          L ${h_B} ${h_S}
          L ${h_S} ${h_S}
          L ${h_S} ${h_B}
          L ${-h_S} ${h_B}
          L ${-h_S} ${h_S}
          L ${-h_B} ${h_S}
          Z`;
}

function triangle(t: number, shapeArea: number): string {
  // borrow from d3-shape, https://github.com/d3/d3-shape/blob/main/src/symbol/triangle.js
  const sqrt3 = Math.sqrt(3);
  const y = -Math.sqrt(shapeArea / (sqrt3 * 3));
  return `M 0 ${y * 2}
          L ${-sqrt3 * y} ${-y}
          L ${sqrt3 * y} ${-y}
          Z`;
}

function square(t: number, shapeArea: number): string {
  const side = Math.sqrt(shapeArea);
  return `M ${-side / 2} ${-side / 2}
          h ${side} v ${side} h ${-side}
          Z`;
}

export function motif(options: PatternOptions = {}): PatternResult {
  let {
    type = "line",
    scale = 1,
    size = 20,
    angle = 0,
    fill = "black",
    stroke = "transparent",
    strokeWidth = 0,
    dash = [],
    background = "white",
    border = 0,
    patchSize = false,
    custom
  } = options;

  const tileSize = scale * TILE_BASE_SIZE;
  const get_shape_area = () => (size / 100) * (tileSize * tileSize);
  let external_context: CanvasRenderingContext2D;
  const dpi = typeof devicePixelRatio !== "undefined" ? devicePixelRatio : DEFAULT_DPI_MULTIPLIER;

  const shape_path = new Map<PatternType, (t: number, shapeArea: number) => string>([
    ["line", line],
    ["plaid", plaid],
    ["circle", circle],
    ["plus", plus],
    ["cross", plus],
    ["triangle", triangle],
    ["square", square],
    ["diamond", square],
    ["custom", custom?.shape as (t: number, shapeArea: number) => string]
  ]);

  // Empirical tipping point = faster and still close to real one
  const tipping_point = new Map<PatternType, number>([
    ["line", 50], // arbitrary
    ["plaid", 50], // arbitrary
    ["circle", 78],
    ["triangle", 43],
    ["plus", 43],
    ["cross", 55],
    ["square", 50], // arbitrary
    ["diamond", 50],
    ["custom", custom?.patch ?? 50]
  ]);

  if (patchSize && size > (tipping_point.get(type) ?? 50)) {
    const back = background;
    background = fill;
    fill = back;
    size = 100 - size;
  }

  const path_function = shape_path.get(type);
  if (!path_function) {
    throw new Error(`Unknown pattern type: ${type}`);
  }

  const path = path_function(tileSize, get_shape_area());
  const id = `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const rotate_shape = ["cross", "diamond"].includes(type) ? CROSS_DIAMOND_ROTATION : 0;

  // SVG OUTPUT
  const pattern = `<pattern id="${id}" 
                               width="${tileSize}" height="${tileSize}"
                               viewBox="${-tileSize / 2} ${-tileSize / 2} ${tileSize} ${tileSize}"
                               patternUnits="userSpaceOnUse"
                               patternTransform="rotate(${angle})">
      <rect fill="${background}" 
            x="${-tileSize / 2}" y="${-tileSize / 2}"
            width="${tileSize}" height="${tileSize}"/>
      <path d="${path}"
            transform="rotate(${rotate_shape})"
            fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
    </pattern>`;

  const defs = createSVGElement(`<defs>${pattern}</defs>`) as SVGDefsElement;
  const url = `url(#${id})`;

  // CANVAS OUTPUT - Helper function to create tile canvas
  function create_tile_canvas(tile_dpi: number, as_element: boolean = false): HTMLCanvasElement | OffscreenCanvas {
    const canvas = as_element 
      ? Object.assign(document.createElement("canvas"), { width: tile_dpi, height: tile_dpi })
      : (typeof OffscreenCanvas !== "undefined"
          ? new OffscreenCanvas(tile_dpi, tile_dpi)
          : Object.assign(document.createElement("canvas"), { width: tile_dpi, height: tile_dpi }));

    const ctx = canvas.getContext("2d", { 
      alpha: true,
      willReadFrequently: false
    }) as CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null;
    if (!ctx) throw new Error("Could not get 2D context from canvas");

    // Tile background and border
    ctx.save();
    ctx.fillStyle = background;
    ctx.strokeStyle = border === 0 ? "transparent" : "black";
    ctx.lineWidth = border;
    ctx.rect(0, 0, tile_dpi, tile_dpi);
    ctx.fill();
    if (border !== 0) ctx.stroke();
    ctx.restore();

    // Origin to tile center and shape styling
    ctx.beginPath();
    ctx.translate(tile_dpi / 2, tile_dpi / 2);
    ctx.scale(dpi, dpi);
    ctx.rotate(degreeToRadian(rotate_shape));
    ctx.strokeStyle = strokeWidth === 0 ? "transparent" : stroke;
    ctx.setLineDash(dash);
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.fillStyle = fill;

    // SVG string path pass to a Path2D
    const path2D = new Path2D(path);
    ctx.stroke(path2D);
    ctx.fill(path2D);
    ctx.resetTransform();

    return canvas;
  }

  function context(ctx: CanvasRenderingContext2D): CanvasPattern {
    const tile_dpi = tileSize * dpi;
    const canvas_base_tile = create_tile_canvas(tile_dpi, false);
    const pattern = ctx.createPattern(canvas_base_tile, "repeat");
    if (!pattern) throw new Error("Could not create canvas pattern");
    
    external_context = ctx;
    (pattern as any).apply = apply;
    (pattern as any).defs = defs;
    (pattern as any).url = url;
    return pattern;
  }

  // Apply pattern with good scale and angle
  function apply(): void {
    const angle_radian = degreeToRadian(angle);
    external_context.save();
    // Scale pattern to it's good size
    external_context.scale(1 / dpi, 1 / dpi);
    // Rotate pattern according to angle input
    external_context.rotate(angle_radian);
    external_context.fill();
    external_context.restore();
  }

  // Return the unit tile as HTMLCanvasElement (for atlas usage)
  function tile(): HTMLCanvasElement {
    const tile_dpi = tileSize * dpi;
    return create_tile_canvas(tile_dpi, true) as HTMLCanvasElement;
  }

  return { defs, url, context, apply, tile };
}
