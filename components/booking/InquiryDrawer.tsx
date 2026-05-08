'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, MessageCircle } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CostBreakdown } from './CostBreakdown'
import { formatDate, formatPriceDecimals } from '@/lib/formatters'
import { buildWhatsAppLink } from '@/lib/whatsapp'
import { cn } from '@/lib/utils'

const PICKUP_TIMES = Array.from({ length: 29 }, (_, i) => {
  const hour = Math.floor(i / 2) + 8
  const min = (i % 2) * 30
  return `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`
})

const COUNTRIES = [
  'United Kingdom', 'Germany', 'Spain', 'Norway', 'Sweden', 'Denmark', 'Finland',
  'Netherlands', 'France', 'Italy', 'United Arab Emirates', 'Saudi Arabia',
  'Qatar', 'United States', 'Other',
]

const schema = z.object({
  full_name: z.string().min(2, 'Full name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(5, 'Phone number required'),
  country: z.string().min(1, 'Country required'),
  pickup_time: z.string().min(1, 'Pickup time required'),
  message: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface InquiryDrawerProps {
  open: boolean
  onClose: () => void
  car: {
    slug: string
    brand: string
    model: string
    daily_price_eur: number
    deposit_eur: number
  }
  startDate: string
  endDate: string
  days: number
  pickupLocation: string
}

export function InquiryDrawer({
  open,
  onClose,
  car,
  startDate,
  endDate,
  days,
  pickupLocation,
}: InquiryDrawerProps) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [errorCount, setErrorCount] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')

  const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const total = car.daily_price_eur * days

  const onSubmit = async (data: FormData) => {
    console.log('[InquiryDrawer] onSubmit called', data)
    setSubmitting(true)
    setErrorMsg('')

    try {
      const res = await fetch('/api/inquiries/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          car_slug: car.slug,
          start_date: startDate,
          end_date: endDate,
          pickup_location: pickupLocation,
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        setErrorCount((c) => c + 1)
        setErrorMsg(json.error ?? 'Something went wrong. Please try again.')
        setSubmitting(false)
        return
      }

      onClose()
      router.push(`/booking/${json.booking_code}?email=${encodeURIComponent(data.email)}`)
    } catch {
      setErrorCount((c) => c + 1)
      setErrorMsg('Connection error. Please try again.')
      setSubmitting(false)
    }
  }

  if (!open) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={cn(
        'fixed z-50 bg-graphite border-l border-border flex flex-col',
        'bottom-0 inset-x-0 rounded-t-lg max-h-[90vh] md:inset-x-auto md:right-0 md:top-0 md:bottom-0 md:w-[480px] md:rounded-none',
      )}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-5 shrink-0">
          <div>
            <h2 className="font-display text-xl font-medium text-white">
              Request {car.brand} {car.model}
            </h2>
            <p className="mt-0.5 font-sans text-xs text-muted">
              {formatDate(startDate)} → {formatDate(endDate)} · {pickupLocation}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center text-muted hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Cost reference */}
          <div className="space-y-2">
            <p className="text-[10px] font-sans uppercase tracking-[0.15em] text-muted">Cost reference</p>
            <div className="space-y-1.5 text-sm font-sans">
              <div className="flex justify-between">
                <span className="text-muted">Estimated total</span>
                <span className="font-medium text-gold tabular-nums">{formatPriceDecimals(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Refundable deposit at pickup</span>
                <span className="font-medium text-white tabular-nums">{formatPriceDecimals(car.deposit_eur)}</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form id="inquiry-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="full_name">Full name</Label>
              <Input
                id="full_name"
                placeholder="As on your passport"
                {...register('full_name')}
              />
              {errors.full_name && (
                <p className="text-xs font-sans text-danger">{errors.full_name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs font-sans text-danger">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone (with country code)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+44 7700 000000"
                {...register('phone')}
              />
              {errors.phone && (
                <p className="text-xs font-sans text-danger">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Country of residence</Label>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <Select value={field.value ?? ''} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.country && (
                <p className="text-xs font-sans text-danger">{errors.country.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Preferred pickup time (Marbella / Madrid time)</Label>
              <Controller
                name="pickup_time"
                control={control}
                render={({ field }) => (
                  <Select value={field.value ?? ''} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {PICKUP_TIMES.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.pickup_time && (
                <p className="text-xs font-sans text-danger">{errors.pickup_time.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="message">Anything we should know? (optional)</Label>
              <Textarea
                id="message"
                placeholder="Special requests, questions, preferred contact method..."
                {...register('message')}
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-border px-6 py-4 shrink-0 space-y-3">
          {errorMsg && (
            <p className="text-xs font-sans text-danger">{errorMsg}</p>
          )}

          {errorCount >= 2 && (
            <a
              href={buildWhatsAppLink(`Hi, I'd like to request the ${car.brand} ${car.model} from ${formatDate(startDate)} to ${formatDate(endDate)}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-sans text-whatsapp"
            >
              <MessageCircle className="h-4 w-4" />
              Having trouble? Message us on WhatsApp
            </a>
          )}

          <Button
            type="submit"
            form="inquiry-form"
            className="w-full"
            disabled={submitting}
          >
            {submitting ? 'Sending...' : 'Send Request'}
          </Button>

          <p className="text-center text-[11px] font-sans text-muted">
            We confirm reservations personally. Payment in person at pickup.
          </p>
        </div>
      </div>
    </>
  )
}
