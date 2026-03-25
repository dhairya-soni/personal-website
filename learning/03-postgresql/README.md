# Phase 3 — Fix the Database (SQLite → PostgreSQL)

SQLite can't handle concurrent writes. PostgreSQL can. Let's migrate.

---

## What Changes

```
Before (v1):                      After (v2):
  Express.js                        Express.js
      │                                  │
  better-sqlite3                   pg (node-postgres)
      │                                  │
   urls.db file               PostgreSQL server
                               (10 concurrent connections)
```

The API stays identical. Only the database layer changes.

---

## Install PostgreSQL

**Windows:**
1. Go to: https://www.postgresql.org/download/windows/
2. Click "Download the installer"
3. Run it, use all default settings
4. **Remember the password you set for the `postgres` user**
5. When asked about port, keep the default: `5432`

**Verify it's running:**
```bash
psql -U postgres -c "SELECT version();"
# Asks for password → enter it → shows PostgreSQL version
```

If `psql` isn't recognized, find it in: `C:\Program Files\PostgreSQL\16\bin\psql.exe`

---

## Create the Database

```bash
psql -U postgres
```

In the PostgreSQL prompt (`postgres=#`):
```sql
CREATE DATABASE urlshortener;
\q
```

That creates an empty database called `urlshortener`.

---

## Update Dependencies

In your `url-shortener` folder:
```bash
npm install pg
npm uninstall better-sqlite3
```

`pg` is the official PostgreSQL client for Node.js (also called `node-postgres`).

---

## Rewrite database.js

Replace the entire file:

```javascript
// database.js
import pg from 'pg';
const { Pool } = pg;

// Connection pool: keeps up to 10 connections open simultaneously
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'urlshortener',
  user: 'postgres',
  password: 'YOUR_PASSWORD_HERE',   // ← replace with your actual password
  max: 10,                          // max 10 concurrent connections
  idleTimeoutMillis: 30000,         // close idle connections after 30s
  connectionTimeoutMillis: 2000,    // error if can't connect in 2s
});

// Test connection and create table on startup
const client = await pool.connect();
await client.query(`
  CREATE TABLE IF NOT EXISTS urls (
    id         SERIAL PRIMARY KEY,
    code       TEXT NOT NULL UNIQUE,
    url        TEXT NOT NULL,
    clicks     INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
  CREATE INDEX IF NOT EXISTS idx_urls_code ON urls(code);
`);
client.release();
console.log('Database ready');

// Save a new short URL
export async function saveUrl(code, url) {
  const result = await pool.query(
    'INSERT INTO urls (code, url) VALUES ($1, $2) RETURNING *',
    [code, url]
  );
  return result.rows[0];
}

// Find a URL by its short code
export async function findUrl(code) {
  const result = await pool.query(
    'SELECT * FROM urls WHERE code = $1',
    [code]
  );
  return result.rows[0];   // undefined if not found
}

// Increment click count
export async function incrementClicks(code) {
  await pool.query(
    'UPDATE urls SET clicks = clicks + 1 WHERE code = $1',
    [code]
  );
}

// Get all URLs
export async function getAllUrls() {
  const result = await pool.query(
    'SELECT * FROM urls ORDER BY created_at DESC'
  );
  return result.rows;
}

export default pool;
```

### Key Differences from the SQLite Version

| SQLite | PostgreSQL |
|--------|-----------|
| `?` placeholders | `$1, $2` placeholders |
| `.run()`, `.get()`, `.all()` | `await pool.query()` everywhere |
| Synchronous (fake async) | Truly async |
| File lock | Connection pool (10 parallel) |

---

## Update server.js — Add async/await

The database functions are now truly async. Add `async` and `await`:

```javascript
// server.js
import express from 'express';
import { nanoid } from 'nanoid';
import { saveUrl, findUrl, incrementClicks, getAllUrls } from './database.js';

const app = express();
const PORT = 3000;

app.use(express.json());

app.post('/shorten', async (req, res) => {  // ← async
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'url field is required' });
  try { new URL(url); } catch { return res.status(400).json({ error: 'invalid url format' }); }

  const code = nanoid(6);
  await saveUrl(code, url);   // ← await

  res.status(201).json({
    shortCode: code,
    shortUrl: `http://localhost:${PORT}/${code}`,
    originalUrl: url,
  });
});

app.get('/:code', async (req, res) => {   // ← async
  const { code } = req.params;
  const entry = await findUrl(code);      // ← await

  if (!entry) return res.status(404).json({ error: 'short URL not found' });

  await incrementClicks(code);            // ← await
  res.redirect(302, entry.url);
});

app.get('/urls', async (req, res) => {   // ← async
  const urls = await getAllUrls();        // ← await
  res.json(urls);
});

app.listen(PORT, () => {
  console.log(`Server running → http://localhost:${PORT}`);
});
```

---

## Delete Old Database and Restart

```bash
# Delete the old SQLite file
del urls.db        # Windows
# rm urls.db       # Mac/Linux

# Start fresh
node server.js
```

You should see: `Database ready` then `Server running → http://localhost:3000`

---

## Quick Manual Test

```bash
curl -X POST http://localhost:3000/shorten \
  -H "Content-Type: application/json" \
  -d '{"url": "https://github.com/dhairya-soni"}'

# Should return 201 with shortCode
```

---

## Run the Load Test Again

```bash
k6 run load-test.js
```

Expected results:

```
     ✓ shorten → 201
     ✓ redirect → 302

     checks.........................: 99.7%
     http_req_duration..............: avg=31ms   p(95)=68ms
     http_req_failed................: 0.21%
     http_reqs......................: 18400  613/s
```

### Before vs After

| Metric | SQLite v1 | PostgreSQL v2 | Improvement |
|--------|-----------|---------------|-------------|
| Avg response | 890ms | 31ms | **28x faster** |
| p(95) latency | 2,100ms | 68ms | **30x faster** |
| Error rate | 34% | 0.2% | **170x fewer errors** |
| Requests/sec | 421 | 613 | 1.5x more throughput |

---

## Why This Works

```
Before (SQLite):                  After (PostgreSQL + pool):
  200 requests                      200 requests
       │                                 │
  SQLite lock                      Pool of 10 connections
  (1 at a time)                    (10 at a time)
       │                                 │
  Queue depth: 200             Queue depth: 20 (200 ÷ 10)
  Wait time: ~900ms            Wait time: ~30ms
```

The connection pool is the key insight. By handling 10 queries simultaneously instead of 1, the queue drains 10x faster.

---

## Write Your Build Log Entry #2

```
## What Changed
Migrated from SQLite to PostgreSQL with a connection pool (max: 10).

## Results
| Metric         | Before (SQLite) | After (PostgreSQL) |
|----------------|-----------------|-------------------|
| Avg latency    | 890ms           | 31ms              |
| Error rate     | 34%             | 0.2%              |

## Why It Worked
Connection pool allows 10 parallel queries.
Queue depth dropped from 200 to 20.
```

Next: [Add Redis Cache →](../04-redis/README.md)
