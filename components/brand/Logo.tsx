import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Logo({ className, size = 'md' }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn('flex flex-col gap-0.5 leading-none tracking-widest', className)}
      aria-label="CostaSol Car Rent — Home"
    >
      <span
        className={cn(
          'font-display font-light text-white tracking-[0.15em] uppercase',
          size === 'sm' && 'text-lg',
          size === 'md' && 'text-xl',
          size === 'lg' && 'text-2xl',
        )}
      >
        CostaSol
      </span>
      <span
        className={cn(
          'font-sans font-medium uppercase tracking-[0.3em] text-gold',
          size === 'sm' && 'text-[9px]',
          size === 'md' && 'text-[10px]',
          size === 'lg' && 'text-xs',
        )}
      >
        Car Rent
      </span>
    </Link>
  )
}
