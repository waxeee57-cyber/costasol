# Environment Variables

All variables are set in Vercel (Settings → Environment Variables) and locally in `.env.local`.

## Required — server-side (never expose to client)

| Variable | Description |
|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key — full DB access, bypasses RLS |
| `RESEND_API_KEY` | Resend email API key |
| `N8N_WEBHOOK_URL` | n8n webhook endpoint for booking notifications |
| `N8N_WEBHOOK_SECRET` | Shared secret to authenticate n8n webhook calls |
| `ADMIN_EMAIL` | Admin email address for system notifications |
| `HEALTH_SECRET` | Arbitrary secret header value to unlock `/api/health` details. Generate with `openssl rand -hex 32`. |

## Required — build-time (safe to expose, bundled into client JS)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key — protected by RLS policies |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (e.g. `https://costasol.vercel.app`) |
| `NEXT_PUBLIC_BUSINESS_NAME` | Displayed business name |
| `NEXT_PUBLIC_BUSINESS_PHONE` | Phone number shown on the site |
| `NEXT_PUBLIC_BUSINESS_WHATSAPP` | WhatsApp number (digits only, no `+`) |

## Optional

| Variable | Default | Description |
|---|---|---|
| `MAINTENANCE_MODE` | `false` | Set to `true` to enable the maintenance page |
| `RESEND_FROM_EMAIL` | — | From address for transactional emails |
| `RESEND_FROM_NAME` | `CostaSol Car Rent` | From name for transactional emails |

## Startup validation

In production (`NODE_ENV === production`), `lib/env.ts` → `requireEnv()` throws immediately if `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, or `SUPABASE_SERVICE_ROLE_KEY` are missing, preventing the server from running with broken configuration.

## Health endpoint

`GET /api/health` returns `{ ok: true }` to all anonymous callers.  
To get the full diagnostic payload, pass the secret in a header:

```
curl -H "x-health-secret: <HEALTH_SECRET>" https://costasol.vercel.app/api/health
```
