/**
 * Simple in-memory rate limiter.
 * Works within a single serverless instance lifetime.
 * Good enough for basic abuse protection without extra dependencies.
 */

interface Entry {
  count: number;
  windowStart: number;
}

const store = new Map<string, Entry>();

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 20;  // per IP per window

/** Returns true if the request should be rate-limited (i.e. blocked). */
export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    store.set(ip, { count: 1, windowStart: now });
    return false;
  }

  if (entry.count >= MAX_REQUESTS) {
    return true;
  }

  entry.count++;
  return false;
}

/** Call at the top of an API route handler. Returns a 429 Response if limited. */
export function rateLimitResponse(request: Request): Response | null {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return new Response(JSON.stringify({ error: "Too many requests" }), {
      status: 429,
      headers: { "Content-Type": "application/json", "Retry-After": "60" },
    });
  }
  return null;
}
