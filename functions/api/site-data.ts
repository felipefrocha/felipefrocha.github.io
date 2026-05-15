
import { 
  getProfile,
  getSocialLinks,
  getProjects,
  getSkills,
  getStats,
  getFeaturedBlogPosts
} from '@core/content/index';

export async function onRequest(context: { request: Request }): Promise<Response> {
  try {
    const url = new URL(context.request.url);
    const language = url.searchParams.get('lang') || 'en';
    
    const profile = getProfile();
    const socials = getSocialLinks();
    const projects = getProjects();
    const skills = getSkills();
    const stats = getStats();
    const featuredPosts = getFeaturedBlogPosts(3, language);
    
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

