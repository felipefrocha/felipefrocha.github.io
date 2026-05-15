

import { getAllBlogPosts } from '@core/content/index';

export async function onRequest(context: { request: Request }): Promise<Response> {
  try {
    const url = new URL(context.request.url);
    const language = url.searchParams.get('lang') || 'en';
    
    const allPosts = await getAllBlogPosts();
    
    // Filter for requested language, fallback to English if not available
    const uniquePosts = new Map();
    for (const post of allPosts) {
      if (post.language === language) {
        uniquePosts.set(post.slug, post);
      } else if (post.language === 'en' && !uniquePosts.has(post.slug)) {
        uniquePosts.set(post.slug, post);
      }
    }
    
    const posts = Array.from(uniquePosts.values());
    
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

