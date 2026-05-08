'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-sans text-sm font-medium uppercase tracking-widest transition-colors duration-200 disabled:pointer-events-none disabled:opacity-40 cursor-pointer min-h-[48px]',
  {
    variants: {
      variant: {
        primary:
          'bg-gold text-black hover:bg-gold-hover rounded-md px-8 py-4',
        secondary:
          'border border-gold text-gold bg-transparent hover:bg-gold hover:text-black rounded-md px-8 py-4',
        whatsapp:
          'bg-whatsapp text-white hover:opacity-90 rounded-md px-8 py-4',
        ghost:
          'text-gold hover:text-gold-hover bg-transparent',
        danger:
          'border border-danger text-danger bg-transparent hover:bg-danger hover:text-white rounded-md px-6 py-3',
        link:
          'text-gold underline-offset-8 hover:underline bg-transparent p-0 min-h-0 uppercase-none normal-case tracking-normal',
      },
      size: {
        default: '',
        sm: 'text-xs min-h-[40px] px-5 py-2',
        lg: 'text-base min-h-[56px] px-10 py-4',
        icon: 'min-h-[48px] min-w-[48px] p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
