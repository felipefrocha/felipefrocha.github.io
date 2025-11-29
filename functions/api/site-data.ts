import '../_init';
import { 
  getProfile,
  getSocialLinks,
  getProjects,
  getSkills,
  getStats,
  getFeaturedBlogPosts
} from '../lib/content';

export async function onRequest(): Promise<Response> {
  try {
    const profile = getProfile();
    const socials = getSocialLinks();
    const projects = getProjects();
    const skills = getSkills();
    const stats = getStats();
    const featuredPosts = getFeaturedBlogPosts(3);
    
    return new Response(
      JSON.stringify({
        profile,
        socials,
        projects,
        skills,
        stats,
        featuredPosts,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error fetching site data:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch site data' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

