import '../_init';
import { getAllBlogPosts } from '../lib/content';

export async function onRequest(): Promise<Response> {
  try {
    const posts = getAllBlogPosts();
    return new Response(JSON.stringify(posts), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch posts' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

