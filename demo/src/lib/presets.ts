import type { PatternOptions } from 'motif.js';

export interface Preset {
  name: string;
  options: PatternOptions;
}

export const presets: Preset[] = [
  {
    name: "Thin lines",
    options: { type: "line", size: 10 }
  },
  {
    name: "Hatches",
    options: { type: "line", scale: 0.5, size: 15, angle: 45, fill: "#f08080", background: "#fde6db" }
  },
  {
    name: "Grid",
    options: { type: "plaid", scale: 2.5, size: 30, fill: "#20b2aa" }
  },
  {
    name: "Circles",
    options: { type: "circle", scale: 1, size: 15, fill: "#2861bd" }
  },
  {
    name: "Circles outlined",
    options: { type: "circle", scale: 0.75, size: 15, angle: 45, fill: "#ffffff", stroke: "#000000", strokeWidth: 1 }
  },
  {
    name: "Crosses",
    options: { type: "cross", scale: 2, size: 6 }
  },
  {
    name: "Crosses XL",
    options: { type: "cross", scale: 5, size: 55, fill: "#c6cbc3" }
  },
  {
    name: "Triangles",
    options: { type: "triangle", scale: 3, size: 10, angle: 0, fill: "#ffffff", background: "#000000"}
  },
  {
    name: "Plus",
    options: { type: "plus", scale: 4, size: 21, angle: 15, fill: "#f08080", stroke: "#000000", strokeWidth: 2  }
  },
  {
    name: "Royal blue",
    options: { type: "square", scale: 2.5, size: 5, angle: 45, fill: "#ffd700", background: "#00009D" }
  },
  {
    name: "Tartan",
    options: { type: "plaid", scale: 4, size: 10, angle: 160, fill: "#ffffff", stroke: "#dc143c", strokeWidth: 7, background: "#deb887", border: 3 }
  }
];
