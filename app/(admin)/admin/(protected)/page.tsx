export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase'
import { formatPrice } from '@/lib/formatters'
import { formatInTimeZone } from 'date-fns-tz'
import { TZ } from '@/lib/formatters'

async function getDashboardStats() {
  const todayMadrid = formatInTimeZone(new Date(), TZ, 'yyyy-MM-dd')
  const monthStart = formatInTimeZone(new Date(), TZ, 'yyyy-MM-01')

  const [inquiries, active, upcoming, revenue] = await Promise.all([
    supabaseAdmin.from('bookings').select('id', { count: 'exact', head: true }).eq('status', 'inquiry'),
    supabaseAdmin.from('bookings').select('id', { count: 'exact', head: true }).eq('status', 'picked_up'),
    supabaseAdmin.from('bookings').select('id', { count: 'exact', head: true })
      .eq('status', 'confirmed')
      .gte('start_at', `${todayMadrid}T00:00:00+00:00`),
    supabaseAdmin.from('bookings').select('total_eur')
      .in('status', ['confirmed', 'picked_up', 'returned', 'completed'])
      .gte('created_at', `${monthStart}T00:00:00+00:00`),
  ])

  const monthlyRevenue = (revenue.data ?? []).reduce(
    (sum: number, b: { total_eur: number }) => sum + (b.total_eur ?? 0),
    0
  )

  return {
    inquiries: inquiries.count ?? 0,
    active: active.count ?? 0,
    upcoming: upcoming.count ?? 0,
    monthlyRevenue,
  }
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats()

  const cards = [
    {
      label: 'Open inquiries',
      value: String(stats.inquiries),
      href: '/admin/bookings?filter=inquiries',
      highlight: stats.inquiries > 0,
    },
    {
      label: 'Active rentals',
      value: String(stats.active),
      href: '/admin/bookings?filter=active',
      highlight: false,
    },
    {
      label: 'Upcoming pickups',
      value: String(stats.upcoming),
      href: '/admin/bookings?filter=upcoming',
      highlight: false,
    },
    {
      label: 'Revenue this month',
      value: formatPrice(stats.monthlyRevenue),
      href: '/admin/bookings?filter=all',
      highlight: false,
    },
  ]

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="font-display text-2xl font-medium text-white mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map(({ label, value, href, highlight }) => (
          <Link
            key={label}
            href={href}
            className="rounded-md border border-border bg-graphite p-4 hover:border-gold/30 transition-colors"
          >
            <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-muted mb-2">{label}</p>
            <p className={`font-display text-3xl font-light ${highlight ? 'text-gold' : 'text-white'}`}>
              {value}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-2 sm:flex-row">
        <Link
          href="/admin/bookings"
          className="flex items-center justify-center rounded-md border border-gold/40 px-4 py-2.5 text-xs font-sans uppercase tracking-[0.15em] text-gold hover:bg-gold hover:text-black transition-colors"
        >
          View all bookings
        </Link>
        <Link
          href="/admin/cars"
          className="flex items-center justify-center rounded-md border border-border px-4 py-2.5 text-xs font-sans uppercase tracking-[0.15em] text-muted hover:border-gold/30 hover:text-white transition-colors"
        >
          Manage fleet
        </Link>
      </div>
    </div>
  )
}
