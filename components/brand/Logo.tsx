import Image from 'next/image'
import Link from 'next/link'
import logoSrc from '@/public/brand/costasol_logo_transparent.png'

interface LogoProps {
  height?: number
  className?: string
}

export function Logo({ height = 40, className }: LogoProps) {
  return (
    <Link href="/" aria-label="CostaSol Car Rent — Home" className={className}>
      <Image
        src={logoSrc}
        alt="CostaSol Car Rent"
        height={height}
        style={{ width: 'auto' }}
        priority
      />
    </Link>
  )
}
