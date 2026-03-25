# Step 4 — Test It Manually

Your server is running. Let's verify every route works before load testing.

Keep the server terminal open. All commands below go in a **second terminal**.

---

## Test 1: Shorten a URL

```bash
curl -X POST http://localhost:3000/shorten \
  -H "Content-Type: application/json" \
  -d '{"url": "https://github.com/dhairya-soni"}'
```

Expected response:
```json
{
  "shortCode": "ab3kx9",
  "shortUrl": "http://localhost:3000/ab3kx9",
  "originalUrl": "https://github.com/dhairya-soni"
}
```

Copy the `shortCode` value — you'll use it in the next test.

---

## Test 2: Follow the Redirect

```bash
# Replace ab3kx9 with your actual shortCode from Test 1
curl -v http://localhost:3000/ab3kx9
```

The `-v` flag shows all headers. You should see:

```
< HTTP/1.1 302 Found
< Location: https://github.com/dhairya-soni
```

That 302 + Location header is the redirect. A browser would automatically navigate to that URL.

Try it in your browser: paste `http://localhost:3000/ab3kx9` into the address bar. It should redirect to GitHub.

---

## Test 3: List All URLs

```bash
curl http://localhost:3000/urls
```

Expected:
```json
[
  {
    "id": 1,
    "code": "ab3kx9",
    "url": "https://github.com/dhairya-soni",
    "clicks": 1,
    "created_at": "2026-03-25 10:30:00"
  }
]
```

Notice `clicks` is 1 — it incremented when you visited the short URL.

---

## Test 4: Validation

```bash
# Missing url field
curl -X POST http://localhost:3000/shorten \
  -H "Content-Type: application/json" \
  -d '{}'

# Expected: { "error": "url field is required" }

# Invalid URL format
curl -X POST http://localhost:3000/shorten \
  -H "Content-Type: application/json" \
  -d '{"url": "not-a-url"}'

# Expected: { "error": "invalid url format" }

# Non-existent code
curl http://localhost:3000/doesnotexist

# Expected: { "error": "short URL not found" }
```

---

## Test 5: Create Several URLs

```bash
curl -X POST http://localhost:3000/shorten \
  -H "Content-Type: application/json" \
  -d '{"url": "https://linkedin.com/in/dhairya-soni-a3b215262/"}'

curl -X POST http://localhost:3000/shorten \
  -H "Content-Type: application/json" \
  -d '{"url": "https://collab-board-pink.vercel.app/"}'

curl http://localhost:3000/urls
```

You should see all three URLs listed.

---

## What You've Built

A real, working URL shortener. It:
- Accepts long URLs via POST
- Generates unique 6-character codes
- Stores them in a SQLite database
- Redirects visitors via HTTP 302
- Tracks click counts
- Validates bad input

It works perfectly for one user. Now let's see what happens with 200 simultaneous users.

Next: [Load Test It →](../02-load-testing/README.md)
