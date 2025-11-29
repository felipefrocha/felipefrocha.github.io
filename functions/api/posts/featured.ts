import '../../_init';
import { getFeaturedBlogPosts } from '../../lib/content';

export async function onRequest(context: { request: Request }): Promise<Response> {
  try {
    const url = new URL(context.request.url);
    const limitParam = url.searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 3;
    const posts = getFeaturedBlogPosts(limit);
    return new Response(JSON.stringify(posts), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching featured posts:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch featured posts' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

