import { NextRequest, NextResponse } from 'next/server'

const MAINTENANCE_EXCLUDED = [
  '/admin',
  '/api/admin',
  '/api/health',
  '/_next',
  '/favicon.ico',
]

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (process.env.MAINTENANCE_MODE === 'true') {
    const isExcluded = MAINTENANCE_EXCLUDED.some((p) => pathname.startsWith(p))
    if (!isExcluded) {
      return NextResponse.rewrite(new URL('/maintenance', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
