'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const links = [
  { href: '/admin/bookings', label: 'Bookings' },
  { href: '/admin/cars', label: 'Cars' },
]

export function AdminNav() {
  const pathname = usePathname()
  return (
    <nav className="border-b border-border bg-graphite/50">
      <div className="mx-auto flex max-w-5xl px-4">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              'px-4 py-3 font-sans text-xs uppercase tracking-[0.15em] border-b-2 transition-colors',
              pathname.startsWith(l.href)
                ? 'border-gold text-white'
                : 'border-transparent text-muted hover:text-white'
            )}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
