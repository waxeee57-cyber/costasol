# Environment Variables

Copy `.env.example` to `.env.local` for local development.

## Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (server only) |
| `RESEND_API_KEY` | Yes (launch) | Resend API key. Leave empty locally — emails log to console. |
| `RESEND_FROM_EMAIL` | Yes (launch) | Verified sender address, e.g. `noreply@drivecostasol.com`. Domain must be verified in Resend dashboard first. |
| `RESEND_FROM_NAME` | No | Display name in From header. Defaults to `CostaSol Car Rent`. |
| `N8N_WEBHOOK_URL` | No | n8n webhook URL — only needed for WhatsApp automation. Empty = skipped. |
| `N8N_WEBHOOK_SECRET` | No | Secret sent in `x-webhook-secret` header for n8n. |
| `ADMIN_EMAIL` | Yes | Owner email for admin notifications |
| `NEXT_PUBLIC_SITE_URL` | Yes | Full URL, e.g. `https://costasol.com`. Used in emails. |
| `NEXT_PUBLIC_BUSINESS_NAME` | No | Defaults to `CostaSol Car Rent` |
| `NEXT_PUBLIC_BUSINESS_PHONE` | Yes (launch) | Phone in international format, e.g. `+34600000000` |
| `NEXT_PUBLIC_BUSINESS_WHATSAPP` | Yes (launch) | WhatsApp number without +, e.g. `34600000000` |
| `MAINTENANCE_MODE` | No | Set to `true` to show maintenance page on all public routes |

## Analytics

Vercel Analytics is enabled by default — view dashboards in your Vercel project under the Analytics tab. No additional configuration required.

## Email (Resend)

RESEND_API_KEY         — from resend.com dashboard → API Keys
                         Leave empty during development (emails log to console)
                         Required for production email delivery

RESEND_FROM_EMAIL      — verified sender address, e.g. noreply@drivecostasol.com
                         Domain must be verified in Resend dashboard first
                         (DNS records set via Rackhost)

RESEND_FROM_NAME       — display name, default: "CostaSol Car Rent"

ADMIN_EMAIL            — where admin alerts are sent, e.g. rent@drivecostasol.com
                         Already set — verify this is correct

## Graceful degradation (dev)

- `RESEND_API_KEY` empty → skips Resend calls, logs to console
- `N8N_WEBHOOK_URL` empty → skips n8n calls, logs to console
