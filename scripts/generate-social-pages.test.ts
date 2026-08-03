import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  generateSocialPages,
  injectSocialMetadata,
  renderSocialMetadata,
} from './generate-social-pages';

const tempDirectories: string[] = [];

afterEach(() => {
  for (const directory of tempDirectories.splice(0)) {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

describe('social metadata generation', () => {
  it('renders complete Open Graph and Twitter metadata with escaped content', () => {
    const metadata = renderSocialMetadata({
      title: 'Systems & AI',
      description: 'Architecture < delivery',
      canonicalUrl: 'https://example.com/blog/systems',
      imageUrl: 'https://example.com/social.png',
      imageAlt: 'Systems & AI social card',
      type: 'article',
      tags: ['AI & systems'],
    });

    expect(metadata).toContain('property="og:image" content="https://example.com/social.png"');
    expect(metadata).toContain('property="og:image:width" content="1200"');
    expect(metadata).toContain('name="twitter:card" content="summary_large_image"');
    expect(metadata).toContain('Systems &amp; AI');
    expect(metadata).toContain('Architecture &lt; delivery');
    expect(metadata).toContain('property="article:tag" content="AI &amp; systems"');
  });

  it('injects metadata and the document title into the crawler-facing HTML', () => {
    const html = '<head><!-- social-meta:start --><meta name="old" /><!-- social-meta:end --><title>Old</title></head>';
    const output = injectSocialMetadata(html, {
      title: 'A crawler-ready page',
      description: 'A useful description',
      canonicalUrl: 'https://example.com/page',
      imageUrl: 'https://example.com/social.png',
      imageAlt: 'Social preview',
    });

    expect(output).toContain('<title>A crawler-ready page</title>');
    expect(output).toContain('property="og:url" content="https://example.com/page"');
    expect(output).not.toContain('name="old"');
  });

  it('writes a dedicated initial HTML document for each shareable route', () => {
    const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'social-pages-'));
    tempDirectories.push(rootDir);

    const publicDir = path.join(rootDir, 'src/client/public/api');
    const buildDir = path.join(rootDir, 'dist/public');
    fs.mkdirSync(publicDir, { recursive: true });
    fs.mkdirSync(buildDir, { recursive: true });
    fs.writeFileSync(
      path.join(buildDir, 'index.html'),
      '<head><!-- social-meta:start --><!-- social-meta:end --><title>Base</title></head>',
    );
    fs.writeFileSync(path.join(publicDir, 'profile.json'), JSON.stringify({ name: 'Felipe F. Rocha', bio: 'Profile bio' }));
    fs.mkdirSync(path.join(publicDir, 'en'), { recursive: true });
    fs.writeFileSync(path.join(publicDir, 'en/posts.json'), JSON.stringify([{
      slug: 'systems-and-ai',
      title: 'Systems & AI',
      excerpt: 'A social-ready article.',
      tags: ['architecture'],
    }]));

    const count = generateSocialPages({ rootDir, siteUrl: 'https://example.com' });
    const articleHtml = fs.readFileSync(
      path.join(buildDir, 'blog/systems-and-ai.html'),
      'utf8',
    );

    expect(count).toBeGreaterThan(6);
    expect(articleHtml).toContain('<title>Systems &amp; AI | Felipe F. Rocha</title>');
    expect(articleHtml).toContain('property="og:type" content="article"');
    expect(articleHtml).toContain('https://example.com/assets/social-card-article.png');
    expect(fs.existsSync(path.join(buildDir, 'portfolio.html'))).toBe(true);
    expect(fs.existsSync(path.join(buildDir, 'presentations/agentic-sdlc.html'))).toBe(true);
  });
});
