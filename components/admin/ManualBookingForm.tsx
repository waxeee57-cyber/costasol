'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format, addDays, differenceInCalendarDays, parseISO } from 'date-fns'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatPriceDecimals } from '@/lib/formatters'
import { AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

const PICKUP_LOCATIONS = [
  'Alicante', 'Almeria', 'Marbella', 'Puerto Banús', 'Málaga Airport', 'Estepona',
  'San Juan de los Terreros',
]
const PICKUP_TIMES = Array.from({ length: 29 }, (_, i) => {
  const hour = Math.floor(i / 2) + 8
  const min = (i % 2) * 30
  return `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`
})

interface Car {
  id: string
  slug: string
  brand: string
  model: string
  year: number
  daily_price_eur: number
  deposit_eur: number
}

export function ManualBookingForm({ cars }: { cars: Car[] }) {
  const router = useRouter()
  const [carId, setCarId] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [pickupLocation, setPickupLocation] = useState('Marbella')
  const [pickupTime, setPickupTime] = useState('14:00')
  const [initialStatus, setInitialStatus] = useState<'inquiry' | 'confirmed'>('inquiry')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [country, setCountry] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [conflictCode, setConflictCode] = useState('')

  const today = format(new Date(), 'yyyy-MM-dd')
  const minEnd = startDate ? format(addDays(parseISO(startDate), 1), 'yyyy-MM-dd') : today
  const maxEnd = startDate ? format(addDays(parseISO(startDate), 14), 'yyyy-MM-dd') : ''

  const selectedCar = cars.find((c) => c.id === carId)
  const days = startDate && endDate
    ? Math.max(0, differenceInCalendarDays(parseISO(endDate), parseISO(startDate)))
    : 0
  const total = selectedCar ? selectedCar.daily_price_eur * days : 0

  const handleStartChange = (val: string) => {
    setStartDate(val)
    if (endDate && val) {
      const diff = differenceInCalendarDays(parseISO(endDate), parseISO(val))
      if (diff <= 0 || diff > 14) setEndDate('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!carId || !startDate || !endDate) return
    setLoading(true)
    setError('')
    setConflictCode('')

    try {
      const res = await fetch('/api/admin/bookings/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          car_id: carId,
          start_date: startDate,
          end_date: endDate,
          pickup_location: pickupLocation,
          pickup_time: pickupTime,
          full_name: fullName,
          email,
          phone,
          country,
          initial_status: initialStatus,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (res.status === 409) setConflictCode(data.conflicting_booking_code ?? '')
        setError(data.error ?? 'Failed to create booking.')
        setLoading(false)
        return
      }
      router.push('/admin/bookings')
    } catch {
      setError('Connection error.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border border-border bg-graphite p-6">
      {/* Car */}
      <div className="space-y-1.5">
        <Label>Car</Label>
        <Select value={carId} onValueChange={setCarId}>
          <SelectTrigger><SelectValue placeholder="Select car" /></SelectTrigger>
          <SelectContent>
            {cars.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.brand} {c.model} {c.year} — {formatPriceDecimals(c.daily_price_eur)}/day
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Dates — native inputs for mobile reliability */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="start-date">Start date</Label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            min={today}
            onChange={(e) => handleStartChange(e.target.value)}
            style={{ colorScheme: 'dark' }}
            className="w-full h-12 rounded-md border border-border bg-black px-4 text-white font-sans text-sm focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="end-date">End date</Label>
          <input
            id="end-date"
            type="date"
            value={endDate}
            min={minEnd}
            max={maxEnd || undefined}
            disabled={!startDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ colorScheme: 'dark' }}
            className={cn(
              'w-full h-12 rounded-md border border-border bg-black px-4 text-white font-sans text-sm focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold',
              !startDate && 'opacity-40 cursor-not-allowed'
            )}
          />
        </div>
      </div>

      {/* Pickup details */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Pickup location</Label>
          <Select value={pickupLocation} onValueChange={setPickupLocation}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {PICKUP_LOCATIONS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Pickup time</Label>
          <Select value={pickupTime} onValueChange={setPickupTime}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {PICKUP_TIMES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Customer */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Full name</Label>
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" required />
        </div>
        <div className="space-y-1.5">
          <Label>Email</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" required />
        </div>
        <div className="space-y-1.5">
          <Label>Phone</Label>
          <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+44 7700 000000" />
        </div>
        <div className="space-y-1.5">
          <Label>Country</Label>
          <Input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="United Kingdom" />
        </div>
      </div>

      {/* Initial status */}
      <div className="space-y-1.5">
        <Label>Initial status</Label>
        <Select value={initialStatus} onValueChange={(v) => setInitialStatus(v as 'inquiry' | 'confirmed')}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="inquiry">Inquiry (default — confirm later)</SelectItem>
            <SelectItem value="confirmed">Confirmed — skip inquiry phase</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Estimated total */}
      {days > 0 && selectedCar && (
        <div className="rounded-sm border border-border bg-black/40 px-4 py-3 flex justify-between text-sm font-sans">
          <span className="text-muted">{days} days × {formatPriceDecimals(selectedCar.daily_price_eur)}</span>
          <span className="font-medium text-gold tabular-nums">{formatPriceDecimals(total)}</span>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 rounded-sm border border-danger/30 bg-danger/10 px-3 py-2">
          <AlertTriangle className="h-4 w-4 text-danger shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-sans text-danger">{error}</p>
            {conflictCode && (
              <p className="text-xs font-sans text-muted mt-0.5">
                Conflicting booking: <span className="text-white font-medium">{conflictCode}</span>
              </p>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          type="submit"
          className="flex-1"
          disabled={loading || !carId || days === 0 || !fullName || !email || !startDate || !endDate}
        >
          {loading ? 'Creating...' : 'Create Booking'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
