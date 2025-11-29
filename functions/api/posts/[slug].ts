import '../../_init';
import { getBlogPostBySlug } from '../../lib/content';

export async function onRequest(context: { params: { slug: string } }): Promise<Response> {
  try {
    const { slug } = context.params;
    const post = getBlogPostBySlug(slug);
    
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

