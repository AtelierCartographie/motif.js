<script lang="ts">
  import logo_svg from "$lib/assets/logo-atelier-red.svg?raw";
</script>

<header class="header">
  <div class="header-content">
    <a
      href="https://www.sciencespo.fr/cartographie/"
      aria-label="Accueil"
      class="logo-atelier"
      target="_blank"
      rel="noopener noreferrer"
      title="Atelier de cartographie de Sciences Po"
    >
      {@html logo_svg}
    </a>

    <h1>Motif.js</h1>

    <a
      href="https://github.com/AtelierCartographie/motif.js"
      class="github-link"
      target="_blank"
      rel="noopener noreferrer"
      title="GitHub repository"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"
        />
      </svg>
    </a>
  </div>
</header>

<style>
  header {
    margin-inline: auto;
    position: sticky;
    top: 0;
    z-index: 50;
    border-bottom: 1px solid light-dark(#d1d1d1, #4f4f4f);
    background-color: var(--background);
  }
  .header-content {
    height: 4rem;
    padding: 0 7.5rem;
    align-items: center;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-areas: "content";
  }

  .logo-atelier {
    grid-area: content;
    justify-self: start;
    z-index: 1;
  }

  h1 {
    grid-area: content;
    justify-self: center;
    margin: 0;
    font-size: 2rem;
    font-weight: 600;
  }

  .github-link {
    grid-area: content;
    justify-self: end;
    z-index: 1;
  }

  @media (min-width: 769px) {
    .header-content {
      padding: 0 2rem;
    }
  }

  .github-link {
    display: flex;
    align-items: center;
    color: inherit;
    transition: opacity 0.2s;
    flex-shrink: 0;
  }

  .github-link:hover {
    opacity: 0.7;
  }

  @media (max-width: 768px) {
    .header-content {
      padding: 0 1rem;
    }
    h1 {
      font-size: 1.5rem;
    }
  }
</style>
