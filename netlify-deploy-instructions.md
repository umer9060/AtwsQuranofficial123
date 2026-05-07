# Netlify Deployment Instructions

## Pre-requisites

Before deploying, you must set these environment variables in your Netlify site settings
(Site → Environment Variables):

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (same as your Replit DATABASE_URL) |

> **Important:** Netlify Functions cannot use the Replit-managed PostgreSQL.
> You need an external PostgreSQL database (e.g. Neon, Supabase, Railway, or any hosted Postgres).
> Copy the connection string from that provider and paste it as `DATABASE_URL`.

## Deploy Steps

### Option A — Netlify CLI (recommended)
```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

### Option B — Connect via GitHub
1. Push this repo to GitHub
2. Go to https://app.netlify.com → "Add new site" → "Import an existing project"
3. Select your GitHub repo
4. Build settings are auto-detected from `netlify.toml`:
   - **Build command:** `pnpm install && pnpm --filter @workspace/api-server run build && BASE_PATH=/ pnpm --filter @workspace/islamic-lms run build`
   - **Publish directory:** `artifacts/islamic-lms/dist/public`
5. Add `DATABASE_URL` under Site → Environment Variables
6. Click **Deploy**

## How it works

| Layer | Technology | Where it runs |
|-------|-----------|--------------|
| Frontend | React + Vite | Netlify CDN (static) |
| Backend API | Express (wrapped) | Netlify Function (`netlify/functions/netlify-handler.mjs`) |
| Database | PostgreSQL | External hosted Postgres |

- All `/api/*` requests are proxied to the Netlify Function
- All other routes serve `index.html` (SPA routing)

## Demo credentials (after seeding your DB)
- Admin: `admin@atwsquran.com` / `admin123`
- Teacher: `teacher@atwsquran.com` / `teacher123`
- Student: `student@atwsquran.com` / `student123`
