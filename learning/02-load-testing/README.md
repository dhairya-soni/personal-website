# Phase 2 — Break It with Load Testing

Your URL shortener works great for one person. Now simulate 200 people hitting it at the same time and see what happens.

## What is Load Testing?

Load testing = running automated scripts that simulate many users making requests simultaneously.

Real-world scenarios this protects against:
- Your project link gets shared on Reddit → 5,000 users in 10 minutes
- A bot starts crawling your API → 1,000 requests/second
- You go viral on Twitter → traffic spikes 100x overnight

You want to find where your system breaks **before** this happens in production.

---

## Install k6

k6 is a free, open-source load testing tool. Scripts are written in JavaScript.

**Windows (recommended — download installer):**
Go to: https://dl.k6.io/msi/k6-latest-amd64.msi
Download and run the installer.

**Or with Chocolatey:**
```bash
choco install k6
```

**Verify it's installed:**
```bash
k6 version
# k6 v0.x.x (...)
```

---

## The Test Script

Create a file called `load-test.js` somewhere easy to find (e.g. your Desktop or the `url-shortener` folder).

```javascript
// load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 200,         // 200 virtual users running simultaneously
  duration: '30s',  // run for 30 seconds total
};

export default function () {
  // Step 1: Create a short URL
  const shortenRes = http.post(
    'http://localhost:3000/shorten',
    JSON.stringify({ url: 'https://github.com/dhairya-soni' }),
    { headers: { 'Content-Type': 'application/json' } }
  );

  check(shortenRes, {
    'shorten → 201': (r) => r.status === 201,
  });

  // Step 2: Visit the short URL (don't follow the redirect)
  if (shortenRes.status === 201) {
    const body = JSON.parse(shortenRes.body);

    const redirectRes = http.get(
      `http://localhost:3000/${body.shortCode}`,
      { redirects: 0 }   // don't follow the redirect — just check it's a 302
    );

    check(redirectRes, {
      'redirect → 302': (r) => r.status === 302,
    });
  }

  sleep(0.1); // each virtual user waits 100ms between iterations
}
```

---

## Run the Test

Make sure your server is running (`node server.js` in one terminal), then in another terminal:

```bash
k6 run load-test.js
```

Watch the output. With SQLite it will look bad:

```
     ✓ shorten → 201
     ✗ redirect → 302
       ↳  66% — ✓ 4120 / ✗ 2080

     checks.........................: 78.50%
     http_req_duration..............: avg=890ms  p(95)=2.1s
     http_req_failed................: 34.17%
     http_reqs......................: 12647  421/s
     vus............................: 200
```

---

## Reading the Results — What Each Line Means

**`checks: 78.50%`**
78.5% of your assertions passed. The rest failed — requests that got errors instead of the expected 201/302.

**`http_req_duration avg=890ms`**
On average, requests took 890 milliseconds. For a URL shortener, this should be under 20ms. You're 44x slower than it should be.

**`p(95)=2.1s`**
95% of requests completed in under 2.1 seconds. The slowest 5% were even worse. Users are seeing 2+ second load times.

**`http_req_failed 34.17%`**
34% of all requests returned errors. That's a catastrophic failure rate. Real users would give up.

**`421/s`**
421 requests per second total throughput. A well-optimized URL shortener should handle 3,000–10,000/s.

---

## Why It's Breaking — The SQLite File Lock

At 200 concurrent requests, here's what's happening:

```
t=0ms:   200 requests arrive
t=0ms:   Request 1 starts writing to urls.db
t=0ms:   SQLite locks the file — only 1 write at a time
t=0ms:   Requests 2-200 are WAITING for the lock to release
t=5ms:   Request 1 done, lock released
t=5ms:   Request 2 gets the lock, starts writing
t=5ms:   Requests 3-200 still waiting...
t=1000ms: Request 200 finally gets its turn
```

Requests pile up faster than they drain. The Node.js event loop fills with queued callbacks. Eventually requests start timing out. 34% fail.

---

## Document This — It's Your Build Log Entry #1

Before moving to the fix, write your first build log entry on your site. Include:

```
## Results
| Metric         | Value    |
|----------------|----------|
| Avg latency    | 890ms    |
| p95 latency    | 2.1s     |
| Error rate     | 34%      |
| Requests/sec   | 421      |
| Broke at       | ~180 VUs |

## Why It Broke
SQLite's file lock serializes all writes.
200 concurrent requests → 199 waiting in line.
```

This is the honest, detailed content that makes your site credible.

Next: [Fix It with PostgreSQL →](../03-postgresql/README.md)
