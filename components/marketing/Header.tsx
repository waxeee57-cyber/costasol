'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/fleet', label: 'Fleet' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Logo height={56} />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'font-sans text-xs uppercase tracking-[0.15em] transition-colors duration-200',
                pathname.startsWith(l.href) ? 'text-gold' : 'text-muted hover:text-white'
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          className="flex h-10 w-10 items-center justify-center text-muted md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'border-t border-border bg-black transition-all duration-200 md:hidden',
          open ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        )}
      >
        <nav className="flex flex-col px-6 py-4 gap-4">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={cn(
                'font-sans text-sm uppercase tracking-[0.15em] py-1 transition-colors duration-200',
                pathname.startsWith(l.href) ? 'text-gold' : 'text-muted hover:text-white'
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
