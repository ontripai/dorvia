import { createHash } from 'crypto';
import { supabaseAdmin } from './supabaseAdmin';

export interface RateLimitResult {
  allowed: boolean;
  count: number;
  limit: number;
  resetSeconds: number;
}

export interface RateLimitOptions {
  endpoint: string;
  ip?: string;
  identifier?: string;
  maxRequests: number;
  windowSeconds: number;
}

/**
 * Anonymizes client IP address or identifier using SHA-256 with a fixed salt.
 * Ensures zero raw IP addresses or email PII are persisted into the database.
 */
export function hashClientIp(rawIp: string): string {
  // Extract first IP in case of x-forwarded-for comma-separated chain
  const cleanIp = (rawIp || '').split(',')[0].trim() || '127.0.0.1';
  const salt = process.env.RATE_LIMIT_SALT || 'dorvia_rl_salt_2026';
  return createHash('sha256').update(`${salt}:${cleanIp}`).digest('hex').substring(0, 32);
}

// In-memory fallback if database is temporarily unreachable
const memoryFallbackMap = new Map<string, { count: number; resetTime: number }>();

let lastCleanupTime = 0;

/**
 * Checks persistent rate limit in Supabase rate_limit_events table.
 * If limit is exceeded, returns allowed: false.
 * Otherwise inserts a new event record and cleans up expired records.
 */
export async function checkRateLimit({
  endpoint,
  ip,
  identifier,
  maxRequests,
  windowSeconds,
}: RateLimitOptions): Promise<RateLimitResult> {
  const rawTarget = identifier || ip || '127.0.0.1';
  const ipHash = hashClientIp(rawTarget);
  const bucketKey = `${endpoint}:${ipHash}`;
  const now = Date.now();

  if (!supabaseAdmin) {
    // In-memory fallback
    const memData = memoryFallbackMap.get(bucketKey);
    if (memData && now < memData.resetTime) {
      if (memData.count >= maxRequests) {
        return {
          allowed: false,
          count: memData.count,
          limit: maxRequests,
          resetSeconds: Math.ceil((memData.resetTime - now) / 1000),
        };
      }
      memData.count += 1;
      return {
        allowed: true,
        count: memData.count,
        limit: maxRequests,
        resetSeconds: Math.ceil((memData.resetTime - now) / 1000),
      };
    } else {
      memoryFallbackMap.set(bucketKey, { count: 1, resetTime: now + windowSeconds * 1000 });
      return { allowed: true, count: 1, limit: maxRequests, resetSeconds: windowSeconds };
    }
  }

  try {
    const windowStart = new Date(now - windowSeconds * 1000).toISOString();

    // Query event count in the current window
    const { count, error } = await supabaseAdmin
      .from('rate_limit_events')
      .select('id', { count: 'exact', head: true })
      .eq('bucket_key', bucketKey)
      .gte('created_at', windowStart);

    if (error) {
      console.warn('[RateLimit] Supabase query failed, falling back to permissive mode:', error.message);
      return { allowed: true, count: 0, limit: maxRequests, resetSeconds: windowSeconds };
    }

    const currentCount = count ?? 0;

    if (currentCount >= maxRequests) {
      return {
        allowed: false,
        count: currentCount,
        limit: maxRequests,
        resetSeconds: windowSeconds,
      };
    }

    // Insert new rate limit event
    await supabaseAdmin
      .from('rate_limit_events')
      .insert({ bucket_key: bucketKey });

    // Periodic cleanup of events older than 1 day (throttled to at most once per 10 minutes)
    if (now - lastCleanupTime > 10 * 60 * 1000) {
      lastCleanupTime = now;
      const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000).toISOString();
      supabaseAdmin
        .from('rate_limit_events')
        .delete()
        .lt('created_at', oneDayAgo)
        .then(() => {}, (cleanupErr) => console.warn('[RateLimit] Cleanup warning:', cleanupErr));
    }

    return {
      allowed: true,
      count: currentCount + 1,
      limit: maxRequests,
      resetSeconds: windowSeconds,
    };
  } catch (err) {
    console.warn('[RateLimit] Unexpected error in checkRateLimit:', err);
    return { allowed: true, count: 0, limit: maxRequests, resetSeconds: windowSeconds };
  }
}
