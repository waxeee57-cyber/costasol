import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

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

// For Server Components — read-only (setAll is a no-op to avoid the Next.js cookie write restriction)
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

export async function getSession() {
  const supabase = await createSupabaseServerComponentClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}
