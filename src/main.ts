import './style.css'

// Example avec Observable Plot (optionnel - installer avec: pnpm add @observablehq/plot)
// import * as Plot from "@observablehq/plot";

const app = document.getElementById('app')

if (app) {
  app.innerHTML = `
    <h1>Motif</h1>
    <p>Bienvenue dans votre projet Vite + TypeScript!</p>
    
    <section>
      <h2>Exemple avec Observable Plot</h2>
      <p>Pour utiliser Observable Plot, installez d'abord la dépendance:</p>
      <pre>pnpm add @observablehq/plot</pre>
      
      <p>Puis utilisez-le dans votre code:</p>
      <pre><code>import * as Plot from "@observablehq/plot";

const data = [
  {x: 1, y: 2},
  {x: 2, y: 3},
  {x: 3, y: 5}
];

const chart = Plot.plot({
  marks: [Plot.dot(data, {x: "x", y: "y"})]
});

document.getElementById('app').appendChild(chart);</code></pre>
      
      <div id="chart"></div>
    </section>
  `
}
