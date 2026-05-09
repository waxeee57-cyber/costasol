import Link from 'next/link'
import { Logo } from '@/components/brand/Logo'

const legal = [
  { href: '/terms', label: 'Terms' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/cookies', label: 'Cookies' },
  { href: '/insurance', label: 'Insurance' },
  { href: '/cancellation', label: 'Cancellation' },
]

function isValidPhone(num: string): boolean {
  const clean = num.replace(/\D/g, '')
  return clean.length > 0 && !clean.startsWith('36')
}

export function Footer() {
  const phone = process.env.NEXT_PUBLIC_BUSINESS_PHONE ?? ''
  return (
    <footer className="border-t border-border bg-black">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-4">
            <Logo height={36} />
            <p className="max-w-xs text-xs font-sans leading-relaxed text-muted">
              Luxury car rental along the Costa del Sol.
              Personal service. No compromises.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-xs font-sans uppercase tracking-[0.15em] text-gold">Contact</p>
            <a
              href="mailto:rent@drivecostasol.com"
              className="text-sm font-sans text-muted hover:text-white transition-colors"
            >
              rent@drivecostasol.com
            </a>
            {isValidPhone(phone) && (
              <a
                href={`tel:${phone}`}
                className="text-sm font-sans text-muted hover:text-white transition-colors"
              >
                {phone}
              </a>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-xs font-sans text-muted">
            © {new Date().getFullYear()} CostaSol Car Rent. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {legal.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-xs font-sans text-muted hover:text-white transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
