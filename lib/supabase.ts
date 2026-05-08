import { createClient } from '@supabase/supabase-js'

const FALLBACK_URL = 'https://placeholder.supabase.co'
const FALLBACK_KEY = 'placeholder-key'

function validUrl(val: string | undefined): string {
  if (!val) return FALLBACK_URL
  try {
    const u = new URL(val)
    if (u.protocol === 'https:' || u.protocol === 'http:') return val
  } catch {}
  return FALLBACK_URL
}

const supabaseUrl = validUrl(process.env.NEXT_PUBLIC_SUPABASE_URL)
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || FALLBACK_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})
