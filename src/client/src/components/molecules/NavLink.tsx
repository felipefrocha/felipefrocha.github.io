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
    <Link
      href={href}
      className={cn(
        'flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm transition-colors hover-elevate',
        isActive
          ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
          : 'text-muted-foreground hover:text-foreground',
        collapsed && 'justify-center px-2'
      )}
      data-testid={`link-nav-${label.toLowerCase().replace(/\s+/g, '-')}`}
      aria-current={isActive ? 'page' : undefined}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      {!collapsed && <span>{label}</span>}
    </Link>
  );
}
