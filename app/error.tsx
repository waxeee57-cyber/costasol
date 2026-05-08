'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 text-center">
      <p className="font-sans text-xs uppercase tracking-[0.2em] text-gold mb-4">Error</p>
      <h1 className="font-display text-5xl font-light text-white mb-4">Something went wrong</h1>
      <p className="font-sans text-sm text-muted mb-8 max-w-sm">
        An unexpected error occurred. Please try again or contact us on WhatsApp if the issue persists.
      </p>
      <div className="flex gap-4">
        <Button onClick={reset} variant="primary">Try again</Button>
        <Button asChild variant="secondary">
          <Link href="/">Home</Link>
        </Button>
      </div>
      {error.digest && (
        <p className="mt-6 font-sans text-xs text-muted">Reference: {error.digest}</p>
      )}
    </div>
  )
}
