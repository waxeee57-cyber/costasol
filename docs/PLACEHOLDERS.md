# Placeholders

## 🔴 BLOCKING — Required before going live

These items must be resolved before the site goes live. Launching with any of
these unresolved is a legal or operational risk.

| Item | Location | Notes |
|---|---|---|
| Real car deposit amounts | Supabase Studio → cars table | Seed values: Huracán €15,000 / Range Rover €5,000 are estimates. Verify with your insurance policy and market rates. |
| Resend verified sender domain | `.env` `RESEND_FROM_EMAIL` | DNS SPF/DKIM/DMARC records must propagate (up to 24h). Emails go to spam or fail until verified. |
| Legal page bodies | `/terms`, `/privacy`, `/cookies`, `/insurance`, `/cancellation` | Interim notices are live. Full gestor text still required for LSSI/GDPR compliance before heavy traffic. |
| Business contact email | `components/marketing/Footer.tsx` + legal pages | Currently shows `hello@drivecostasol.com`. Set up email forwarding on your domain and update this address. Legal pages read `ADMIN_EMAIL` env var as fallback. |
| WhatsApp number | `.env` `NEXT_PUBLIC_BUSINESS_WHATSAPP` | International format without +, e.g. `34600000000`. Test the link manually before launch. |
| Business phone | `.env` `NEXT_PUBLIC_BUSINESS_PHONE` | Shown in footer and contact page. |
| Real car photos | Supabase Storage `car-photos` bucket | Upload min. 5 photos per car. Update `photos` JSONB column in Supabase Studio. Unsplash placeholders are not acceptable for a luxury brand at launch. |

## 🟡 NICE-TO-HAVE — Can launch with placeholders, refine later

| Item | Location | Notes |
|---|---|---|
| n8n workflow | n8n dashboard | Optional — only needed if you want WhatsApp automation in addition to emails. Import `/n8n/workflows/inquiry-created.json` and add credentials. |
| Email copy refinement | `/lib/email/templates.ts` | Default copy is functional. Personalise before heavy traffic. |
| Tagline | `app/(public)/page.tsx` | Default: "The Coast, Driven Beautifully" — accepted by most owners at launch. |
| About page copy | `app/(public)/about/page.tsx` | Replace placeholder paragraph with owner's story. |
| FAQ answers | `components/marketing/FAQ.tsx` | Current answers are accurate but generic. Personalise with real policy details. |
| Real Marbella hero photography | `public/hero/` | Unsplash works for first weeks while professional shoot is arranged. |
