import { marked } from 'marked';
import DOMPurify from 'dompurify';

// Configure once: GitHub-flavored markdown with proper block semantics.
marked.setOptions({
  gfm: true,
  breaks: false,
});

/**
 * Render trusted markdown (authored blog content) to sanitized HTML.
 * Uses a real parser so headings, lists, tables, blockquotes and code
 * blocks produce semantic HTML — better for readers and for SEO than
 * the previous regex-based formatter.
 */
export function renderMarkdown(markdown: string): string {
  const rawHtml = marked.parse(markdown, { async: false }) as string;
  return DOMPurify.sanitize(rawHtml, {
    ADD_ATTR: ['target', 'rel'],
  });
}

/** Approximate word count of markdown source, for reading time / SEO metadata. */
export function countWords(markdown: string): number {
  return markdown.trim().split(/\s+/).filter(Boolean).length;
}
