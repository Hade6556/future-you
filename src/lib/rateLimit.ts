/**
 * Rate limiter with in-memory store and periodic cleanup.
 *
 * Uses a sliding window approach. Works across requests within the same
 * serverless instance, and provides basic abuse protection even when
 * instances recycle. For stricter production use, swap to Upstash Redis.
 */

interface Entry {
  count: number;
  windowStart: number;
}

const store = new Map<string, Entry>();

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 20;  // per IP per window

// Periodically clean up stale entries to prevent memory leaks
const CLEANUP_INTERVAL = 5 * 60_000; // 5 minutes
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [ip, entry] of store) {
    if (now - entry.windowStart > WINDOW_MS * 2) {
      store.delete(ip);
    }
  }
}

/** Returns true if the request should be rate-limited (i.e. blocked). */
export function isRateLimited(ip: string): boolean {
  cleanup();
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
