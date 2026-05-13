import type { BlogPost, ProfileInfo, SocialLink, Project } from '@/types/blog';

const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://www.feliperocha.systems';

export interface StructuredDataOptions {
  profile?: ProfileInfo;
  socialLinks?: SocialLink[];
}

export function generateWebsiteSchema(options: StructuredDataOptions = {}) {
  const { profile, socialLinks = [] } = options;
  
  const sameAs = socialLinks.map(link => {
    if (link.platform === 'github') return `https://github.com/${link.handle}`;
    if (link.platform === 'linkedin') return `https://linkedin.com/in/${link.handle}`;
    if (link.platform === 'instagram') return `https://instagram.com/${link.handle}`;
    return link.url;
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: "Felipe's Portal",
    url: SITE_URL,
    description: 'Personal portfolio and blog showcasing projects, thoughts, and creative work.',
    author: {
      '@type': 'Person',
      name: profile?.name || 'Felipe F. Rocha',
      jobTitle: profile?.tagline || 'Systems Engineer',
      url: SITE_URL,
      sameAs,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/blog?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generatePersonSchema(profile: ProfileInfo, socialLinks: SocialLink[] = []) {
  const sameAs = socialLinks.map(link => {
    if (link.platform === 'github') return `https://github.com/${link.handle}`;
    if (link.platform === 'linkedin') return `https://linkedin.com/in/${link.handle}`;
    if (link.platform === 'instagram') return `https://instagram.com/${link.handle}`;
    return link.url;
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.tagline,
    description: profile.bio,
    url: SITE_URL,
    image: profile.avatar ? `${SITE_URL}${profile.avatar}` : `${SITE_URL}/assets/avatar.jpg`,
    email: profile.email,
    address: profile.location ? {
      '@type': 'PostalAddress',
      addressLocality: profile.location,
    } : undefined,
    sameAs,
  };
}

export function generateBlogPostSchema(post: BlogPost, profile?: ProfileInfo) {
  const postUrl = `${SITE_URL}/blog/${post.slug}`;
  const imageUrl = post.image 
    ? (post.image.startsWith('http') ? post.image : `${SITE_URL}${post.image}`)
    : `${SITE_URL}/assets/avatar.jpg`;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: imageUrl,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: profile?.name || 'Felipe F. Rocha',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Person',
      name: profile?.name || 'Felipe F. Rocha',
      url: SITE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    url: postUrl,
    articleSection: post.category,
    keywords: post.tags.join(', '),
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateCollectionPageSchema(title: string, description: string, items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Article',
          name: item.name,
          url: item.url,
        },
      })),
    },
  };
}

