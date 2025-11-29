import { Switch, Route } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MainLayout } from "@/components/templates/MainLayout";
import { Skeleton } from "@/components/ui/skeleton";

import Home from "@/pages/Home";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Portfolio from "@/pages/Portfolio";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/not-found";

import type { ProfileInfo, SocialLink } from "@/types/blog";

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

function AppContent() {
  const { data: profile, isLoading: profileLoading } = useQuery<ProfileInfo>({
    queryKey: ['/api/profile'],
    staleTime: 5 * 60 * 1000,
  });

  const { data: socialLinks, isLoading: socialsLoading } = useQuery<SocialLink[]>({
    queryKey: ['/api/socials'],
    staleTime: 5 * 60 * 1000,
  });

  const isLoading = profileLoading || socialsLoading;

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
    name: 'Alex Developer',
    tagline: 'Full-Stack Developer & Writer',
  };

  const defaultSocials: SocialLink[] = [
    { platform: 'github', url: 'https://github.com', handle: 'alexdev' },
    { platform: 'linkedin', url: 'https://linkedin.com', handle: 'alexdev' },
    { platform: 'instagram', url: 'https://instagram.com', handle: 'alexdev' },
    { platform: 'twitter', url: 'https://twitter.com', handle: 'alexdev' },
  ];

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
