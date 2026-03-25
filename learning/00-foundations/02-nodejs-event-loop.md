# The Node.js Event Loop — Why Your Server Will Break

This is the most important concept for understanding WHY your URL shortener breaks under load. Don't skip it.

## Node.js Is Single-Threaded

Node.js runs on one thread. One CPU core. One task at a time.

"But how does it handle thousands of users if it can only do one thing at a time?"

That's the event loop.

---

## How Traditional Servers Handle Concurrency

A traditional server handles multiple users by spawning threads:

```
User 1 → Thread 1 → waiting for DB... waiting... done → respond
User 2 → Thread 2 → waiting for DB... waiting... done → respond
User 3 → Thread 3 → waiting for DB... waiting... done → respond
```

Problem: each thread uses ~1MB of memory. At 10,000 concurrent users = 10GB just for threads. Expensive.

---

## How Node.js Handles It

Node.js uses a single thread with an event loop. Instead of waiting for slow operations, it registers a callback and moves on:

```
Single Thread:
→ Start DB query for User 1 (don't wait, register callback)
→ Start DB query for User 2 (don't wait, register callback)
→ Start DB query for User 3 (don't wait, register callback)
→ DB done for User 1 → run callback → send response
→ DB done for User 2 → run callback → send response
→ DB done for User 3 → run callback → send response
```

All of this happens in one thread. The event loop checks "anything finished?" in a tight loop and runs the callbacks as they complete.

This is called **non-blocking I/O** and it's why Node.js handles thousands of concurrent connections efficiently.

---

## Visualizing It

```
         ┌──────────────────────┐
         │      Call Stack      │  ← your code runs here, one at a time
         └──────────┬───────────┘
                    │ (empty? check queue)
         ┌──────────▼───────────┐
         │     Event Loop       │  ← constantly checking
         └──────────┬───────────┘
                    │
         ┌──────────▼───────────┐
         │    Callback Queue    │  ← completed async ops wait here
         │  (DB done, timers)   │
         └──────────────────────┘
```

---

## The Golden Rule: Never Block the Event Loop

If you put a slow synchronous operation on the call stack, Node.js **cannot handle any other requests** until it's done.

```javascript
// BAD — blocks the event loop for every request
app.get('/shorten', (req, res) => {
  const result = db.querySync('INSERT INTO urls...');  // takes 10ms, blocks everything
  res.json(result);
  // While this 10ms runs, 0 other requests can be handled
});

// GOOD — non-blocking, Node.js handles other requests while waiting
app.get('/shorten', async (req, res) => {
  const result = await db.query('INSERT INTO urls...');  // async, doesn't block
  res.json(result);
  // While waiting for the DB, Node.js handles other requests
});
```

---

## Why SQLite Specifically Will Break Your Server

SQLite writes are protected by a **file lock** — only one write can happen at a time, regardless of how async your code looks.

At 200 concurrent requests:
```
Request 1:   writing to SQLite... (5ms)
Request 2:   WAITING for lock...
Request 3:   WAITING for lock...
...
Request 200: WAITING for lock...  ← been waiting 200 × 5ms = 1000ms already
```

Requests pile up faster than they drain. Latency explodes. Errors start appearing.

---

## What You'll See in the Load Test

```
http_req_duration: avg=890ms   p(95)=2.1s
http_req_failed:   34%
```

That 890ms average isn't a slow database query. It's 199 requests waiting in line for the SQLite lock to clear.

---

## The Fix (Preview)

PostgreSQL with a connection pool:
- 10 connections open simultaneously
- Up to 10 queries run in parallel
- No file lock

```
Request 1  → Connection 1 → done in 5ms ✓
Request 2  → Connection 2 → done in 5ms ✓
Request 3  → Connection 3 → done in 5ms ✓
...
Request 11 → waits for a free connection (queue depth: 1, not 200)
```

Average wait time drops from 890ms to ~30ms.

---

## One Thing to Watch (30 min)

**"What the heck is the event loop anyway?"** by Philip Roberts (JSConf 2014)

Search it on YouTube. Best visual explanation of the event loop that exists. Watch it before you start building. It will make everything click.

---

## Key Takeaways

1. Node.js = single thread + event loop + async I/O
2. Never block the event loop with synchronous operations
3. SQLite's file lock creates a serialization bottleneck under concurrent load
4. PostgreSQL + connection pool = parallel queries = dramatically better throughput

Next: [Databases 101 →](./03-databases-101.md)
