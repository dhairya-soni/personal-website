# Databases 101 — Just What You Need

You don't need to know everything about databases. You need enough to build, break, and fix a URL shortener.

---

## What a Database Is

A database is a program that stores data and lets you query it efficiently. That's it.

Your URL shortener needs to:
1. Store: `short_code → original_url`
2. Look up: given a `short_code`, find the `original_url`

A simple dictionary/object in memory would work — until the server restarts and you lose everything. A database persists data to disk.

---

## SQL — 4 Things You'll Use

SQL (Structured Query Language) is how you talk to most databases. You genuinely only need 4 operations:

### 1. CREATE TABLE — define your structure
```sql
CREATE TABLE urls (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  code       TEXT NOT NULL UNIQUE,
  url        TEXT NOT NULL,
  clicks     INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);
```

Think of this like defining a spreadsheet: columns, their types, and constraints.

- `PRIMARY KEY` → unique identifier for each row, auto-increments
- `NOT NULL` → this column must always have a value
- `UNIQUE` → no two rows can have the same code
- `DEFAULT` → value used if you don't provide one

### 2. INSERT — store data
```sql
INSERT INTO urls (code, url) VALUES ('ab3kx9', 'https://google.com');
```

### 3. SELECT — read data
```sql
-- Get one row by code
SELECT * FROM urls WHERE code = 'ab3kx9';

-- Get all rows
SELECT * FROM urls ORDER BY created_at DESC;

-- Get specific columns
SELECT code, url, clicks FROM urls WHERE code = 'ab3kx9';
```

### 4. UPDATE — modify data
```sql
-- Increment click count when someone visits a short URL
UPDATE urls SET clicks = clicks + 1 WHERE code = 'ab3kx9';
```

That's genuinely all you need for v1 of the URL shortener.

---

## SQLite vs PostgreSQL

### SQLite
- Entire database = one file on disk (`urls.db`)
- Zero setup — just `npm install better-sqlite3`
- Fast for reads, reliable for small apps
- **Critical limitation**: one write at a time (file lock)
- Used by: mobile apps, browsers (Chrome uses SQLite internally), small tools

### PostgreSQL
- Runs as a separate process (a server)
- Needs installation and a bit of setup
- Handles many concurrent reads AND writes
- Has connection pools, advanced indexing, transactions
- Used by: Instagram, Reddit, Spotify, most serious web apps

You'll start with SQLite because setup is instant. You'll switch to PostgreSQL because SQLite breaks.

---

## What a Connection Pool Is

Every time Node.js talks to PostgreSQL, it needs a "connection" — like a dedicated phone line.

Opening a new connection takes ~50ms. Doing that for every single request is wasteful.

A **connection pool** opens connections once and reuses them:

```
Without pool (open/close per request):
  Request 1: open (50ms) → query (5ms) → close
  Request 2: open (50ms) → query (5ms) → close
  Request 3: open (50ms) → query (5ms) → close
  Effective cost per request: 55ms

With pool (10 connections kept open):
  Request 1: use conn 1 → query (5ms) → return conn to pool
  Request 2: use conn 2 → query (5ms) → return conn to pool
  Request 3: use conn 3 → query (5ms) → return conn to pool
  Effective cost per request: 5ms
  And up to 10 run simultaneously
```

In code:
```javascript
import pg from 'pg';
const pool = new pg.Pool({ max: 10 });  // keep 10 connections open

// This picks a free connection, runs the query, returns it to pool
const result = await pool.query('SELECT * FROM urls WHERE code = $1', [code]);
```

---

## Indexes — Why Queries Get Slow at Scale

An index is like the index at the back of a textbook. Without it, the database reads every single row to find what you want.

```
urls table with 1,000,000 rows:

Without index on 'code':
  SELECT * FROM urls WHERE code = 'ab3kx9'
  → reads all 1,000,000 rows to find the one match
  → takes ~500ms

With index on 'code':
  SELECT * FROM urls WHERE code = 'ab3kx9'
  → jumps directly to the matching row using B-tree lookup
  → takes ~1ms
```

Creating an index:
```sql
CREATE INDEX idx_urls_code ON urls(code);
```

Rule: **always index columns you query by.** For your URL shortener, that's `code`.

At 1,000 rows it won't matter. At 10,000,000 rows it's the difference between 1ms and 500ms.

---

## Key Takeaways

1. SQL is just 4 operations: CREATE TABLE, INSERT, SELECT, UPDATE
2. SQLite = file on disk, one write at a time, zero setup
3. PostgreSQL = proper server, concurrent writes, connection pools
4. Indexes make reads fast at scale — always index what you search by
5. Connection pools avoid the overhead of opening a new connection per request

You now know enough to build v1.

Next: [Build the URL Shortener →](../01-build-v1/README.md)
