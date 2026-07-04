# Syllabify — Setup Guide

A learning platform for Nigerian university students and fresh graduates.
**Next.js (App Router) · TypeScript · Supabase · Cloudinary · Tailwind v4 · shadcn/ui**

The app ships with **placeholder env values** so the UI runs locally without a
backend. While `NEXT_PUBLIC_SUPABASE_URL` contains `placeholder`, the app runs
in **preview mode**: auth checks are skipped and data calls return empty states.
Fill in real credentials (below) to switch on the real backend.

---

## 1. Install & run

```bash
npm install
npm run dev          # http://localhost:3000
```

---

## 2. Supabase (database + auth)

1. Create a project at [supabase.com](https://supabase.com).
2. **SQL Editor → New query** → paste & run `supabase/migrations/0001_init.sql`
   (creates tables, RLS policies, and the new-user trigger), then
   `supabase/migrations/0002_universities.sql` (universities + departments,
   seeded with 101 Nigerian universities and the standard NUC programmes —
   manage them later under **Admin → Universities**), and
   `supabase/migrations/0003_tracks_and_kinds.sql` (learner tracks & course
   kinds: students get university courses + digital skills, graduates get
   trainee brochures + digital skills).
   Optionally run `supabase/seed.sql` for a few demo courses.
3. **Project Settings → API** → copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ server-only)
4. **Authentication → Providers**: enable **Google**, **GitHub**, and **Email**
   (turn on "Confirm email"). Add OAuth client IDs/secrets per provider.
5. **Authentication → URL Configuration**:
   - Site URL: `http://localhost:3000` (and your Vercel URL in production)
   - Redirect URLs: add `http://localhost:3000/auth/callback` and
     `https://YOUR-DOMAIN/auth/callback`.
6. **Make yourself admin**: after signing up once, run in SQL Editor:
   ```sql
   update public.profiles set role = 'admin'
   where id = (select id from auth.users where email = 'you@example.com');
   ```
   Admin access is gated by the `ADMIN_EMAIL` env var (server-side, in middleware).

---

## 3. Cloudinary (PDFs, videos, thumbnails)

1. Create a free account at [cloudinary.com](https://cloudinary.com).
2. **Dashboard** → copy `Cloud name`, `API Key`, `API Secret` into env.
3. **Settings → Security** → tick **"Allow delivery of PDF and ZIP files"**
   (required for the inline PDF viewer to work).
4. Uploads are **signed server-side** via `/api/upload` — the API secret never
   reaches the browser. PDFs/videos are delivered **inline only** (no download).

---

## 4. Environment variables

Copy `.env.example` → `.env.local` and fill in:

| Variable | Where |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | client + server |
| `SUPABASE_SERVICE_ROLE_KEY` | **server only** |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | client + server |
| `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | **server only** |
| `ADMIN_EMAIL` | the only email allowed into `/admin` |
| `NEXT_PUBLIC_ADSENSE_*` | optional — AdSense client + slot ids |
| `NEXT_PUBLIC_APP_URL` | your deployed URL |

---

## 5. Deploy (Vercel)

1. Push to GitHub, import into [Vercel](https://vercel.com).
2. Add every variable from `.env.local` to the Vercel project (Production).
3. Update Supabase **Site URL** and **Redirect URLs** to your Vercel domain.

---

## Security model (at a glance)

- **RLS on every table.** Students only ever read their own data and published,
  *enrolled* materials. Course/material **writes go through the service-role
  client in Server Actions** — never from the browser.
- **Middleware** redirects unauthenticated users away from `/dashboard`,
  `/courses`, `/admin`, sends signed-in users away from `/login` & `/signup`,
  and blocks `/admin/**` for anyone whose email ≠ `ADMIN_EMAIL`.
- **Sessions** live in httpOnly cookies (Supabase SSR) — nothing sensitive in
  `localStorage`.
- **PDFs/videos** are delivered inline with no download URL exposed; note HTML
  is sanitised with DOMPurify before render.
