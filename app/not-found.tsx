import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 text-center">
      <p className="font-sans text-xs uppercase tracking-[0.2em] text-gold mb-4">404</p>
      <h1 className="font-display text-5xl font-light text-white mb-4">Page not found</h1>
      <p className="font-sans text-sm text-muted mb-8 max-w-sm">
        This page does not exist. If you were looking for a booking, use the lookup form below.
      </p>
      <div className="flex gap-4">
        <Button asChild variant="primary">
          <Link href="/">Home</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/contact">Contact</Link>
        </Button>
      </div>
    </div>
  )
}
