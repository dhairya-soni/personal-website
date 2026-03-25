# Step 1 — Project Setup

## Create the Folder

Open a terminal. Navigate somewhere like `Documents/projects/` and run:

```bash
mkdir url-shortener
cd url-shortener
npm init -y
```

`npm init -y` creates `package.json` — the file that tracks your project and its dependencies.

## Install Dependencies

```bash
npm install express better-sqlite3 nanoid
```

What each does:
- **express** — HTTP framework. Handles routing, parsing request bodies, sending responses. The industry standard for Node.js servers.
- **better-sqlite3** — SQLite client for Node.js. Fast, simple, zero config.
- **nanoid** — Generates short random strings like `ab3kx9`. Better than `Math.random()`.

## Fix package.json

Open `package.json`. It looks like this:
```json
{
  "name": "url-shortener",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "better-sqlite3": "^9.x.x",
    "express": "^4.x.x",
    "nanoid": "^5.x.x"
  }
}
```

Replace it with:
```json
{
  "name": "url-shortener",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "better-sqlite3": "^9.4.3",
    "express": "^4.18.2",
    "nanoid": "^5.0.4"
  }
}
```

Two changes:
- `"type": "module"` — lets you use `import` instead of `require` (modern JavaScript)
- Updated `"scripts"` — now `npm start` runs your server

## Your Folder Now Looks Like

```
url-shortener/
  node_modules/     ← installed packages (don't touch this)
  package.json      ← your project config
  package-lock.json ← exact version lock (don't touch)
```

Next: [Build the Database Layer →](./02-database.md)
