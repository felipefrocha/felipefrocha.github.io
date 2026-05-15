import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface NavLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  collapsed?: boolean;
}

export function NavLink({ href, icon: Icon, label, collapsed }: NavLinkProps) {
  const [location] = useLocation();
  const isActive = location === href || (href !== '/' && location.startsWith(href));

  return (
    <Link href={href}>
      <a
        className={cn(
          'flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover-elevate',
          isActive && 'bg-sidebar-accent text-sidebar-accent-foreground border-l-2 border-primary',
          collapsed && 'justify-center px-2'
        )}
        data-testid={`link-nav-${label.toLowerCase().replace(/\s+/g, '-')}`}
        aria-current={isActive ? 'page' : undefined}
      >
        <Icon className="h-5 w-5 shrink-0" />
        {!collapsed && <span className="text-sm font-medium">{label}</span>}
      </a>
    </Link>
  );
}
