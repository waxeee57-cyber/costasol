import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { requireEnv } from './env'

// Validate the public vars are present in production. These are used in every
// server-side Supabase client so a missing value would cause cryptic errors.
requireEnv('NEXT_PUBLIC_SUPABASE_URL')
requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')

// For Route Handlers and Server Actions — can read and write cookies
export async function createSupabaseServerClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}

// For Server Components — read-only (setAll is a no-op)
export async function createSupabaseServerComponentClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  )
}

/**
 * Returns the authenticated Supabase User, or null if not logged in.
 *
 * Uses getUser() instead of getSession() so the token is validated against
 * Supabase's servers on every call — revoked sessions fail immediately rather
 * than waiting for the JWT to expire (~1 hour).
 */
export async function getAuthUser() {
  const supabase = await createSupabaseServerComponentClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null
  return user
}
