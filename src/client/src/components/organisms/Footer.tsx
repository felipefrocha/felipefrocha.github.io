import { NewsletterForm } from '@/components/molecules/NewsletterForm';
import { SocialIcon } from '@/components/atoms/SocialIcon';
import { Link } from 'wouter';
import type { SocialLink } from '@shared/schema';

interface FooterProps {
  socialLinks: SocialLink[];
}

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Footer({ socialLinks }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="border-t border-border/60 bg-background mt-12"
      data-testid="footer"
    >
      <div className="container-default max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr_auto] items-start">
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
              Newsletter
            </h3>
            <p className="text-sm text-muted-foreground mb-3 max-w-xs">
              Subscribe to get updates on new posts and projects.
            </p>
            <NewsletterForm />
          </div>

          <nav aria-label="Quick links">
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">
              Quick Links
            </h3>
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    data-testid={`link-footer-${link.label.toLowerCase()}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
              Social
            </h3>
            <div className="flex items-center gap-0.5 -ml-2">
              {socialLinks.map((link) => (
                <SocialIcon
                  key={link.platform}
                  platform={link.platform}
                  handle={link.handle}
                  url={link.url}
                  size="sm"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground font-mono">
            Built with React + Vite
          </p>
        </div>
      </div>
    </footer>
  );
}
