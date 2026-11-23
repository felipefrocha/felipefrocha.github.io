import { lazy, Suspense } from "react";
import { Switch, Route } from "wouter";
import { useQuery, QueryClientProvider } from "@tanstack/react-query";
import { MotionConfig } from "framer-motion";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MainLayout } from "@/components/templates/MainLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchSiteData, type SiteData } from "@/lib/api";
import { AuthProvider } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";

import Home from "@/pages/Home";

const Blog = lazy(() => import("@/pages/Blog"));
const BlogPost = lazy(() => import("@/pages/BlogPost"));
const Portfolio = lazy(() => import("@/pages/Portfolio"));
const ProjectAArchitecture = lazy(() => import("@/pages/ProjectAArchitecture"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const Presentation = lazy(() => import("@/pages/Presentation"));
const KubeCon2026 = lazy(() => import("@/pages/KubeCon2026"));
const NotFound = lazy(() => import("@/pages/not-found"));

import type { SocialLink } from '@shared/schema';

function RouteFallback() {
  return (
    // min-h-screen keeps the footer below the fold until the lazy route loads,
    // avoiding a layout shift (CLS) when the real page replaces this fallback.
    <div className="min-h-screen py-12 px-6 md:px-8 max-w-6xl mx-auto space-y-4" aria-busy="true">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-6 w-96 max-w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:slug" component={BlogPost} />
        <Route path="/portfolio" component={Portfolio} />
        <Route path="/portfolio/project-a-architecture" component={ProjectAArchitecture} />
        <Route path="/presentations/:slug" component={Presentation} />
        <Route path="/kubecon-2026" component={KubeCon2026} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

// Auto-refresh in development mode
const isDevelopment = import.meta.env.DEV;

const defaultProfile = {
  name: 'Felipe F. Rocha',
  tagline: 'Systems Engineer',
};

const defaultSocials: SocialLink[] = [
  { platform: 'github', url: 'https://github.com', handle: 'felipefrocha'},
  { platform: 'linkedin', url: 'https://linkedin.com/in', handle: 'felipefonsecarocha' },
  { platform: 'instagram', url: 'https://instagram.com', handle: '_felipefrocha' },
];

function AppContent() {
  const { i18n } = useTranslation();

  const { data: siteData } = useQuery<SiteData>({
    queryKey: ['/api/site-data', i18n.language],
    queryFn: fetchSiteData,
    staleTime: isDevelopment ? 0 : 5 * 60 * 1000,
    refetchInterval: isDevelopment ? 2000 : false,
  });

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
    <MotionConfig reducedMotion="user">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <AppContent />
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </MotionConfig>
  );
}

export default App;
