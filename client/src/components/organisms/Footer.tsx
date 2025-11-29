import { NewsletterForm } from '@/components/molecules/NewsletterForm';
import { SocialIcon } from '@/components/atoms/SocialIcon';
import { Link } from 'wouter';
import type { SocialLink } from '@/types/blog';

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
      className="border-t border-border bg-muted/20"
      role="contentinfo"
      data-testid="footer"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-8 py-12">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe to get updates on new posts and projects.
            </p>
            <NewsletterForm />
          </div>
          
          <nav aria-label="Quick links">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a 
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      data-testid={`link-footer-${link.label.toLowerCase()}`}
                    >
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Social</h3>
            <div className="flex items-center gap-1">
              {socialLinks.map((link) => (
                <SocialIcon
                  key={link.platform}
                  platform={link.platform}
                  url={link.url}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
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
