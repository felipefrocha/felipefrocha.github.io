import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/organisms/AppSidebar';
import { Header } from '@/components/organisms/Header';
import { Footer } from '@/components/organisms/Footer';
import { ThemeContext, useThemeProvider } from '@/hooks/useTheme';
import type { SocialLink } from '@shared/schema';

interface MainLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  profile: {
    name: string;
    tagline: string;
    avatar?: string;
  };
  socialLinks: SocialLink[];
}

export function MainLayout({ children, pageTitle, profile, socialLinks }: MainLayoutProps) {
  const themeProviderValue = useThemeProvider();

  const sidebarStyle = {
    '--sidebar-width': '14.5rem',
    '--sidebar-width-icon': '3.25rem',
  } as React.CSSProperties;

  return (
    <ThemeContext.Provider value={themeProviderValue}>
      <SidebarProvider style={sidebarStyle}>
        <div className="flex min-h-screen w-full bg-background text-foreground">
          <AppSidebar profile={profile} socialLinks={socialLinks} />
          <SidebarInset className="flex flex-col flex-1 min-w-0">
            <Header title={pageTitle} />
            <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
              {children}
            </main>
            <Footer socialLinks={socialLinks} />
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ThemeContext.Provider>
  );
}
