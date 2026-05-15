
import { getBlogPostBySlug } from '@core/content/index';

export async function onRequest(context: { request: Request, params: { slug: string } }): Promise<Response> {
  try {
    const url = new URL(context.request.url);
    const language = url.searchParams.get('lang') || 'en';
    const { slug } = context.params;
    
    const post = getBlogPostBySlug(slug, language);
    
    if (!post) {
      return new Response(
        JSON.stringify({ error: 'Post not found' }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    
    return new Response(JSON.stringify(post), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch post' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

