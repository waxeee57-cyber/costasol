# Environment Variables

Copy `.env.example` to `.env.local` for local development.

## Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (server only) |
| `RESEND_API_KEY` | Yes (launch) | Resend API key. Set to `dev` locally to skip actual sends. |
| `RESEND_FROM_EMAIL` | Yes (launch) | Verified sender email, e.g. `hello@costasol.com` |
| `N8N_WEBHOOK_URL` | Yes (launch) | Full n8n webhook URL. Empty = skipped, logs payload. |
| `N8N_WEBHOOK_SECRET` | Yes (launch) | Secret sent in `x-webhook-secret` header |
| `ADMIN_EMAIL` | Yes | Owner email for admin notifications |
| `NEXT_PUBLIC_SITE_URL` | Yes | Full URL, e.g. `https://costasol.com`. Used in emails. |
| `NEXT_PUBLIC_BUSINESS_NAME` | No | Defaults to `CostaSol Car Rent` |
| `NEXT_PUBLIC_BUSINESS_PHONE` | Yes (launch) | Phone in international format, e.g. `+34600000000` |
| `NEXT_PUBLIC_BUSINESS_WHATSAPP` | Yes (launch) | WhatsApp number without +, e.g. `34600000000` |
| `MAINTENANCE_MODE` | No | Set to `true` to show maintenance page on all public routes |

## Analytics

Vercel Analytics is enabled by default — view dashboards in your Vercel project under the Analytics tab. No additional configuration required.

## Graceful degradation (dev)

- `RESEND_API_KEY=dev` → skips Resend calls, logs to console
- `N8N_WEBHOOK_URL` empty → skips n8n calls, logs to console
- Both behaviours are for development only. Production must have real values.
