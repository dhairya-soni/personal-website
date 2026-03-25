# HTTP and REST — What's Actually Happening

Before writing a single line of backend code, understand what happens when a browser visits a URL. Everything else builds on this.

## What Happens When You Visit a URL

Type `https://google.com` in a browser. Here's the actual conversation:

```
Your Browser                        Google's Server
     |                                    |
     |  ── HTTP Request ────────────────> |
     |  GET / HTTP/1.1                    |
     |  Host: google.com                  |
     |                                    |
     |  <── HTTP Response ─────────────── |
     |  HTTP/1.1 200 OK                   |
     |  Content-Type: text/html           |
     |  <html>...</html>                  |
```

That's it. HTTP is just a text-based conversation between a client (browser) and a server.

---

## The Request — 4 Parts

**1. Method** — what action you want
```
GET     → read something
POST    → create something
PUT     → replace something
PATCH   → partially update something
DELETE  → delete something
```

**2. Path** — where to find it
```
/                   → homepage
/users              → list of users
/users/42           → specific user
/shorten            → your URL shortener endpoint
```

**3. Headers** — metadata
```
Content-Type: application/json    → "I'm sending JSON data"
Authorization: Bearer abc123      → "Here's my auth token"
```

**4. Body** — data you're sending (only with POST/PUT/PATCH)
```json
{
  "url": "https://very-long-url.com/with/lots/of/stuff"
}
```

---

## The Response — 3 Parts

**1. Status code** — what happened
```
200 OK           → success
201 Created      → created something new
302 Found        → "go here instead" (redirect) ← you'll use this
400 Bad Request  → you sent something wrong
404 Not Found    → doesn't exist
500 Server Error → something crashed on the server side
```

**2. Headers** — metadata about the response
```
Content-Type: application/json
Location: https://original-long-url.com   → where to redirect
```

**3. Body** — the data coming back
```json
{
  "shortCode": "ab3kx9",
  "shortUrl": "http://localhost:3000/ab3kx9"
}
```

---

## How Your URL Shortener Uses This

You need exactly 2 routes:

**Route 1 — Create a short URL:**
```
POST /shorten
Body:     { "url": "https://long-url.com" }
Response: { "shortCode": "ab3kx9", "shortUrl": "http://localhost:3000/ab3kx9" }
Status:   201 Created
```

**Route 2 — Redirect to the original:**
```
GET /ab3kx9
Response: (no body — just a redirect)
Status:   302 Found
Header:   Location: https://long-url.com
```

When a browser sees a 302 response, it automatically goes to whatever URL is in the `Location` header. That's how every URL shortener in the world works.

---

## What REST Is

REST is just a set of agreed-upon conventions for designing APIs using HTTP. Instead of everyone inventing their own URL structures, REST says:

| What you want to do | Method | Path |
|--------------------|--------|------|
| Create a short URL | POST | /shorten |
| Visit a short URL | GET | /:code |
| Delete a short URL | DELETE | /urls/:code |

That's literally it. Conventions, not magic.

---

## Try It Right Now

`curl` is a command-line tool for making HTTP requests. It's already on Windows 10+.

```bash
# Make a GET request — see the response
curl https://httpbin.org/get

# Make a POST with JSON
curl -X POST https://httpbin.org/post \
  -H "Content-Type: application/json" \
  -d '{"url": "https://google.com"}'
```

Look at what comes back. Notice the method, status, headers, body. This is HTTP.

---

## Key Takeaway

HTTP = text messages between computers.
REST = naming conventions for URLs.
Your URL shortener = a program that receives these messages, stores/looks up URLs, sends messages back.

Next: [The Node.js Event Loop →](./02-nodejs-event-loop.md)
