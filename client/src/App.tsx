import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MainLayout } from "@/components/templates/MainLayout";
import { mockProfile, mockSocialLinks } from "@/lib/mockData";

import Home from "@/pages/Home";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Portfolio from "@/pages/Portfolio";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/not-found";

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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MainLayout
          profile={{
            name: mockProfile.name,
            tagline: mockProfile.tagline,
            avatar: mockProfile.avatar,
          }}
          socialLinks={mockSocialLinks}
        >
          <Router />
        </MainLayout>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
