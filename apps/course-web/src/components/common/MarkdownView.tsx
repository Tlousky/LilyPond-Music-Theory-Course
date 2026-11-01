import React, { useMemo } from 'react';
import { marked } from 'marked';

interface MarkdownViewProps {
  content: string;
  className?: string;
  inline?: boolean;
}

/**
 * Formats mathematical / musical notation expressions (e.g. $$\mathbf{A \rightarrow B}$$)
 * into elegant styled badges with clear typography.
 */
function formatMathContent(math: string): string {
  let res = math.trim();
  res = res.replace(/\\rightarrow|\\to/g, ' → ');
  res = res.replace(/\\leftarrow/g, ' ← ');
  res = res.replace(/\\dots/g, '…');
  res = res.replace(/\\mathbf\{([^}]+)\}/g, '<strong class="text-indigo-200 font-bold">$1</strong>');
  res = res.replace(/\\text\{([^}]+)\}/g, '<span class="font-sans font-normal text-slate-300">$1</span>');
  res = res.replace(/\\quad/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
  res = res.replace(/\\qquad/g, '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
  res = res.replace(/\^\\circ/g, '°');
  res = res.replace(/\\\\/g, '<br/>');
  return res;
}

/**
 * Pre-processes markdown string to extract and convert mathematical formulas before markdown parsing.
 */
function preprocessMath(raw: string): string {
  if (!raw) return '';

  // Block math: $$ ... $$
  let processed = raw.replace(/\$\$\s*([\s\S]*?)\s*\$\$/g, (_, mathContent) => {
    const formatted = formatMathContent(mathContent);
    return `\n\n<div class="math-formula-callout font-mono">${formatted}</div>\n\n`;
  });

  // Inline math: $ ... $
  processed = processed.replace(/\$([^\$\n]+)\$/g, (_, mathContent) => {
    const formatted = formatMathContent(mathContent);
    return `<span class="math-formula-inline font-mono">${formatted}</span>`;
  });

  return processed;
}

export const MarkdownView: React.FC<MarkdownViewProps> = ({
  content,
  className = '',
  inline = false,
}) => {
  const parsedHtml = useMemo(() => {
    if (!content) return '';
    const preprocessed = preprocessMath(content);

    try {
      if (inline) {
        return marked.parseInline(preprocessed, { breaks: true, gfm: true }) as string;
      }
      return marked.parse(preprocessed, { breaks: true, gfm: true }) as string;
    } catch (err) {
      console.warn('Error parsing markdown:', err);
      return content;
    }
  }, [content, inline]);

  if (inline) {
    return (
      <span
        className={`markdown-view markdown-inline ${className}`}
        dangerouslySetInnerHTML={{ __html: parsedHtml }}
      />
    );
  }

  return (
    <div
      className={`markdown-view ${className}`}
      dangerouslySetInnerHTML={{ __html: parsedHtml }}
    />
  );
};
