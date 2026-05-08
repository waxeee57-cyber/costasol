'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, MessageCircle, MapPin } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CostBreakdown } from './CostBreakdown'
import { formatDate } from '@/lib/formatters'
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

const PICKUP_LOCATIONS = ['Marbella', 'Puerto Banús', 'Málaga Airport', 'Estepona']

const schema = z.object({
  full_name:          z.string().min(2, 'Full name required'),
  email:              z.string().email('Valid email required'),
  phone:              z.string().min(5, 'Phone number required'),
  country:            z.string().min(1, 'Country required'),
  pickup_location:    z.string().min(1, 'Pickup location required'),
  pickup_time:        z.string().min(1, 'Pickup time required'),
  message:            z.string().optional(),
  transfer_requested: z.boolean(),
  transfer_address:   z.string().optional(),
}).refine(
  (d) => !d.transfer_requested || (d.transfer_address ?? '').trim().length > 0,
  { message: 'Delivery address required', path: ['transfer_address'] }
)

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

  const defaultPickup = PICKUP_LOCATIONS.includes(pickupLocation) ? pickupLocation : PICKUP_LOCATIONS[0]

  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      pickup_location: defaultPickup,
      transfer_requested: false,
    },
  })

  const transferRequested = watch('transfer_requested')

  const onSubmit = async (data: FormData) => {
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
              {formatDate(startDate)} → {formatDate(endDate)}
              {' · '}
              {transferRequested ? 'Custom delivery' : pickupLocation}
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
            <CostBreakdown
              dailyRate={car.daily_price_eur}
              days={days}
              depositEur={car.deposit_eur}
              transferRequested={transferRequested}
            />
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

            {/* Pickup location — hidden when transfer is on */}
            {!transferRequested && (
              <div className="space-y-1.5">
                <Label>Pickup location</Label>
                <Controller
                  name="pickup_location"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value ?? ''} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <span className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gold shrink-0" />
                          <SelectValue placeholder="Select location" />
                        </span>
                      </SelectTrigger>
                      <SelectContent>
                        {PICKUP_LOCATIONS.map((loc) => (
                          <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.pickup_location && (
                  <p className="text-xs font-sans text-danger">{errors.pickup_location.message}</p>
                )}
              </div>
            )}

            {/* Transfer toggle */}
            <div className="rounded-md border border-border bg-black/30 px-4 py-3 space-y-3">
              <Controller
                name="transfer_requested"
                control={control}
                render={({ field }) => (
                  <label className="flex items-center justify-between cursor-pointer select-none gap-4">
                    <div>
                      <p className="font-sans text-sm text-white">Deliver to a custom address</p>
                      <p className="font-sans text-xs text-muted mt-0.5">
                        An additional transfer fee applies. We will confirm the amount before your
                        reservation is finalised.
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={field.value}
                      onClick={() => field.onChange(!field.value)}
                      className={cn(
                        'relative shrink-0 h-6 w-11 rounded-full transition-colors duration-200',
                        field.value ? 'bg-gold' : 'bg-border'
                      )}
                    >
                      <span
                        className={cn(
                          'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-200',
                          field.value ? 'translate-x-5' : 'translate-x-0'
                        )}
                      />
                    </button>
                  </label>
                )}
              />

              {/* Custom address input — shown when transfer is on */}
              {transferRequested && (
                <div className="space-y-1.5">
                  <Input
                    placeholder="Enter full delivery address (hotel name, villa, area...)"
                    {...register('transfer_address')}
                  />
                  {errors.transfer_address && (
                    <p className="text-xs font-sans text-danger">{errors.transfer_address.message}</p>
                  )}
                </div>
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
