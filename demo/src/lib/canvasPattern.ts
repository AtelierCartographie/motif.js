import { motif, type PatternOptions } from "motif.js";

export type CanvasPatternParams = {
  options: PatternOptions;
  width: number;
  height: number;
  showError?: boolean;
};

export function canvasPattern(node: HTMLCanvasElement, params: CanvasPatternParams) {
  function render(next: CanvasPatternParams) {
    const { options, width, height, showError } = next;
    if (!width || !height) return;

    const dpr = typeof devicePixelRatio !== "undefined" ? devicePixelRatio : 1;
    node.width = Math.round(width * dpr);
    node.height = Math.round(height * dpr);
    node.style.width = `${width}px`;
    node.style.height = `${height}px`;

    const ctx = node.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    try {
      const p = motif(options);
      ctx.fillStyle = p.context(ctx);
      ctx.beginPath();
      ctx.rect(0, 0, width, height);
      p.apply();
    } catch {
      if (!showError) return;
      ctx.fillStyle = "#f1f5f9";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = "#94a3b8";
      ctx.font = "14px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Render error", width / 2, height / 2);
    }
  }

  render(params);

  return {
    update(next: CanvasPatternParams) {
      render(next);
    },
  };
}
