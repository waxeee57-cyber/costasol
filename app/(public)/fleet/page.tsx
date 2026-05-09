export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Our Fleet',
  description:
    'Browse our luxury fleet. Lamborghini, Range Rover and more. Available in Marbella and along the Costa del Sol.',
}
import { supabaseAdmin } from '@/lib/supabase'
import { FleetGrid } from '@/components/marketing/FleetGrid'
import { FleetFilters } from '@/components/marketing/FleetFilters'

interface PageProps {
  searchParams: Promise<{ start?: string; end?: string; pickup?: string; category?: string }>
}

async function getAvailableCars(startDate?: string, endDate?: string, category?: string) {
  let query = supabaseAdmin
    .from('cars')
    .select('slug, brand, model, year, category, daily_price_eur, deposit_eur, transmission, fuel, seats, photos')
    .eq('status', 'available')
    .order('daily_price_eur', { ascending: false })

  if (category) {
    query = query.eq('category', category)
  }

  const { data: allCars } = await query
  if (!allCars) return []

  // Filter out cars with confirmed/picked_up/returned overlap
  if (startDate && endDate) {
    const startUtc = new Date(startDate).toISOString()
    const endUtc = new Date(endDate).toISOString()

    const { data: blockedRows } = await supabaseAdmin
      .from('bookings')
      .select('car_id')
      .in('status', ['confirmed', 'picked_up', 'returned'])
      .lt('start_at', endUtc)
      .gt('end_at', startUtc)

    const blockedIds = new Set((blockedRows ?? []).map((b: { car_id: string }) => b.car_id))

    return allCars.filter((car: { slug: string; brand: string; model: string; year: number; category: string; daily_price_eur: number; deposit_eur: number; transmission: string; fuel: string; seats: number; photos: Array<{url: string; alt: string}> } & { id?: string }) => !blockedIds.has(car.id ?? ''))
  }

  return allCars
}

export default async function FleetPage({ searchParams }: PageProps) {
  const params = await searchParams
  const { start, end, pickup, category } = params

  const cars = await getAvailableCars(start, end, category)

  return (
    <div className="min-h-screen bg-black">
      {/* Page header */}
      <div className="border-b border-border bg-black pt-8 pb-6">
        <div className="mx-auto max-w-7xl px-6">
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-gold mb-2">Our Fleet</p>
          <h1 className="font-display text-4xl font-light text-white tracking-tight md:text-5xl">
            Available cars
          </h1>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-border bg-black sticky top-16 z-30">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <Suspense>
            <FleetFilters
              initialStart={start}
              initialEnd={end}
              initialPickup={pickup}
              initialCategory={category}
            />
          </Suspense>
        </div>
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        {start && end && (
          <p className="mb-6 font-sans text-sm text-muted">
            {cars.length === 0
              ? 'No cars available for these dates.'
              : `${cars.length} car${cars.length !== 1 ? 's' : ''} available`}
          </p>
        )}
        <FleetGrid
          cars={cars}
          startDate={start}
          endDate={end}
          pickupLocation={pickup}
          emptyMessage="No cars available for these dates. Try adjusting your dates or message us on WhatsApp."
        />
      </div>
    </div>
  )
}
