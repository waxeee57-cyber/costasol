import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex w-full rounded-md border border-border bg-black px-4 py-3 text-sm text-white placeholder:text-muted',
          'focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'font-sans resize-none min-h-[100px]',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
