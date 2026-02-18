import { createHighlighter } from 'shiki';

const highlighter = await createHighlighter({
  themes: ['github-light', 'github-dark'],
  langs: ['javascript', 'typescript']
});

const code = `const pattern = motif({
  type: "circle"
});`;

const html = highlighter.codeToHtml(code, {
  lang: 'javascript',
  themes: {
    light: 'github-light',
    dark: 'github-dark'
  },
  defaultColor: false
});

console.log('=== FULL SHIKI OUTPUT ===');
console.log(html);
