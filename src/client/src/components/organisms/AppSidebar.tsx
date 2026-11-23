import { Home, FileText, FolderKanban, User, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { ProfileCard } from '@/components/molecules/ProfileCard';
import { SocialIcon } from '@/components/atoms/SocialIcon';
import { Link, useLocation } from 'wouter';
import type { SocialLink } from '@shared/schema';

interface AppSidebarProps {
  profile: {
    name: string;
    tagline: string;
    avatar?: string;
  };
  socialLinks: SocialLink[];
}

export function AppSidebar({ profile, socialLinks }: AppSidebarProps) {
  const { t } = useTranslation();
  const [location] = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const navItems = [
    { href: '/', icon: Home, label: t('nav.home') },
    { href: '/blog', icon: FileText, label: t('nav.blog') },
    { href: '/portfolio', icon: FolderKanban, label: t('nav.portfolio') },
    { href: '/about', icon: User, label: t('nav.about') },
    { href: '/contact', icon: Mail, label: t('nav.contact') },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border/60">
      <SidebarHeader className="px-2 pt-3 pb-1">
        {!isCollapsed && <ProfileCard {...profile} />}
      </SidebarHeader>

      <SidebarContent className="px-1">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {navItems.map((item) => {
                const isActive =
                  location === item.href ||
                  (item.href !== '/' && location.startsWith(item.href));

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                      className="h-9 text-sm font-normal data-[active=true]:font-medium"
                    >
                      <Link
                        href={item.href}
                        data-testid={`link-nav-${item.label.toLowerCase()}`}
                      >
                        <item.icon className="h-4 w-4 opacity-75" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/50 px-2 py-2">
        <nav
          className={`flex items-center gap-0.5 ${
            isCollapsed ? 'flex-col justify-center' : 'flex-row justify-start px-1'
          }`}
          aria-label="Social media links"
        >
          {Array.isArray(socialLinks)
            ? socialLinks.map((link) => (
                <SocialIcon
                  key={link.platform}
                  platform={link.platform}
                  handle={link.handle}
                  url={link.url}
                  size="sm"
                />
              ))
            : null}
        </nav>
      </SidebarFooter>
    </Sidebar>
  );
}
