# Step 3 — The HTTP Server

Create `server.js` in your `url-shortener` folder.

## The Full Code

```javascript
// server.js
import express from 'express';
import { nanoid } from 'nanoid';
import { saveUrl, findUrl, incrementClicks, getAllUrls } from './database.js';

const app = express();
const PORT = 3000;

// Parse incoming JSON request bodies automatically
app.use(express.json());

// ── Route 1: Shorten a URL ────────────────────────────────────────────
app.post('/shorten', (req, res) => {
  const { url } = req.body;

  // Validate: url must be provided
  if (!url) {
    return res.status(400).json({ error: 'url field is required' });
  }

  // Validate: must be a real URL
  try {
    new URL(url);
  } catch {
    return res.status(400).json({ error: 'invalid url format' });
  }

  // Generate a 6-character random code (e.g. "ab3kx9")
  const code = nanoid(6);

  // Save to database
  saveUrl(code, url);

  // Respond with the short URL info
  res.status(201).json({
    shortCode: code,
    shortUrl: `http://localhost:${PORT}/${code}`,
    originalUrl: url,
  });
});

// ── Route 2: Redirect ─────────────────────────────────────────────────
app.get('/:code', (req, res) => {
  const { code } = req.params;

  // Look up the code in the database
  const entry = findUrl(code);

  // 404 if code doesn't exist
  if (!entry) {
    return res.status(404).json({ error: 'short URL not found' });
  }

  // Track the click
  incrementClicks(code);

  // 302 redirect to the original URL
  res.redirect(302, entry.url);
});

// ── Route 3: List all URLs (debugging) ───────────────────────────────
app.get('/urls', (req, res) => {
  const urls = getAllUrls();
  res.json(urls);
});

// ── Start the server ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running → http://localhost:${PORT}`);
});
```

## Breaking Down the Key Parts

### `app.use(express.json())`
Middleware that automatically parses incoming request bodies as JSON. Without this, `req.body` would be `undefined`.

### `nanoid(6)`
Generates a random 6-character string like `ab3kx9`. It uses URL-safe characters (no `+`, `/`, `=`). The probability of collision with 6 chars is astronomically low.

### `new URL(url)`
The built-in `URL` constructor throws an error if the string isn't a valid URL. We use this to validate user input. The `try/catch` catches that error.

### `res.redirect(302, entry.url)`
Sends a 302 response with a `Location` header set to the original URL. Browsers and `curl -L` automatically follow this redirect.

### `return res.status(400).json(...)`
The `return` is important — without it, Express would try to send a second response after the `if` block, causing a "headers already sent" error.

---

## Run the Server

```bash
node server.js
```

You should see:
```
Server running → http://localhost:3000
```

Keep this terminal open. Open a new terminal for testing.

Next: [Test It →](./04-test.md)
