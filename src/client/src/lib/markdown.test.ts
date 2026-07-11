import { describe, it, expect } from 'vitest';
import { renderMarkdown, countWords } from './markdown';

describe('renderMarkdown', () => {
  it('renders headings and inline formatting to semantic HTML', () => {
    const html = renderMarkdown('# Title\n\nSome **bold** and *italic* text.');
    expect(html).toContain('<h1>Title</h1>');
    expect(html).toContain('<strong>bold</strong>');
    expect(html).toContain('<em>italic</em>');
  });

  it('renders ordered and unordered lists', () => {
    const html = renderMarkdown('- one\n- two\n\n1. first\n2. second');
    expect(html).toContain('<ul>');
    expect(html).toContain('<ol>');
    expect(html).toMatch(/<li>one<\/li>/);
  });

  it('renders fenced code blocks', () => {
    const html = renderMarkdown('```\nconst x = 1;\n```');
    expect(html).toContain('<pre>');
    expect(html).toContain('<code');
    expect(html).toContain('const x = 1;');
  });

  it('renders links', () => {
    const html = renderMarkdown('[site](https://example.com)');
    expect(html).toContain('href="https://example.com"');
  });

  it('strips dangerous script tags (XSS sanitization)', () => {
    const html = renderMarkdown('Hello<script>alert("xss")</script> world');
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('alert("xss")');
    expect(html).toContain('Hello');
  });

  it('strips inline event handlers', () => {
    const html = renderMarkdown('<img src="x" onerror="alert(1)">');
    expect(html).not.toContain('onerror');
  });
});

describe('countWords', () => {
  it('counts whitespace-separated words', () => {
    expect(countWords('the quick brown fox')).toBe(4);
  });

  it('collapses irregular whitespace and newlines', () => {
    expect(countWords('  a\n\n  b   c \t d ')).toBe(4);
  });

  it('returns 0 for empty or whitespace-only input', () => {
    expect(countWords('')).toBe(0);
    expect(countWords('   \n  ')).toBe(0);
  });
});
