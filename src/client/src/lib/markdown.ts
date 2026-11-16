import { marked } from 'marked';
import DOMPurify from 'dompurify';

// Configure once: GitHub-flavored markdown with proper block semantics.
marked.setOptions({
  gfm: true,
  breaks: false,
});

let hooksRegistered = false;

function ensureDomPurifyHooks() {
  if (hooksRegistered) return;
  hooksRegistered = true;

  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.nodeName === 'PRE') {
      node.setAttribute('tabindex', '0');
      node.setAttribute('role', 'region');
      if (!node.getAttribute('aria-label')) {
        node.setAttribute('aria-label', 'Code snippet');
      }
    }

    if (node.nodeName === 'A') {
      const href = node.getAttribute('href') || '';
      const isExternal = /^https?:\/\//i.test(href);
      const isBlankTarget = node.getAttribute('target') === '_blank';
      if (isExternal || isBlankTarget) {
        const existingRel = (node.getAttribute('rel') || '')
          .split(/\s+/)
          .filter(Boolean);
        const relSet = new Set(existingRel);
        relSet.add('noopener');
        relSet.add('noreferrer');
        node.setAttribute('rel', Array.from(relSet).join(' '));
      }
    }
  });
}

/**
 * Render trusted markdown (authored blog content) to sanitized HTML.
 * Uses a real parser so headings, lists, tables, blockquotes and code
 * blocks produce semantic HTML — better for readers and for SEO than
 * the previous regex-based formatter.
 */
export function renderMarkdown(markdown: string): string {
  ensureDomPurifyHooks();
  const rawHtml = marked.parse(markdown, { async: false }) as string;
  return DOMPurify.sanitize(rawHtml, {
    ADD_ATTR: ['target', 'rel', 'tabindex', 'role', 'aria-label'],
  });
}

/** Approximate word count of markdown source, for reading time / SEO metadata. */
export function countWords(markdown: string): number {
  return markdown.trim().split(/\s+/).filter(Boolean).length;
}
