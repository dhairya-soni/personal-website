# Step 2 — Database Layer

Create a file called `database.js` in your `url-shortener` folder.

## The Full Code

```javascript
// database.js
import Database from 'better-sqlite3';

// Opens urls.db if it exists, creates it if it doesn't
const db = new Database('urls.db');

// Run this once on startup — creates the table and index
db.exec(`
  CREATE TABLE IF NOT EXISTS urls (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    code       TEXT NOT NULL UNIQUE,
    url        TEXT NOT NULL,
    clicks     INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_urls_code ON urls(code);
`);

// Save a new short URL to the database
export function saveUrl(code, url) {
  const stmt = db.prepare('INSERT INTO urls (code, url) VALUES (?, ?)');
  return stmt.run(code, url);
}

// Find a URL entry by its short code
export function findUrl(code) {
  const stmt = db.prepare('SELECT * FROM urls WHERE code = ?');
  return stmt.get(code);  // returns one row or undefined
}

// Add 1 to the click count for a code
export function incrementClicks(code) {
  const stmt = db.prepare('UPDATE urls SET clicks = clicks + 1 WHERE code = ?');
  return stmt.run(code);
}

// Get all URLs (for debugging)
export function getAllUrls() {
  const stmt = db.prepare('SELECT * FROM urls ORDER BY created_at DESC');
  return stmt.all();  // returns array of all rows
}

export default db;
```

## What Each Part Does

**`new Database('urls.db')`**
Opens the file `urls.db` in your current directory as a SQLite database. Creates the file if it doesn't exist. This file IS your entire database — you can copy it, delete it, open it with TablePlus to inspect it.

**`db.exec(...)`**
Runs SQL directly. We use this to set up the schema when the server starts. The `IF NOT EXISTS` clauses mean it's safe to run every time — won't error if table already exists.

**`db.prepare('INSERT INTO urls (code, url) VALUES (?, ?)')`**
Prepares a SQL statement. The `?` are placeholders — SQLite fills them in safely from the values you pass. **Never** concatenate user input directly into SQL strings — that's a SQL injection vulnerability.

**`.run(code, url)`** — executes the prepared statement with those values. Use for INSERT/UPDATE/DELETE.

**`.get(code)`** — returns one matching row as a JavaScript object, or `undefined` if nothing matches.

**`.all()`** — returns all matching rows as an array.

## Verify It Works

Create a quick test file:

```javascript
// test-db.js
import { saveUrl, findUrl, getAllUrls } from './database.js';

saveUrl('abc123', 'https://google.com');
saveUrl('xyz789', 'https://github.com/dhairya-soni');

console.log(findUrl('abc123'));
// { id: 1, code: 'abc123', url: 'https://google.com', clicks: 0, created_at: '...' }

console.log(getAllUrls());
// [ {...}, {...} ]
```

Run it:
```bash
node test-db.js
```

If you see the objects printed out, your database layer works. Delete `test-db.js` after.

You'll also notice a `urls.db` file appeared in your folder — that's your database.

Next: [Build the HTTP Server →](./03-server.md)
