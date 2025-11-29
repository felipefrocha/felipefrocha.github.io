import '../_init';
import { getProfile } from '../lib/content';

export async function onRequest(): Promise<Response> {
  try {
    const profile = getProfile();
    return new Response(JSON.stringify(profile), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch profile' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

