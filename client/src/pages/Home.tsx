import { HeroSection } from '@/components/organisms/HeroSection';
import { FeaturedWorkSection } from '@/components/organisms/FeaturedWorkSection';
import { RecentPostsSection } from '@/components/organisms/RecentPostsSection';
import { AboutSection } from '@/components/organisms/AboutSection';
import { StatsSection } from '@/components/organisms/StatsSection';
import { ConnectSection } from '@/components/organisms/ConnectSection';
import { 
  mockProjects, 
  mockBlogPosts, 
  mockProfile, 
  mockStats, 
  mockSkills,
  mockSocialLinks,
} from '@/lib/mockData';

export default function Home() {
  return (
    <article>
      <HeroSection 
        headline="Developer. Writer. Creator."
        subheadline="Building digital experiences and sharing knowledge through code and words."
      />
      
      <FeaturedWorkSection projects={mockProjects} />
      
      <RecentPostsSection posts={mockBlogPosts} />
      
      <AboutSection bio={mockProfile.bio} skills={mockSkills} />
      
      <StatsSection stats={mockStats} />
      
      <ConnectSection socialLinks={mockSocialLinks} />
    </article>
  );
}
