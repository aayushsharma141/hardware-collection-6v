# BUG-06 — In-Memory Rate Limiting: Architectural Limitation

## Status
**Accepted limitation** — Documented for future resolution.

## Summary
The current rate-limiting implementation stores request counters in a **Node.js module-level `Map`**. This works correctly in development and single-instance deployments but has known limitations in serverless/multi-instance environments.

## Known Limitations

### 1. No cross-instance isolation
In a multi-instance or serverless deployment (e.g. Vercel Functions, Kubernetes), each instance maintains its own independent counter. A client can bypass the limit by being load-balanced across instances.

### 2. Counter loss on cold starts
Serverless environments spin up new function instances frequently. The in-memory counter resets to zero on every cold start, effectively removing the rate limit between invocations.

### 3. Memory pressure
Unbounded growth of the `Map` under high cardinality of client IPs is possible if old entries are not evicted.

## Current Behavior
- Limit: configurable requests per window per IP.
- Counter stored in `Map<string, { count: number; windowStart: number }>`.
- Works correctly in a single Next.js server process (`npm run dev`, single VPS).

## Recommended Upgrade Path

### Option A — Upstash Redis (Recommended for Vercel)
```ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "10 m"),
});

const { success } = await ratelimit.limit(ip);
if (!success) return new Response("Too Many Requests", { status: 429 });
```

### Option B — Vercel KV
Use `@vercel/kv` with a sliding window algorithm.

### Option C — Redis via `ioredis` (Self-hosted)
Use `INCR` + `EXPIRE` or a Lua script for atomic sliding window logic.

## Impact Assessment

| Scenario | Impact |
|---|---|
| Single VPS / `npm start` | No impact, current implementation correct |
| Vercel multi-instance | Rate limit bypassed across instances |
| Vercel serverless (cold starts) | Counter resets on each cold start |
| High-traffic production | Potential memory growth without TTL eviction |

## References
- `src/app/api/leads/route.ts` — primary rate-limit implementation
- Upstash Rate Limiting: https://upstash.com/docs/redis/sdks/ratelimit/overview
- Vercel KV: https://vercel.com/docs/storage/vercel-kv
