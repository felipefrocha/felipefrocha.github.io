import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { presentations } from '../src/client/src/content/presentations';

const SOCIAL_META_PATTERN = /<!-- social-meta:start -->[\s\S]*?<!-- social-meta:end -->/;
const TITLE_PATTERN = /<title>[\s\S]*?<\/title>/;

export interface SocialMetadata {
  title: string;
  description: string;
  canonicalUrl: string;
  imageUrl: string;
  imageAlt: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  author?: string;
  tags?: string[];
  structuredData?: object | object[];
}

interface BlogPostMetadata {
  slug: string;
  title: string;
  excerpt: string;
  image?: string;
  date?: string;
  author?: string;
  tags?: string[];
}

interface ProfileMetadata {
  name?: string;
  bio?: string;
}

interface GenerateSocialPagesOptions {
  rootDir?: string;
  siteUrl?: string;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

function absoluteUrl(siteUrl: string, value: string): string {
  if (/^https?:\/\//i.test(value)) return value;
  return new URL(value.startsWith('/') ? value : `/${value}`, `${siteUrl}/`).toString();
}

function imageMimeType(imageUrl: string): string {
  const pathname = new URL(imageUrl).pathname.toLowerCase();
  if (pathname.endsWith('.jpg') || pathname.endsWith('.jpeg')) return 'image/jpeg';
  if (pathname.endsWith('.webp')) return 'image/webp';
  return 'image/png';
}

function isoDate(value?: string): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

export function renderSocialMetadata(metadata: SocialMetadata): string {
  const type = metadata.type || 'website';
  const title = escapeHtml(metadata.title);
  const description = escapeHtml(metadata.description);
  const canonicalUrl = escapeHtml(metadata.canonicalUrl);
  const imageUrl = escapeHtml(metadata.imageUrl);
  const imageAlt = escapeHtml(metadata.imageAlt);
  const tags = metadata.tags || [];

  const articleMetadata = type === 'article'
    ? [
        metadata.publishedTime
          ? `    <meta property="article:published_time" content="${escapeHtml(metadata.publishedTime)}" />`
          : '',
        metadata.author
          ? `    <meta property="article:author" content="${escapeHtml(metadata.author)}" />`
          : '',
        ...tags.map((tag) => `    <meta property="article:tag" content="${escapeHtml(tag)}" />`),
      ].filter(Boolean)
    : [];

  return [
    '    <!-- social-meta:start -->',
    `    <meta name="description" content="${description}" />`,
    `    <link rel="canonical" href="${canonicalUrl}" />`,
    '',
    `    <meta property="og:type" content="${type}" />`,
    `    <meta property="og:url" content="${canonicalUrl}" />`,
    `    <meta property="og:title" content="${title}" />`,
    `    <meta property="og:description" content="${description}" />`,
    `    <meta property="og:image" content="${imageUrl}" />`,
    `    <meta property="og:image:secure_url" content="${imageUrl}" />`,
    `    <meta property="og:image:type" content="${imageMimeType(metadata.imageUrl)}" />`,
    '    <meta property="og:image:width" content="1200" />',
    '    <meta property="og:image:height" content="627" />',
    `    <meta property="og:image:alt" content="${imageAlt}" />`,
    '    <meta property="og:site_name" content="Felipe F. Rocha" />',
    '    <meta property="og:locale" content="en_US" />',
    ...articleMetadata,
    '',
    '    <meta name="twitter:card" content="summary_large_image" />',
    `    <meta name="twitter:url" content="${canonicalUrl}" />`,
    `    <meta name="twitter:title" content="${title}" />`,
    `    <meta name="twitter:description" content="${description}" />`,
    `    <meta name="twitter:image" content="${imageUrl}" />`,
    `    <meta name="twitter:image:alt" content="${imageAlt}" />`,
    '    <meta name="twitter:creator" content="@_felipefrocha" />',
    ...(metadata.structuredData
      ? [`    <script type="application/ld+json">${serializeJsonLd(metadata.structuredData)}</script>`]
      : []),
    '    <!-- social-meta:end -->',
  ].join('\n');
}

export function injectSocialMetadata(html: string, metadata: SocialMetadata): string {
  if (!SOCIAL_META_PATTERN.test(html)) {
    throw new Error('The built index.html is missing the social metadata markers.');
  }

  const socialMeta = renderSocialMetadata(metadata);
  const titleTag = `<title>${escapeHtml(metadata.title)}</title>`;

  return html
    .replace(SOCIAL_META_PATTERN, () => socialMeta)
    .replace(TITLE_PATTERN, () => titleTag);
}

function writeRouteHtml(buildDir: string, route: string, html: string): void {
  const resolvedBuildDir = path.resolve(buildDir);
  const relativeRoute = route.replace(/^\/+|\/+$/g, '');
  const routeRelativePath = relativeRoute ? `${relativeRoute}.html` : 'index.html';
  const outputPath = path.resolve(resolvedBuildDir, routeRelativePath);

  if (!outputPath.startsWith(resolvedBuildDir + path.sep)) {
    throw new Error(`Invalid route path traversal detected: ${route}`);
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, html, 'utf8');
}

export function generateSocialPages(options: GenerateSocialPagesOptions = {}): number {
  const rootDir = options.rootDir || process.cwd();
  const siteUrl = (options.siteUrl || process.env.VITE_SITE_URL || 'https://www.feliperocha.systems').replace(/\/$/, '');
  const buildDir = path.join(rootDir, 'dist/public');
  const indexPath = path.join(buildDir, 'index.html');
  const postsPath = path.join(rootDir, 'src/client/public/api/en/posts.json');
  const profilePath = path.join(rootDir, 'src/client/public/api/profile.json');

  if (!fs.existsSync(indexPath)) {
    throw new Error(`Build output not found at ${indexPath}. Run Vite before generating social pages.`);
  }

  const template = fs.readFileSync(indexPath, 'utf8');
  const posts = JSON.parse(fs.readFileSync(postsPath, 'utf8')) as BlogPostMetadata[];
  const profile = JSON.parse(fs.readFileSync(profilePath, 'utf8')) as ProfileMetadata;
  const defaultImage = absoluteUrl(siteUrl, '/assets/social-card.png');
  const articleImage = absoluteUrl(siteUrl, '/assets/social-card-article.png');

  const basePages: Array<{ route: string; metadata: SocialMetadata }> = [
    {
      route: '/',
      metadata: {
        title: 'Felipe F. Rocha - Systems Engineer, Developer, Writer',
        description: 'Systems Engineer, developer, and writer exploring AI architecture, system design, and engineering delivery.',
        canonicalUrl: siteUrl,
        imageUrl: defaultImage,
        imageAlt: 'Felipe F. Rocha - engineering systems that scale',
      },
    },
    {
      route: '/blog',
      metadata: {
        title: 'Blog | Felipe F. Rocha',
        description: 'Read articles about software development, systems engineering, architecture, and technology insights.',
        canonicalUrl: `${siteUrl}/blog`,
        imageUrl: articleImage,
        imageAlt: 'Systems Notes by Felipe F. Rocha',
      },
    },
    {
      route: '/portfolio',
      metadata: {
        title: 'Portfolio | Felipe F. Rocha',
        description: 'Explore software engineering projects, systems architecture, and technical solutions by Felipe F. Rocha.',
        canonicalUrl: `${siteUrl}/portfolio`,
        imageUrl: defaultImage,
        imageAlt: 'Felipe F. Rocha - systems engineering portfolio',
      },
    },
    {
      route: '/about',
      metadata: {
        title: 'About | Felipe F. Rocha',
        description: profile.bio || 'Learn more about Felipe F. Rocha, Systems Engineer, developer, and writer.',
        canonicalUrl: `${siteUrl}/about`,
        imageUrl: defaultImage,
        imageAlt: 'Felipe F. Rocha - Systems Engineer',
        type: 'profile',
      },
    },
    {
      route: '/contact',
      metadata: {
        title: 'Contact | Felipe F. Rocha',
        description: 'Get in touch with Felipe F. Rocha about systems engineering, AI architecture, and software delivery.',
        canonicalUrl: `${siteUrl}/contact`,
        imageUrl: defaultImage,
        imageAlt: 'Contact Felipe F. Rocha',
      },
    },
  ];

  for (const page of basePages) {
    writeRouteHtml(buildDir, page.route, injectSocialMetadata(template, page.metadata));
  }

  for (const post of posts) {
    const canonicalUrl = `${siteUrl}/blog/${post.slug}`;
    const imageUrl = post.image ? absoluteUrl(siteUrl, post.image) : articleImage;
    const authorName = post.author || profile.name || 'Felipe F. Rocha';
    const publishedTime = isoDate(post.date);
    writeRouteHtml(buildDir, `/blog/${post.slug}`, injectSocialMetadata(template, {
      title: `${post.title} | Felipe F. Rocha`,
      description: post.excerpt,
      canonicalUrl,
      imageUrl,
      imageAlt: post.title,
      type: 'article',
      publishedTime,
      author: authorName,
      tags: post.tags,
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        image: imageUrl,
        ...(publishedTime ? { datePublished: publishedTime, dateModified: publishedTime } : {}),
        author: {
          '@type': 'Person',
          name: authorName,
          url: siteUrl,
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl,
        },
        url: canonicalUrl,
        ...(post.tags?.length ? { keywords: post.tags.join(', ') } : {}),
      },
    }));
  }

  for (const presentation of presentations) {
    const content = presentation.translations.en;
    const canonicalUrl = `${siteUrl}/presentations/${presentation.slug}`;
    writeRouteHtml(buildDir, `/presentations/${presentation.slug}`, injectSocialMetadata(template, {
      title: `${content.title} | Felipe F. Rocha`,
      description: content.subtitle,
      canonicalUrl,
      imageUrl: articleImage,
      imageAlt: `${content.title} presentation by Felipe F. Rocha`,
    }));
  }

  return basePages.length + posts.length + presentations.length;
}

const entrypoint = process.argv[1] ? path.resolve(process.argv[1]) : '';
if (entrypoint && fileURLToPath(import.meta.url) === entrypoint) {
  const pageCount = generateSocialPages();
  console.log(`Generated crawler-ready metadata for ${pageCount} routes.`);
}
