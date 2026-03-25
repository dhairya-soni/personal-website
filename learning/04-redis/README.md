# Phase 4 — Add Redis Caching

PostgreSQL is much better. But every redirect still hits the database. For a URL shortener, most traffic is reads (redirects), not writes (shortening). We can make reads near-instant with Redis.

---

## The Problem Redis Solves

Right now, every `GET /:code` does:
```
Browser → Node.js → PostgreSQL → disk → Node.js → Browser
```

The same short code might be visited thousands of times. You're hitting PostgreSQL for the same data repeatedly. That's wasteful.

With Redis:
```
Visit #1:      Browser → Node.js → Redis (miss) → PostgreSQL → Redis → Browser
Visits #2-∞:  Browser → Node.js → Redis (hit!) → Browser
```

Redis stores data in **RAM**. RAM access is ~1000x faster than disk.

---

## The Cache-Aside Pattern

This is the most common caching pattern in web development. You'll see this everywhere.

```
1. Check Redis for the key
2. Cache HIT → return the cached value immediately
3. Cache MISS →
   a. Query the database
   b. Store result in Redis with an expiry time
   c. Return the result
```

```javascript
async function getUrlWithCache(code) {
  // Step 1: Check cache
  const cached = await redis.get(`url:${code}`);

  if (cached) {
    // Cache HIT — return instantly from RAM
    return cached;
  }

  // Cache MISS — go to PostgreSQL
  const entry = await findUrl(code);

  if (entry) {
    // Store in Redis for 1 hour, then auto-expire
    await redis.setex(`url:${code}`, 3600, entry.url);
  }

  return entry?.url;
}
```

---

## Install Redis with Docker

Docker is the easiest way to run Redis on Windows. You don't need to install Redis natively.

**Install Docker Desktop:** https://www.docker.com/products/docker-desktop/

After installing and starting Docker Desktop, run:

```bash
docker run -d \
  -p 6379:6379 \
  --name redis-dev \
  redis:alpine
```

What the flags mean:
- `-d` — run in background (detached)
- `-p 6379:6379` — expose Redis's port to your computer
- `--name redis-dev` — give it a memorable name
- `redis:alpine` — lightweight Redis image (~30MB)

**Verify it's working:**
```bash
docker exec -it redis-dev redis-cli ping
# PONG
```

**Stop/start when you need it:**
```bash
docker stop redis-dev    # stop it
docker start redis-dev   # start it again
```

---

## Install Redis Client

```bash
npm install ioredis
```

`ioredis` is the best Redis client for Node.js. Supports all Redis commands, connection retries, promises.

---

## Create cache.js

```javascript
// cache.js
import Redis from 'ioredis';

const redis = new Redis({
  host: 'localhost',
  port: 6379,
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

redis.on('connect', () => console.log('Redis connected'));
redis.on('error', (err) => console.error('Redis error:', err.message));

export default redis;
```

---

## Update server.js — Cache the Redirect Route

Only the redirect route (`GET /:code`) benefits from caching — reads are repeated, writes are not.

```javascript
// server.js
import express from 'express';
import { nanoid } from 'nanoid';
import { saveUrl, findUrl, incrementClicks, getAllUrls } from './database.js';
import redis from './cache.js';

const app = express();
const PORT = 3000;
const CACHE_TTL_SECONDS = 3600;  // cache entries expire after 1 hour

app.use(express.json());

app.post('/shorten', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'url field is required' });
  try { new URL(url); } catch { return res.status(400).json({ error: 'invalid url format' }); }

  const code = nanoid(6);
  await saveUrl(code, url);

  res.status(201).json({
    shortCode: code,
    shortUrl: `http://localhost:${PORT}/${code}`,
    originalUrl: url,
  });
});

