You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

## Available MCP Tools:

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.

## Project Workflow Rules

### Changelog discipline

- For every user request that results in a meaningful project change, update `CHANGELOG.md` in the same task.
- Add changes under `## [Unreleased]` using Keep a Changelog categories (`Added`, `Changed`, `Fixed`, `Removed`, `Deprecated`, `Security`).
- If `Unreleased` does not contain the needed category, create it.
- Keep entries short, factual, and user-facing.
- Do not add changelog entries for trivial internal edits (formatting only, typo-only, comments-only, CI metadata-only), unless the user explicitly asks.
- If a release is being prepared, move relevant `Unreleased` entries to the target version section only when the user asks for release prep.

### End-of-task check

- Before finalizing, verify whether `CHANGELOG.md` was updated when applicable.
