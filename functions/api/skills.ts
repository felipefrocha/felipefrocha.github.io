import '../_init';
import { getSkills } from '../lib/content';

export async function onRequest(): Promise<Response> {
  try {
    const skills = getSkills();
    return new Response(JSON.stringify(skills), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching skills:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch skills' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

