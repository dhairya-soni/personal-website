# Resources — What to Use, Read, and Watch

Curated specifically for this roadmap. Not exhaustive — just what's useful.

---

## Tools to Install (in order)

| Tool | Why You Need It | Where to Get It |
|------|----------------|-----------------|
| Node.js LTS | Run your server | nodejs.org |
| k6 | Load testing | dl.k6.io/msi/k6-latest-amd64.msi |
| PostgreSQL | Production database | postgresql.org/download/windows |
| Docker Desktop | Run Redis easily | docker.com/products/docker-desktop |
| Postman or Bruno | Test APIs without curl | postman.com / usebruno.com |
| TablePlus | View DB contents visually | tableplus.com (free tier is enough) |

---

## Documentation (open these as you build)

- **Express.js routing**: https://expressjs.com/en/guide/routing.html
- **better-sqlite3 API**: https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md
- **node-postgres (pg)**: https://node-postgres.com/
- **ioredis**: https://github.com/redis/ioredis#readme
- **k6 docs**: https://k6.io/docs/

---

## One Video You Must Watch

**"What the heck is the event loop anyway?"** — Philip Roberts, JSConf 2014

Search it on YouTube. 26 minutes. Best explanation of the Node.js event loop that exists. Watch it before Phase 1.

---

## Concept Reading (read when that concept comes up)

### HTTP / REST
- MDN HTTP overview: https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview

### PostgreSQL
- PostgreSQL basics tutorial: https://www.postgresqltutorial.com/ (just the "Getting Started" section)

### Redis
- Redis in 100 seconds (video): search "Redis in 100 seconds Fireship" on YouTube
- Redis data types: https://redis.io/docs/data-types/

### System Design (after you finish the URL shortener)
- System Design Primer (GitHub): https://github.com/donnemartin/system-design-primer
- Search "system design URL shortener" on YouTube — many good videos

---

## For Later (Month 2+)

- **"Designing Data-Intensive Applications"** by Martin Kleppmann
  The best book on distributed systems. Don't read cover to cover — read chapters as topics come up.
- **"Node.js Design Patterns"** by Mario Casciaro
  Good for understanding Node.js internals deeply.

---

## When You're Stuck

1. Read the error message carefully — it usually tells you exactly what's wrong
2. Copy the exact error message into Google
3. Check Stack Overflow for the same error
4. Check the library's GitHub issues tab
5. Ask on r/node or r/learnprogramming with: what you tried, what you expected, what actually happened

Don't ask "it doesn't work." Ask "I expected X, I got Y, here's the code and the error."

---

## After Each Phase

Write a build log entry on your site. Use this template:

```markdown
## The Goal
[What were you trying to do]

## What I Built / Changed
[Specific technical change]

## Results
| Metric         | Before | After |
|----------------|--------|-------|
| Avg latency    | ???    | ???   |
| Error rate     | ???    | ???   |
| Requests/sec   | ???    | ???   |

## Why It Worked (or Didn't)
[Your explanation of the cause]

## Next Step
[What you're going to try next]
```

These entries are your proof of work. They're what make your site different from every other portfolio.
