# Netlify Deployment Instructions

## Pre-requisites

Before deploying, set these environment variables in your Netlify site settings
(Site → Environment Variables):

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (external hosted Postgres, e.g. Neon, Supabase) |

> **Note:** Netlify Functions cannot use the Replit-managed PostgreSQL.
> Get a free external Postgres from https://neon.tech and paste the connection string as `DATABASE_URL`.

## Deploy Steps

### Option A — Connect via GitHub (easiest)
1. Push this repo to GitHub
2. Go to https://app.netlify.com → "Add new site" → "Import an existing project"
3. Select your GitHub repo
4. Build settings are auto-detected from `netlify.toml`:
   - **Build command:** `pnpm install && pnpm --filter @workspace/api-server run build && BASE_PATH=/ pnpm --filter @workspace/islamic-lms run build`
   - **Publish directory:** `artifacts/islamic-lms/dist/public`
5. Add `DATABASE_URL` under Site → Environment Variables
6. Click **Deploy**

### Option B — Netlify CLI
```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

## How it works

| Layer | Technology | Where it runs |
|-------|-----------|--------------|
| Frontend | React + Vite | Netlify CDN (static files) |
| Backend API | Express (serverless) | Netlify Function (`netlify/functions/netlify-handler.mjs`) |
| Database | PostgreSQL | External hosted Postgres |

- `/api/*` requests → Netlify Function (your full Express API)
- All other routes → `index.html` (SPA routing support)

## Demo login credentials (after seeding your DB)
- Admin: `admin@atwsquran.com` / `admin123`
- Teacher: `teacher@atwsquran.com` / `teacher123`
- Student: `student@atwsquran.com` / `student123`
