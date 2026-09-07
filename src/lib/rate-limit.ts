/**
 * Minimal in-memory, fixed-window rate limiter for the contact form
 * (src/app/api/contact/route.ts).
 *
 * Deliberately simple: this is a low-traffic B2B contact form, not a
 * public API, so a per-instance in-memory counter is an acceptable
 * trade-off for a $0-hosting deployment (no Redis/Upstash dependency).
 *
 * Known limitation: on serverless platforms each function instance has
 * its own memory, so the effective limit is "N submissions per window
 * per warm instance", not a strict global limit, and it resets on cold
 * start/redeploy. If the site ever needs a hard global limit (e.g. under
 * sustained abuse), replace this with a durable store (Upstash Redis,
 * Vercel KV) behind the same `checkRateLimit` signature — call sites
 * don't need to change.
 */

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

interface Bucket {
  count: number;
  windowStart: number;
}

const buckets = new Map<string, Bucket>();

/**
 * Returns `true` if the request identified by `key` (typically the
 * client IP) is within the allowed rate, and records the attempt.
 * Returns `false` if the caller should be rejected with HTTP 429.
 */
export function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now - bucket.windowStart >= WINDOW_MS) {
    buckets.set(key, { count: 1, windowStart: now });
    pruneStaleBuckets(now);
    return true;
  }

  if (bucket.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  bucket.count += 1;
  return true;
}

/**
 * Opportunistic cleanup so `buckets` doesn't grow unbounded over the
 * lifetime of a warm serverless instance. Runs cheaply (only when a new
 * window starts for some key) rather than on a timer.
 */
function pruneStaleBuckets(now: number): void {
  for (const [key, bucket] of buckets) {
    if (now - bucket.windowStart >= WINDOW_MS) {
      buckets.delete(key);
    }
  }
}
