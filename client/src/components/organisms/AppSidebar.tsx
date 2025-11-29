import { Home, FileText, FolderKanban, User, Mail } from 'lucide-react';
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
import type { SocialLink } from '@/types/blog';

interface AppSidebarProps {
  profile: {
    name: string;
    tagline: string;
    avatar?: string;
  };
  socialLinks: SocialLink[];
}

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/blog', icon: FileText, label: 'Blog' },
  { href: '/portfolio', icon: FolderKanban, label: 'Portfolio' },
  { href: '/about', icon: User, label: 'About' },
  { href: '/contact', icon: Mail, label: 'Contact' },
];

export function AppSidebar({ profile, socialLinks }: AppSidebarProps) {
  const [location] = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

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
          className="flex items-center justify-center gap-1 py-2"
          aria-label="Social media links"
        >
          {socialLinks.map((link) => (
            <SocialIcon
              key={link.platform}
              platform={link.platform}
              url={link.url}
              size="sm"
            />
          ))}
        </nav>
      </SidebarFooter>
    </Sidebar>
  );
}
