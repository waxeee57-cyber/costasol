import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const checks: Record<string, boolean | string> = {
    supabase: false,
    resend: false,
    n8n_url_configured: false,
  }

  // Supabase ping
  try {
    const { error } = await supabaseAdmin.from('cars').select('id').limit(1)
    checks.supabase = !error
  } catch {
    checks.supabase = false
  }

  // Resend configured (non-empty, non-dev)
  const resendKey = process.env.RESEND_API_KEY ?? ''
  checks.resend = resendKey.length > 0 && resendKey !== 'dev'

  // n8n webhook URL configured
  checks.n8n_url_configured = !!process.env.N8N_WEBHOOK_URL

  const allOk = checks.supabase === true && checks.resend === true

  return NextResponse.json(
    { ok: allOk, checks, ts: new Date().toISOString() },
    { status: allOk ? 200 : 503 }
  )
}
