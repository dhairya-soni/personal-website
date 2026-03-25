# URL Shortener — Your Learning Curriculum

This folder is your complete guide to building a URL shortener from scratch.
No prior backend experience needed. Each phase teaches you exactly what you need, when you need it.

## What You're Building

A URL shortener like bit.ly:
- Give it a long URL → get back a short code
- Visit the short code → redirects to the original URL

Simple on the surface. Breaks in interesting ways at scale. That's the point.

## The 4-Phase Plan

| Phase | Folder | What You Build | What You Learn |
|-------|--------|---------------|----------------|
| 0 | `00-foundations/` | Nothing yet — just reading | HTTP, REST, Node.js event loop, databases |
| 1 | `01-build-v1/` | Node.js + SQLite server | APIs, routing, basic backend |
| 2 | `02-load-testing/` | Load tests with k6 | Why it breaks, what the metrics mean |
| 3 | `03-postgresql/` | Migrate to PostgreSQL | Connection pools, concurrent DB access |
| 4 | `04-redis/` | Add Redis caching | Cache-aside pattern, memory vs disk |

## Before You Start

You need Node.js installed. Check:
```bash
node --version   # should say v18 or higher
npm --version    # should say v9 or higher
```

If not installed: go to https://nodejs.org → download the LTS version → install it.

## How to Use This

1. Read each concept file before building — they're short and practical
2. Follow the build guides step by step
3. **Type the code, don't copy-paste** — muscle memory matters
4. When something breaks, that's the point — the guide explains why
5. After each phase, write a build-log entry on your site

## Time Estimate

- Phase 0: 2–3 hours (reading + watching one video)
- Phase 1: 3–4 hours (building)
- Phase 2: 1–2 hours (load testing + observing results)
- Phase 3: 3–4 hours (rebuilding with PostgreSQL)
- Phase 4: 3–4 hours (adding Redis)

**Total: roughly 2 focused weekends.**

## After Each Phase — Write a Log Entry

This is not optional. The log entries are why you're doing this publicly.

Template for each entry:
- What you built or changed
- The exact metrics (copy from k6 output)
- Why you think it broke or improved
- What you're doing next

Start with Phase 0: [00-foundations →](./00-foundations/01-http-and-rest.md)
