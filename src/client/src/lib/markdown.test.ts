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

  it('renders fenced code blocks with keyboard-accessible region attributes', () => {
    const html = renderMarkdown('```\nconst x = 1;\n```');
    expect(html).toContain('<pre tabindex="0" role="region" aria-label="Code snippet">');
    expect(html).toContain('<code');
    expect(html).toContain('const x = 1;');
  });

  it('renders links and enforces rel="noopener noreferrer" on external and target="_blank" links', () => {
    const html = renderMarkdown('[site](https://example.com) and <a href="https://example.org" target="_blank">ext</a>');
    expect(html).toContain('href="https://example.com"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain('target="_blank"');
  });

  it('strips dangerous script tags and javascript: URLs (XSS sanitization)', () => {
    const html = renderMarkdown('Hello<script>alert("xss")</script> [bad](javascript:alert(1)) world');
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('alert("xss")');
    expect(html).not.toContain('javascript:');
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
