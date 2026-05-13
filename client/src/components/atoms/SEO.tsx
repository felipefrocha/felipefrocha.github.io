import { Helmet } from 'react-helmet-async';

export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article' | 'profile';
  canonical?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
  structuredData?: object | object[];
}

const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://www.feliperocha.systems';
const DEFAULT_IMAGE = `${SITE_URL}/assets/avatar.jpg`;
const DEFAULT_TITLE = 'Felipe F. Rocha - Systems Engineer, Developer, Writer';
const DEFAULT_DESCRIPTION = 'Personal portfolio and blog showcasing projects, thoughts, and creative work. Systems Engineer with over 7 years of experience building and integrating complex systems.';

export function SEO({
  title,
  description,
  image = DEFAULT_IMAGE,
  type = 'website',
  canonical,
  publishedTime,
  modifiedTime,
  author = 'Felipe F. Rocha',
  tags = [],
  structuredData,
}: SEOProps) {
  const fullTitle = title ? `${title} | Felipe F. Rocha` : DEFAULT_TITLE;
  const metaDescription = description || DEFAULT_DESCRIPTION;
  const canonicalUrl = canonical || (typeof window !== 'undefined' ? window.location.href : SITE_URL);
  const imageUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content="Felipe's Portal" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:creator" content="@_felipefrocha" />

      {/* Article specific */}
      {type === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
          {tags.map((tag) => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(
            Array.isArray(structuredData) ? structuredData : [structuredData]
          )}
        </script>
      )}
    </Helmet>
  );
}

