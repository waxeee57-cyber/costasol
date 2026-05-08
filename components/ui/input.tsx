import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex w-full rounded-md border border-border bg-black px-4 py-3 text-sm text-white placeholder:text-muted',
          'focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'min-h-[48px] font-sans',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
