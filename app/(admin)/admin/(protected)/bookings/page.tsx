export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase'
import { BookingsList } from '@/components/admin/BookingsList'
import { Plus } from 'lucide-react'
import { formatInTimeZone } from 'date-fns-tz'
import { TZ } from '@/lib/formatters'

type BookingStatus = 'inquiry' | 'confirmed' | 'picked_up' | 'returned' | 'completed' | 'cancelled'

interface BookingRow {
  id: string
  booking_code: string
  status: BookingStatus
  pickup_location: string
  start_at: string
  end_at: string
  days: number
  total_eur: number
  deposit_eur: number
  customer_message: string | null
  admin_notes: string | null
  license_doc_url: string | null
  id_doc_url: string | null
  return_notes: string | null
  source: string
  created_at: string
  updated_at: string
  status_history: Array<{ status: string; at: string; by: string }>
  transfer_requested: boolean
  transfer_address: string | null
  transfer_fee_eur: number | null
  car: { brand: string; model: string; year: number; slug: string } | null
  customer: { full_name: string; email: string; phone: string | null; country: string | null } | null
}

async function getBookings(filter?: string): Promise<BookingRow[]> {
  let query = supabaseAdmin
    .from('bookings')
    .select(`
      id, booking_code, status, pickup_location, start_at, end_at, days,
      total_eur, deposit_eur, customer_message, admin_notes, license_doc_url,
      id_doc_url, return_notes, source, created_at, updated_at, status_history,
      transfer_requested, transfer_address, transfer_fee_eur,
      car:cars(brand, model, year, slug),
      customer:customers(full_name, email, phone, country)
    `)

  const todayMadrid = formatInTimeZone(new Date(), TZ, 'yyyy-MM-dd')

  switch (filter) {
    case 'inquiries':
      query = query.eq('status', 'inquiry').order('created_at', { ascending: false })
      break
    case 'upcoming':
      query = query.eq('status', 'confirmed').order('start_at', { ascending: true })
      break
    case 'today_pickups':
      query = query
        .eq('status', 'confirmed')
        .gte('start_at', `${todayMadrid}T00:00:00+00:00`)
        .lt('start_at', `${todayMadrid}T23:59:59+00:00`)
        .order('start_at', { ascending: true })
      break
    case 'today_returns':
      query = query
        .eq('status', 'picked_up')
        .gte('end_at', `${todayMadrid}T00:00:00+00:00`)
        .lt('end_at', `${todayMadrid}T23:59:59+00:00`)
        .order('end_at', { ascending: true })
      break
    case 'active':
      query = query.eq('status', 'picked_up').order('end_at', { ascending: true })
      break
    case 'awaiting':
      query = query.eq('status', 'returned').order('updated_at', { ascending: false })
      break
    case 'cancelled':
      query = query.eq('status', 'cancelled').order('updated_at', { ascending: false })
      break
    default: // 'all'
      query = query.order('created_at', { ascending: false })
  }

  const { data } = await query.limit(100)
  return (data ?? []) as unknown as BookingRow[]
}

async function getCounts() {
  const statuses: BookingStatus[] = ['inquiry', 'confirmed', 'picked_up', 'returned', 'completed', 'cancelled']
  const counts: Record<string, number> = {}

  await Promise.all(
    statuses.map(async (s) => {
      const { count } = await supabaseAdmin
        .from('bookings')
        .select('id', { count: 'exact', head: true })
        .eq('status', s)
      counts[s] = count ?? 0
    })
  )
  return counts
}

interface PageProps {
  searchParams: Promise<{ filter?: string; booking?: string }>
}

export default async function AdminBookingsPage({ searchParams }: PageProps) {
  const sp = await searchParams
  const filter = sp.filter ?? 'inquiries'
  const selectedId = sp.booking

  const [bookings, counts] = await Promise.all([getBookings(filter), getCounts()])

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      {/* Top bar */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-medium text-white">Bookings</h1>
        <Link
          href="/admin/bookings/new"
          className="flex items-center gap-1.5 rounded-md border border-gold/40 px-4 py-2 text-xs font-sans uppercase tracking-[0.15em] text-gold hover:bg-gold hover:text-black transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          New Booking
        </Link>
      </div>

      <Suspense fallback={<div className="py-12 text-center font-sans text-sm text-muted">Loading...</div>}>
        <BookingsList
          bookings={bookings}
          counts={counts}
          currentFilter={filter}
          selectedId={selectedId}
        />
      </Suspense>
    </div>
  )
}
