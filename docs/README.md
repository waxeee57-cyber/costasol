# CostaSol Car Rent

Luxury car rental website for Marbella & Costa del Sol.

## Stack

- **Framework:** Next.js 16 (App Router), TypeScript
- **Styling:** Tailwind CSS v4
- **Database + Auth + Storage:** Supabase
- **Email:** Resend
- **Automation:** n8n (single workflow)
- **Analytics:** Vercel Analytics
- **Hosting:** Vercel

## Setup

### 1. Clone and install

```bash
git clone <repo>
cd costasol
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in all values.
See `docs/ENV.md` for full documentation.

### 3. Supabase setup

1. Create a Supabase project at supabase.com
2. Run `supabase/schema.sql` in the Supabase SQL editor
3. Run `supabase/policies.sql` in the SQL editor
4. (Dev only) Run `supabase/seed.sql` to add the 2 demo cars
5. Create storage bucket: `documents` (private) — required for pickup document uploads
   - `car-photos` bucket is optional at launch; car photos are served from URLs stored in the `photos` column

### 4. Admin user

In Supabase:
1. Go to Authentication > Users > Add user
2. Create with your admin email + password
3. Run `supabase/admin-seed.sql` in the SQL editor (email is pre-filled)

### 5. n8n workflow

1. Sign up at n8n.cloud or self-host
2. Import `n8n/workflows/inquiry-created.json`
3. Add Resend API credentials in n8n
4. Set `N8N_WEBHOOK_URL` and `N8N_WEBHOOK_SECRET` in env vars

### 6. Run locally

```bash
npm run dev
```

Open http://localhost:3000

## Build

```bash
npm run build
```

## Deploy

Push to GitHub → connect to Vercel → set env vars in Vercel dashboard → deploy.

See `docs/GO_LIVE.md` for the full launch checklist.
