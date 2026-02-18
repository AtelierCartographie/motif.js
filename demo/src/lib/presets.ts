import type { PatternOptions } from 'motif.js';

export interface Preset {
  name: string;
  options: PatternOptions;
}

export const presets: Preset[] = [
  {
    name: "Hachures",
    options: { type: "line", angle: 45, size: 25, fill: "#1e3a5f", background: "#ffffff" }
  },
  {
    name: "Pointillés",
    options: { type: "circle", size: 25, fill: "#c1121f", background: "#ffffff" }
  },
  {
    name: "Tartan",
    options: { type: "plaid", size: 30, fill: "#2d6a4f", background: "#ffffff" }
  },
  {
    name: "Plus",
    options: { type: "plus", size: 30, fill: "#7209b7", background: "#ffffff" }
  },
  {
    name: "Croisillons",
    options: { type: "cross", size: 20, fill: "#e76f51", background: "#ffffff" }
  },
  {
    name: "Triangles",
    options: { type: "triangle", size: 35, fill: "#264653", background: "#ffffff" }
  },
  {
    name: "Carrés",
    options: { type: "square", size: 25, fill: "#e9c46a", background: "#264653" }
  },
  {
    name: "Losanges",
    options: { type: "diamond", size: 25, fill: "#2a9d8f", background: "#ffffff" }
  },
  {
    name: "Lignes fines",
    options: { type: "line", size: 10, angle: 0, fill: "#000000", background: "#ffffff" }
  },
  {
    name: "Gros pois",
    options: { type: "circle", size: 50, fill: "#d62828", background: "#ffffff", patchSize: true }
  },
  {
    name: "Grille dense",
    options: { type: "plaid", size: 50, fill: "#003049", background: "#ffffff" }
  },
  {
    name: "Diagonale",
    options: { type: "line", angle: -30, size: 30, fill: "#f77f00", background: "#ffffff" }
  },
  {
    name: "Rayures cobalt",
    options: { type: "line", angle: 135, size: 20, fill: "#2563eb", background: "#dbeafe" }
  },
  {
    name: "Pois bicolores",
    options: { type: "circle", size: 35, fill: "#10b981", background: "#ecfdf5", scale: 1.5 }
  },
  {
    name: "Croix fines",
    options: { type: "cross", size: 12, fill: "#6366f1", background: "#eef2ff" }
  },
  {
    name: "Triangles denses",
    options: { type: "triangle", size: 45, fill: "#0f172a", background: "#f8fafc", patchSize: true }
  },
];
