import { motif, type PatternOptions } from "./motif";

export interface PatternMapping {
  x: number;
  y: number;
  width: number;
  height: number;
  angle?: number;
}

export interface AtlasResult {
  canvas: HTMLCanvasElement;
  mapping: Record<string, PatternMapping>;
}

/**
 * Creates a pattern atlas (sprite sheet) from a set of named motif configurations.
 * Returns a canvas and a mapping object ready for use with Deck.gl's FillStyleExtension.
 *
 * @param patterns - A record of named pattern options
 * @returns An object with `canvas` (the sprite sheet) and `mapping` (coordinates for each pattern)
 *
 * @example
 * ```ts
 * import { motifAtlas } from "motif.js";
 *
 * const { canvas, mapping } = motifAtlas({
 *   stripes: { type: "line", angle: 45, fill: "red" },
 *   dots:    { type: "circle", size: 30, fill: "blue" },
 *   grid:    { type: "plaid", fill: "#333" },
 * });
 *
 * // Use with Deck.gl
 * new GeoJsonLayer({
 *   extensions: [new FillStyleExtension({ pattern: true })],
 *   fillPatternAtlas: canvas,
 *   fillPatternMapping: mapping,
 *   getFillPattern: (d) => d.properties.patternName,
 * });
 * ```
 */
export function motifAtlas(
  patterns: Record<string, PatternOptions>
): AtlasResult {
  const names = Object.keys(patterns);

  if (names.length === 0) {
    throw new Error("motifAtlas requires at least one pattern");
  }

  // Padding to prevent texture bleeding between adjacent tiles in the atlas
  const padding = 4; // pixels of padding on each side

  // Extract unit tiles for each pattern
  const tiles = names.map((name) => {
    const options = patterns[name];
    const angle = options?.angle ?? 0;
    const originalCanvas = motif(options).tile();

    // Add padding around the tile to prevent bleeding
    // The padding is filled with the natural continuation of the repeating pattern
    const paddedWidth = originalCanvas.width + padding * 2;
    const paddedHeight = originalCanvas.height + padding * 2;

    const paddedCanvas = document.createElement("canvas");
    paddedCanvas.width = paddedWidth;
    paddedCanvas.height = paddedHeight;
    const ctx = paddedCanvas.getContext("2d");
    if (!ctx) throw new Error("Could not get 2D context for padded canvas");

    // Fill entire padded canvas with the repeating pattern
    // This ensures padding contains the natural pattern continuation (anti-bleeding)
    const pat = ctx.createPattern(originalCanvas, "repeat");
    if (!pat) throw new Error("Could not create canvas pattern");
    ctx.fillStyle = pat;
    // Translate so the pattern origin aligns with the inner region at (padding, padding)
    ctx.translate(padding, padding);
    ctx.fillRect(-padding, -padding, paddedWidth, paddedHeight);

    return {
      name,
      canvas: paddedCanvas,
      width: paddedWidth,
      height: paddedHeight,
      innerWidth: originalCanvas.width,
      innerHeight: originalCanvas.height,
      angle,
    };
  });

  // Layout: arrange tiles horizontally (1 row, N columns)
  // Note: tiles are already at high DPI resolution from motif().tile()
  const atlasHeight = Math.max(...tiles.map((t) => t.height));
  let atlasWidth = 0;
  const positions: Record<string, { x: number; y: number; width: number; height: number }> = {};

  // Position each tile (in physical pixels)
  tiles.forEach((tile) => {
    const y = Math.round((atlasHeight - tile.height) / 2); // Center vertically
    positions[tile.name] = {
      x: atlasWidth,
      y,
      width: tile.width,
      height: tile.height,
    };
    atlasWidth += tile.width;
  });

  // Create atlas canvas at high DPI resolution
  const canvas = document.createElement("canvas");
  canvas.width = atlasWidth;
  canvas.height = atlasHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get 2D context for atlas canvas");
  ctx.imageSmoothingEnabled = false;

  // Draw each tile into the atlas
  tiles.forEach((tile) => {
    const pos = positions[tile.name];
    ctx.drawImage(tile.canvas, pos.x, pos.y);
  });

  // Create mapping in physical pixel coordinates to match the atlas canvas dimensions.
  // Deck.gl uses these coordinates directly against the texture size.
  const mapping: Record<string, PatternMapping> = {};
  tiles.forEach((tile) => {
    const pos = positions[tile.name];
    mapping[tile.name] = {
      x: pos.x + padding,
      y: pos.y + padding,
      width: tile.innerWidth,
      height: tile.innerHeight,
      angle: tile.angle,
    };
  });

  return { canvas, mapping };
}
