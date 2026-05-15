import "../_init";


import { getProfile } from '@core/content/index';

export async function onRequest(): Promise<Response> {
  try {
    const profile = await getProfile();
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

