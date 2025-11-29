import '../_init';
import { getStats } from '../lib/content';

export async function onRequest(): Promise<Response> {
  try {
    const stats = getStats();
    return new Response(JSON.stringify(stats), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch stats' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