app.get('/:code', async (req, res) => {
  const { code } = req.params;

  // ── Cache-aside pattern ──────────────────────────────────────
  // Step 1: Check Redis first
  const cachedUrl = await redis.get(`url:${code}`);

  if (cachedUrl) {
    // Cache HIT — respond from memory, no DB query needed
    await incrementClicks(code);
    return res.redirect(302, cachedUrl);
  }

  // Step 2: Cache MISS — query PostgreSQL
  const entry = await findUrl(code);
  if (!entry) return res.status(404).json({ error: 'short URL not found' });

  // Step 3: Store in Redis for next time (expires in 1 hour)
  await redis.setex(`url:${code}`, CACHE_TTL_SECONDS, entry.url);
  // ────────────────────────────────────────────────────────────

  await incrementClicks(code);
  res.redirect(302, entry.url);
});

app.get('/urls', async (req, res) => {
  const urls = await getAllUrls();
  res.json(urls);
});

app.listen(PORT, () => {
  console.log(`Server running → http://localhost:${PORT}`);
});
```

---

## Run the Load Test Again

```bash
k6 run load-test.js
```

Expected (the first run includes cache-miss overhead — subsequent runs are faster):

```
     ✓ shorten → 201
     ✓ redirect → 302

     checks.........................: 99.9%
     http_req_duration..............: avg=9ms    p(95)=22ms
     http_req_failed................: 0.03%
     http_reqs......................: 48000  1600/s
```

---

## All Three Versions — Final Comparison

| Metric | SQLite v1 | PostgreSQL v2 | +Redis v3 |
|--------|-----------|---------------|-----------|
| Avg response | 890ms | 31ms | 9ms |
| p(95) latency | 2,100ms | 68ms | 22ms |
| Error rate | 34% | 0.2% | 0.03% |
| Requests/sec | 421 | 613 | 1,600+ |

**Total improvement: 99x faster, 1000x fewer errors.**

---

## What You've Actually Learned

Working backwards from the result to the concepts:

| Problem | Solution | Concept Learned |
|---------|----------|----------------|
| SQLite file lock | → PostgreSQL | Database concurrency |
| Opening connections per request | → Connection pool | Resource pooling |
| Same data queried repeatedly | → Redis cache | Cache-aside pattern |

These three patterns appear in every serious backend system. Instagram uses them. Spotify uses them. You now understand why.

---

## Redis Commands You Should Know

```bash
# In the Redis CLI (docker exec -it redis-dev redis-cli)

GET url:ab3kx9          # get a cached value
KEYS url:*              # list all cached URL keys
TTL url:ab3kx9          # how many seconds until it expires
DEL url:ab3kx9          # manually delete a cached entry
FLUSHALL                # clear everything (use carefully)
```

---

## Write Your Build Log Entry #3

```
## What Changed
Added Redis cache-aside on the redirect route.

## Results
| Metric         | PostgreSQL v2 | +Redis v3  |
|----------------|---------------|------------|
| Avg latency    | 31ms          | 9ms        |
| Error rate     | 0.2%          | 0.03%      |
| Requests/sec   | 613           | 1,600+     |

## Why It Worked
Redirects (reads) are served from RAM instead of disk.
Redis responds in ~1ms vs PostgreSQL's ~5ms.
Under high read load, this compounds significantly.

## What I'd Do Next
- Add Docker Compose to run everything together
- Add monitoring (log slow queries, cache hit rate)
- Consider what happens if Redis goes down (fallback strategy)
```

---

## You're Done with Phase 1

You now have:
- 3 build log entries with real metrics
- 1 complete case study ready to write
- Deep understanding of: concurrency, connection pooling, caching
- A URL shortener that handles 1,600+ requests/second

Next if you want to keep going:
- **Docker Compose** — run Node.js + PostgreSQL + Redis together in containers
- **Monitoring** — add Winston logging, track cache hit rate
- **Phase 2** — Real-time Chat (WebSockets + Redis Pub/Sub)

See the [resources file](../RESOURCES.md) for what to read next.
