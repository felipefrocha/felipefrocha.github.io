

import { contactMessageSchema } from '@shared/schema';

interface Env {
  TURNSTILE_SECRET_KEY?: string;
}

const MAX_REQUEST_BYTES = 16 * 1024;

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function onRequest(context: { request: Request; env: Env }): Promise<Response> {
  if (context.request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  try {
    const contentLength = Number(context.request.headers.get('Content-Length') || '0');
    if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
      return jsonResponse({ error: 'Request body too large' }, 413);
    }

    const rawBody = await context.request.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_REQUEST_BYTES) {
      return jsonResponse({ error: 'Request body too large' }, 413);
    }

    let body: unknown;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return jsonResponse({ error: 'Invalid JSON body' }, 400);
    }

    const result = contactMessageSchema.safeParse(body);
    
    if (!result.success) {
      return jsonResponse({
        error: 'Validation failed',
        details: result.error.flatten(),
      }, 400);
    }

    // Validate Turnstile token
    const token = result.data.turnstileToken;
    const secret = context.env.TURNSTILE_SECRET_KEY?.trim();
    if (!secret) {
      console.error('Contact form is unavailable: TURNSTILE_SECRET_KEY is not configured.');
      return jsonResponse({ error: 'Contact form is temporarily unavailable' }, 503);
    }
    
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
      return jsonResponse({ error: 'Captcha verification failed' }, 400);
    }

    // In production, you would send this to an email service or save to a database
    // For now, acknowledge only; never log the message, email, or Turnstile token.
    return jsonResponse({
      success: true,
      message: 'Message received successfully',
    });
  } catch (error) {
    console.error('Error processing contact:', error);
    return jsonResponse({ error: 'Failed to process contact message' }, 500);
  }
}
