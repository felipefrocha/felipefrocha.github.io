

import { getSocialLinks } from '@core/content/index';

export async function onRequest(): Promise<Response> {
  try {
    const socials = getSocialLinks();
    return new Response(JSON.stringify(socials), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching socials:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch social links' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

