import { Switch, Route } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MainLayout } from "@/components/templates/MainLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchSiteData, type SiteData } from "@/lib/api";
import { useTranslation } from "react-i18next";

import Home from "@/pages/Home";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Portfolio from "@/pages/Portfolio";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/not-found";

import type { ProfileInfo, BlogPost as BlogPostType, SocialLink, Project } from '@shared/schema';

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/portfolio" component={Portfolio} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route component={NotFound} />
    </Switch>
  );
}

// Auto-refresh in development mode
const isDevelopment = import.meta.env.DEV;

function AppContent() {
  const { i18n } = useTranslation();

  const { data: siteData, isLoading } = useQuery<SiteData>({
    queryKey: ['/api/site-data', i18n.language],
    queryFn: fetchSiteData,
    staleTime: isDevelopment ? 0 : 5 * 60 * 1000,
    refetchInterval: isDevelopment ? 2000 : false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 text-center">
          <Skeleton className="h-16 w-16 rounded-full mx-auto" />
          <Skeleton className="h-4 w-32 mx-auto" />
          <Skeleton className="h-3 w-24 mx-auto" />
        </div>
      </div>
    );
  }

  const defaultProfile = {
    name: 'Felipe F. Rocha',
    tagline: 'Systems Engineer',
  };

  const defaultSocials: SocialLink[] = [
    { platform: 'github', url: 'https://github.com', handle: 'felipefrocha'},
    { platform: 'linkedin', url: 'https://linkedin.com/in', handle: 'felipefonsecarocha' },
    { platform: 'instagram', url: 'https://instagram.com', handle: '_felipefrocha' },
  ];

  const profile = siteData?.profile;
  const socialLinks = siteData?.socials;

  return (
    <MainLayout
      profile={{
        name: profile?.name || defaultProfile.name,
        tagline: profile?.tagline || defaultProfile.tagline,
        avatar: profile?.avatar,
      }}
      socialLinks={socialLinks || defaultSocials}
    >
      <Router />
    </MainLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppContent />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
