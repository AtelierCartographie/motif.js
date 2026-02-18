<script lang="ts">
  import { canvasPattern } from "../lib/canvasPattern";

  let heroWidth = $state(0);
  let heroHeight = $state(0);
</script>

<section
  class="hero"
  bind:clientWidth={heroWidth}
  bind:clientHeight={heroHeight}
>
  <canvas
    class="hero-bg"
    aria-hidden="true"
    use:canvasPattern={{
      options: {
        type: "circle",
        size: 15,
        scale: 0.3,
        angle: 45,
        fill: "rgba(230, 20, 45, .3)",
        background: "transparent",
      },
      width: heroWidth,
      height: heroHeight,
    }}
  ></canvas>
  <div class="container">
    <div class="hero-content">
      <div class="hero-left">
        <h2 class="hero-intro">
          Create meaningful, customizable patterns for data visualization and
          cartography.
        </h2>
      </div>
      <div class="hero-features">
        <span class="feature-tag">8 Built-in Patterns</span>
        <span class="feature-tag">SVG & Canvas Support</span>
        <span class="feature-tag">Full Customization</span>
        <span class="feature-tag">Custom Shapes</span>
        <span class="feature-tag">TypeScript</span>
      </div>
    </div>
  </div>
</section>

<style>
  .hero {
    padding: 3rem 1rem;
    position: relative;
    overflow: hidden;
    border-radius: 10% / 50%;
  }

  .hero-bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
  }

  .container {
    position: relative;
    z-index: 1;
  }

  .hero-content {
    text-align: center;
  }

  .hero-left {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  .hero-intro {
    font-size: var(--typo-size-28);
    line-height: 1.6;
    margin: 0;
    color: grey;
  }

  .hero-features {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    justify-content: center;
    margin-top: 1.5rem;
  }

  .feature-tag {
    display: inline-block;
    padding: 0.5rem 1rem;
    font-size: var(--typo-size-16);
    font-weight: 500;
    background: rgba(230, 20, 45, 0.3);
    /* border: 1px solid rgba(0, 0, 0, 0.1); */
    border-radius: 20px;
    color: inherit;
  }

  @media (max-width: 768px) {
    .hero {
      padding: 1.5rem;
    }

    .hero-content {
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .hero-intro {
      font-size: var(--typo-size-20);
    }

    .feature-tag {
      font-size: var(--typo-size-14);
      padding: 0.4rem 0.8rem;
    }
  }
</style>
