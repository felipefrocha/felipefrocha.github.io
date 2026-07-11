import { describe, it, expect, vi, afterEach } from 'vitest';
import { onRequest } from './contact';

const validBody = {
  name: 'Ada',
  email: 'ada@example.com',
  subject: 'Hello',
  message: 'This is a sufficiently long message.',
  turnstileToken: 'tok',
};

function makeContext(body: unknown, method = 'POST', headers: Record<string, string> = {}) {
  const request = new Request('https://site/api/contact', {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: method === 'POST' ? JSON.stringify(body) : undefined,
  });
  return { request, env: { TURNSTILE_SECRET_KEY: 'secret' } };
}

function stubTurnstile(success: boolean) {
  const fetchMock = vi.fn().mockResolvedValue({ json: async () => ({ success, 'error-codes': [] }) });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('contact onRequest', () => {
  it('rejects non-POST methods with 405', async () => {
    const res = await onRequest(makeContext(null, 'GET'));
    expect(res.status).toBe(405);
  });

  it('returns 400 on validation failure', async () => {
    stubTurnstile(true);
    const res = await onRequest(makeContext({ ...validBody, email: 'bad' }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe('Validation failed');
  });

  it('returns 400 when Turnstile verification fails', async () => {
    stubTurnstile(false);
    const res = await onRequest(makeContext(validBody));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe('Captcha verification failed');
  });

  it('returns 200 for a valid, verified submission', async () => {
    const fetchMock = stubTurnstile(true);
    const res = await onRequest(makeContext(validBody, 'POST', { 'CF-Connecting-IP': '1.2.3.4' }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    // Turnstile siteverify was called.
    expect(fetchMock).toHaveBeenCalledWith(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('returns 500 when the request body is not valid JSON', async () => {
    const request = new Request('https://site/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not-json{',
    });
    const res = await onRequest({ request, env: { TURNSTILE_SECRET_KEY: 'secret' } });
    expect(res.status).toBe(500);
  });
});
