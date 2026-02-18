<script lang="ts">
  import Header from "./components/Header.svelte";
  import HeroHeader from "./components/HeroHeader.svelte";
  import HowToUse from "./components/HowToUse.svelte";
  import Examples from "./components/Examples.svelte";
  import Generator from "./components/Generator.svelte";
  import AttentionPoints from "./components/AttentionPoints.svelte";
  import CustomShape from "./components/CustomShape.svelte";
  import Footer from "./components/Footer.svelte";
  // import "@fontsource-variable/atkinson-hyperlegible-next/wght-italic.css";
</script>

<Header />
<main>
  <HeroHeader />
  <HowToUse />
  <Examples />
  <Generator />
  <AttentionPoints />
  <CustomShape />
</main>
<Footer />

<style>
  main {
    padding: 1.5rem 1rem;
  }

  @media (min-width: 769px) {
    main {
      padding: 3rem;
      max-width: 75rem;
      margin: 0 auto;
      overflow: hidden;
    }
  }
</style>
