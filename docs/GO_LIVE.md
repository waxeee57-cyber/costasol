# CostaSol Car Rent — Go-Live Guide

## 1. Pre-Flight Checklist

### Supabase
- [ ] Schema applied: `supabase/schema.sql` run in SQL Editor (check `bookings`, `cars`, `customers`, `inquiries` tables exist)
- [ ] Seed applied: `supabase/seed.sql` run (check two cars appear in Table Editor)
- [ ] RLS policies enabled on all tables
- [ ] Storage bucket `documents` created with private policy
- [ ] `btree_gist` extension enabled (required for the overlap exclusion constraint)
- [ ] Auth → Email auth enabled, `admin@costasol.com` user created with a strong password

### Environment Variables (Vercel)
Set in Vercel → Project → Settings → Environment Variables (all environments):

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → `anon` `public` key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → `service_role` key (keep secret) |
| `RESEND_API_KEY` | Resend → API Keys |
| `RESEND_FROM_EMAIL` | e.g. `bookings@costasol.com` (must be a verified sender in Resend) |
| `ADMIN_EMAIL` | e.g. `admin@costasol.com` — receives inquiry alerts |
| `N8N_WEBHOOK_URL` | n8n webhook URL from the `inquiry-created` workflow (leave empty to disable) |
| `SITE_URL` | `https://costasol.com` (no trailing slash) |

### Resend
- [ ] Domain `costasol.com` verified (DNS records added)
- [ ] Sender address matches `RESEND_FROM_EMAIL`
- [ ] Test email sent to yourself via Resend dashboard

### Domain (Vercel)
- [ ] Custom domain `costasol.com` added to Vercel project
- [ ] DNS A / CNAME records pointed at Vercel nameservers
- [ ] SSL certificate provisioned (automatic — wait ~5 min after DNS propagates)

---

## 2. Launch Sequence

1. **Push code to GitHub** — Vercel auto-deploys on push to `main`
2. **Set all environment variables** in Vercel before the deploy goes live
3. **Trigger a fresh deploy** in Vercel → Deployments → Redeploy (so the new env vars are picked up)
4. **Run smoke tests** (see Section 3)
5. **Point DNS** to Vercel (if not already done)
6. **Announce** — update Google Business, Instagram bio, etc.

---

## 3. Smoke Test Checklist

Run these after every deploy:

### Public Site
- [ ] Homepage loads, hero image visible, CTA button works
- [ ] Fleet page lists both cars with images
- [ ] Car detail page shows availability calendar (try picking a date range)
- [ ] Inquiry form submits successfully — check Supabase `inquiries` table for the new row
- [ ] Inquiry confirmation email arrives in the customer inbox
- [ ] Inquiry alert email arrives in `ADMIN_EMAIL` inbox
- [ ] `/booking/[code]` page loads with a real booking code
- [ ] Cookie banner appears on first visit, disappears after Accept

### Admin Panel
- [ ] `/admin/login` — sign in with admin credentials
- [ ] Bookings list loads, filter chips work
- [ ] Expand a booking row — all 6 sections visible
- [ ] Status transitions work: Confirm → Picked Up → Returned → Complete
- [ ] Admin notes auto-save (type something, reload, verify it persisted)
- [ ] Document upload works (try uploading a small JPEG)

### API Health
- [ ] `/api/health` returns `{ ok: true }`

---

## 4. Rollback

If a bad deploy goes out:

1. **Vercel** → Deployments → find the last good deployment → click **Promote to Production**
   - Takes ~30 seconds, zero downtime

2. If a database migration caused the issue:
   - Revert in Supabase SQL Editor manually (ALTER TABLE / DROP COLUMN etc.)
   - There is no automatic DB rollback — schema changes must be reverted by hand

3. **Maintenance mode** (while you fix):
   - In Vercel → Environment Variables → add `MAINTENANCE_MODE=true`
   - Redeploy — all public pages redirect to `/maintenance`
   - Remove the variable and redeploy again to lift it
