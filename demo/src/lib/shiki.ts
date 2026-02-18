import { createHighlighter, type Highlighter } from 'shiki';

let highlighter: Highlighter | null = null;

export async function highlight(code: string, lang: string = 'typescript'): Promise<string> {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ['github-light', 'github-dark'],
      langs: ['javascript', 'typescript', 'json', 'html', 'css', 'bash'],
    });
  }

  try {
    return highlighter.codeToHtml(code, {
      lang,
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultColor: 'light',
    });
  } catch {
    // Fallback: return code in pre tag if highlighting fails
    return `<pre class="code-block">${escapeHtml(code)}</pre>`;
  }
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
