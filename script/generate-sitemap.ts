import { writeFile } from 'fs/promises';
import { join } from 'path';
import { getAllBlogPosts } from '../server/content';

const SITE_URL = process.env.VITE_SITE_URL || 'https://www.feliperocha.systems';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

function formatDate(date: Date | string): string {
  const d = date instanceof Date ? date : new Date(date);
  return d.toISOString().split('T')[0];
}

async function generateSitemap() {
  const posts = getAllBlogPosts();
  const now = new Date().toISOString().split('T')[0];

  const staticPages: SitemapUrl[] = [
    { loc: '/', changefreq: 'weekly', priority: 1.0 },
    { loc: '/blog', changefreq: 'weekly', priority: 0.9 },
    { loc: '/portfolio', changefreq: 'monthly', priority: 0.8 },
    { loc: '/about', changefreq: 'monthly', priority: 0.8 },
    { loc: '/contact', changefreq: 'monthly', priority: 0.7 },
  ];

  const blogPages: SitemapUrl[] = posts.map(post => ({
    loc: `/blog/${post.slug}`,
    lastmod: post.date ? formatDate(post.date) : now,
    changefreq: 'monthly' as const,
    priority: post.featured ? 0.9 : 0.7,
  }));

  const allUrls = [...staticPages, ...blogPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (url) => `  <url>
    <loc>${SITE_URL}${url.loc}</loc>
    ${url.lastmod ? `    <lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `    <changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority !== undefined ? `    <priority>${url.priority}</priority>` : ''}
  </url>`
  )
  .join('\n')}
</urlset>`;

  const outputPath = join(process.cwd(), 'client', 'public', 'sitemap.xml');
  await writeFile(outputPath, sitemap, 'utf-8');
  console.log(`✅ Generated sitemap.xml with ${allUrls.length} URLs`);
}

generateSitemap().catch((err) => {
  console.error('Error generating sitemap:', err);
  process.exit(1);
});

