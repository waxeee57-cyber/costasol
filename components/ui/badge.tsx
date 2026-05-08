import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-md px-2.5 py-1 text-xs font-sans font-medium uppercase tracking-[0.1em]',
  {
    variants: {
      variant: {
        gold:    'bg-gold/15 text-gold border border-gold/30',
        warning: 'bg-warning/15 text-warning border border-warning/30',
        success: 'bg-success/15 text-success border border-success/30',
        danger:  'bg-danger/15 text-danger border border-danger/30',
        muted:   'bg-white/5 text-muted border border-white/10',
        outline: 'border border-muted text-muted',
      },
    },
    defaultVariants: {
      variant: 'muted',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
