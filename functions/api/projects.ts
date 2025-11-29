import '../_init';
import { getProjects } from '../lib/content';

export async function onRequest(): Promise<Response> {
  try {
    const projects = getProjects();
    return new Response(JSON.stringify(projects), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch projects' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

