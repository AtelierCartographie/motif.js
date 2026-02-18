import { createHighlighter } from 'shiki';

const highlighter = await createHighlighter({
  themes: ['github-light', 'github-dark'],
  langs: ['javascript', 'typescript']
});

const code = `const pattern = motif({
  type: "circle",
  size: 25
});`;

const html = highlighter.codeToHtml(code, {
  lang: 'javascript',
  themes: {
    light: 'github-light',
    dark: 'github-dark'
  },
  defaultColor: false
});

console.log('HTML généré par Shiki:');
console.log(html.substring(0, 200) + '...');
console.log('\nKEY INDICATORS:');
console.log('- <pre> tag present:', html.includes('<pre>'));
console.log('- <span> tags with styles:', html.match(/<span style="[^"]*">/g)?.length || 0);
console.log('- Contains color styles:', html.includes('color:') || html.includes('background-color:'));
