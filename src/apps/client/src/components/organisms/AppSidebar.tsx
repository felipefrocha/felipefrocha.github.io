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
import type { ProfileInfo, BlogPost, SocialLink, Project } from '@shared/schema';

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
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        {!isCollapsed && <ProfileCard {...profile} />}
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = location === item.href || 
                  (item.href !== '/' && location.startsWith(item.href));
                
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                    >
                      <Link 
                        href={item.href}
                        data-testid={`link-nav-${item.label.toLowerCase()}`}
                      >
                        <item.icon className="h-5 w-5" />
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

      <SidebarFooter className="border-t border-sidebar-border">
        <nav 
          className={`flex items-center justify-center gap-1 py-2 ${
            isCollapsed ? 'flex-col' : 'flex-row'
          }`}
          aria-label="Social media links"
        >
          {socialLinks.map((link) => (
            <SocialIcon
              key={link.platform}
              platform={link.platform}
              handle={link.handle}
              url={link.url}
              size="sm"
            />
          ))}
        </nav>
      </SidebarFooter>
    </Sidebar>
  );
}
