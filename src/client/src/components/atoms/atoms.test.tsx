import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { TooltipProvider } from '@/components/ui/tooltip';
import { StatNumber } from './StatNumber';
import { SkillTag } from './SkillTag';
import { SocialIcon } from './SocialIcon';
import { SEO } from './SEO';

describe('StatNumber', () => {
  it('renders value, label and a slugified testid', () => {
    render(<StatNumber value="7+" label="Years Experience" />);
    expect(screen.getByText('7+')).toBeInTheDocument();
    expect(screen.getByTestId('stat-years-experience')).toBeInTheDocument();
  });
});

describe('SkillTag', () => {
  it('renders the skill with a slugified testid', () => {
    render(<SkillTag skill="React Query" />);
    const tag = screen.getByTestId('badge-skill-react-query');
    expect(tag).toHaveTextContent('React Query');
  });
});

describe('SocialIcon', () => {
  const renderIcon = (props: Parameters<typeof SocialIcon>[0]) =>
    render(
      <TooltipProvider>
        <SocialIcon {...props} />
      </TooltipProvider>,
    );

  it('builds a profile URL from the handle', () => {
    renderIcon({ platform: 'github', handle: 'felipefrocha' });
    const link = screen.getByTestId('link-social-github').closest('a')!;
    expect(link).toHaveAttribute('href', 'https://github.com/felipefrocha');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('builds LinkedIn and Instagram URLs from handles', () => {
    const { unmount } = renderIcon({ platform: 'linkedin', handle: 'felipefonsecarocha' });
    expect(screen.getByTestId('link-social-linkedin').closest('a')).toHaveAttribute(
      'href',
      'https://linkedin.com/in/felipefonsecarocha',
    );
    unmount();
    renderIcon({ platform: 'instagram', handle: '_felipefrocha' });
    expect(screen.getByTestId('link-social-instagram').closest('a')).toHaveAttribute(
      'href',
      'https://instagram.com/_felipefrocha',
    );
  });

  it('falls back to the provided url when no handle', () => {
    renderIcon({ platform: 'linkedin', url: 'https://custom.example' });
    const link = screen.getByTestId('link-social-linkedin').closest('a')!;
    expect(link).toHaveAttribute('href', 'https://custom.example');
  });

  it('renders the small size variant', () => {
    renderIcon({ platform: 'github', handle: 'x', size: 'sm' });
    expect(screen.getByTestId('link-social-github')).toBeInTheDocument();
  });

  it('falls back to "#" when neither handle nor url is given', () => {
    renderIcon({ platform: 'instagram' });
    const link = screen.getByTestId('link-social-instagram').closest('a')!;
    expect(link).toHaveAttribute('href', '#');
  });
});

describe('SEO', () => {
  it('sets a titled document and meta description for articles', async () => {
    render(
      <HelmetProvider>
        <SEO
          title="The Agentic SDLC"
          description="A blueprint."
          type="article"
          tags={['ai']}
          canonical="https://www.feliperocha.systems/blog/agentic-sdlc"
          structuredData={{ '@type': 'BlogPosting' }}
        />
      </HelmetProvider>,
    );
    await waitFor(() => expect(document.title).toContain('The Agentic SDLC'));
    const desc = document.head.querySelector('meta[name="description"]');
    expect(desc?.getAttribute('content')).toBe('A blueprint.');
    await waitFor(() => {
      const ld = document.head.querySelector('script[type="application/ld+json"]');
      expect(ld?.textContent).toContain('BlogPosting');
    });
  });

  it('falls back to the default title when none is provided', async () => {
    render(
      <HelmetProvider>
        <SEO />
      </HelmetProvider>,
    );
    await waitFor(() => expect(document.title).toMatch(/Felipe F\. Rocha/));
  });

  it('prefixes relative image paths with the site URL', async () => {
    render(
      <HelmetProvider>
        <SEO title="X" image="/assets/custom.png" />
      </HelmetProvider>,
    );
    await waitFor(() => {
      const og = document.head.querySelector('meta[property="og:image"]');
      expect(og?.getAttribute('content')).toMatch(/^https?:\/\/.+\/assets\/custom\.png$/);
    });
  });
});
