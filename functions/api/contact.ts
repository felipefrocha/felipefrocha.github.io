

import { contactMessageSchema } from '@shared/schema';

interface Env {
  TURNSTILE_SECRET_KEY: string;
}

export async function onRequest(context: { request: Request; env: Env }): Promise<Response> {
  if (context.request.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const body = await context.request.json();
    const result = contactMessageSchema.safeParse(body);
    
    if (!result.success) {
      return new Response(
        JSON.stringify({ 
          error: "Validation failed", 
          details: result.error.flatten() 
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate Turnstile token
    const token = result.data.turnstileToken;
    const secret = context.env.TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA';
    
    const formData = new FormData();
    formData.append('secret', secret);
    formData.append('response', token);
    
    const ip = context.request.headers.get('CF-Connecting-IP');
    if (ip) {
      formData.append('remoteip', ip);
    }

    const turnstileRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    });

    const turnstileData = await turnstileRes.json() as { success: boolean; 'error-codes': string[] };
    if (!turnstileData.success) {
      return new Response(
        JSON.stringify({ error: "Captcha verification failed" }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log("Contact message received & validated:", result.data);
    
    // In production, you would send this to an email service or save to a database
    // For now, we'll just log it
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Message received successfully" 
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error processing contact:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process contact message' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

