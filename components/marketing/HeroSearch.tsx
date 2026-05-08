'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin } from 'lucide-react'
import { type DateRange } from 'react-day-picker'
import { format } from 'date-fns'
import { DateRangePicker } from '@/components/booking/DateRangePicker'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const PICKUP_LOCATIONS = [
  'Alicante', 'Almeria', 'Marbella', 'Puerto Banús', 'Málaga Airport', 'Estepona',
  'San Juan de los Terreros',
]

interface HeroSearchProps {
  initialStart?: string
  initialEnd?: string
  initialPickup?: string
}

export function HeroSearch({ initialStart, initialEnd, initialPickup }: HeroSearchProps) {
  const router = useRouter()

  const [range, setRange] = useState<DateRange | undefined>(
    initialStart && initialEnd
      ? { from: new Date(initialStart), to: new Date(initialEnd) }
      : undefined
  )
  const [pickup, setPickup] = useState(initialPickup ?? '')

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (range?.from) params.set('start', format(range.from, 'yyyy-MM-dd'))
    if (range?.to) params.set('end', format(range.to, 'yyyy-MM-dd'))
    if (pickup) params.set('pickup', pickup)
    router.push(`/fleet?${params.toString()}`)
  }

  return (
    <div className="w-full max-w-3xl">
      <div className="flex flex-col gap-3 rounded-lg border border-border bg-black/60 p-4 backdrop-blur-sm md:flex-row md:items-end md:gap-3">
        {/* Date range */}
        <div className="flex-1 flex flex-col gap-1.5">
          <label className="text-[10px] font-sans uppercase tracking-[0.15em] text-muted">Dates</label>
          <DateRangePicker
            value={range}
            onChange={setRange}
            placeholder="Pick-up → Return"
            maxDays={14}
          />
        </div>

        {/* Location */}
        <div className="flex-1 flex flex-col gap-1.5">
          <label className="text-[10px] font-sans uppercase tracking-[0.15em] text-muted">Pickup location</label>
          <Select value={pickup} onValueChange={setPickup}>
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
        </div>

        {/* CTA */}
        <Button
          onClick={handleSearch}
          className="w-full md:w-auto shrink-0 whitespace-nowrap"
        >
          View Available Cars
        </Button>
      </div>
    </div>
  )
}
