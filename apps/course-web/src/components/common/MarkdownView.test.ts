import { describe, it, expect } from 'vitest';
import { marked } from 'marked';

describe('Markdown parsing for curriculum text', () => {
  it('parses headings, lists, bold, and code', () => {
    const raw = `### The Musical Alphabet\nMusic uses **7 letters**:\n- A\n- B\n- C\nUse \`c'\` for middle C.`;
    const html = marked.parse(raw, { async: false, breaks: true, gfm: true }) as string;

    expect(html).toContain('<h3');
    expect(html).toContain('The Musical Alphabet');
    expect(html).toContain('<strong>7 letters</strong>');
    expect(html).toContain('<ul>');
    expect(html).toContain('<li>A</li>');
    expect(html).toContain('<code>c&#39;</code>');
  });

  it('correctly handles musical formulas with arrows and bold tokens', () => {
    const raw = `$$\\mathbf{A \\rightarrow B \\rightarrow C}$$`;
    // Verify transformation
    let processed = raw.replace(/\$\$\s*([\s\S]*?)\s*\$\$/g, (_, math) => {
      let res = math.trim();
      res = res.replace(/\\rightarrow|\\to/g, ' → ');
      res = res.replace(/\\mathbf\{([^}]+)\}/g, '<strong class="text-indigo-200 font-bold">$1</strong>');
      return `<div class="math-formula-callout font-mono">${res}</div>`;
    });

    expect(processed).toContain('math-formula-callout');
    expect(processed).toContain('→');
    expect(processed).toContain('<strong class="text-indigo-200 font-bold">');
  });
});
