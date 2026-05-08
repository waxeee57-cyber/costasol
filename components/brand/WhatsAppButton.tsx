'use client'

import { MessageCircle } from 'lucide-react'
import { buildWhatsAppLink } from '@/lib/whatsapp'

interface WhatsAppButtonProps {
  message?: string
  className?: string
}

export function WhatsAppButton({ message, className }: WhatsAppButtonProps) {
  const href = buildWhatsAppLink(message)

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact us on WhatsApp"
      className={
        className ??
        'fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg transition-opacity duration-200 hover:opacity-90 pb-[env(safe-area-inset-bottom)]'
      }
    >
      <MessageCircle className="h-6 w-6 fill-white stroke-none" />
    </a>
  )
}
