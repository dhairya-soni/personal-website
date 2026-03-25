# Phase 1 — Build the URL Shortener (v1)

You're building a working URL shortener. Intentionally simple — no caching, no clustering, SQLite database. It will work fine for one person and break under load. That's the plan.

## What You're Building

```
POST /shorten     accepts a long URL, returns a short code
GET  /:code       redirects to the original URL
GET  /urls        lists all shortened URLs (for debugging)
```

## Architecture

```
curl / Browser
      │
      ▼
  Express.js       ← HTTP server — routes requests, sends responses
  (Node.js)
      │
      ▼
  better-sqlite3   ← reads/writes to a local file
  (urls.db)
```

One server. One file. Simple on purpose.

## What You'll Learn

- Setting up a Node.js project from scratch
- Writing Express routes
- Storing and querying data with SQLite
- Generating random short codes with nanoid
- HTTP 302 redirects

## Files You'll Create

```
url-shortener/          ← create this OUTSIDE the personal website folder
  package.json
  database.js           ← DB setup + query functions
  server.js             ← HTTP server + routes
  urls.db               ← auto-created by SQLite
```

**Important:** Create this in a separate folder, e.g. `Documents/projects/url-shortener`. Not inside the personal website project.

---

Steps:
1. [Setup →](./01-setup.md)
2. [Database layer →](./02-database.md)
3. [HTTP server →](./03-server.md)
4. [Test it manually →](./04-test.md)
