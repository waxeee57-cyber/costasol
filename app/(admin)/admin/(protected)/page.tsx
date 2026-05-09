export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
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

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="font-display text-2xl font-medium text-white mb-6">Dashboard</h1>

      {/* Urgent: shown only when action is needed */}
      {stats.inquiries > 0 && (
        <Link
          href="/admin/bookings?filter=inquiries"
          className="flex items-center justify-between mb-6 rounded-md border border-gold/40 bg-gold/5 px-4 py-3.5 hover:border-gold/60 transition-colors"
        >
          <p className="font-sans text-sm text-white">
            <span className="text-gold font-medium">{stats.inquiries}</span>
            {' '}{stats.inquiries === 1 ? 'inquiry' : 'inquiries'} waiting for a response
          </p>
          <ArrowRight className="h-4 w-4 text-gold shrink-0" />
        </Link>
      )}

      {/* Context stats — compact strip, no cards */}
      <div className="flex items-stretch divide-x divide-border mb-8">
        <Link href="/admin/bookings?filter=active" className="pr-6 group">
          <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted mb-1.5">Active</p>
          <p className="font-sans text-xl font-medium text-white group-hover:text-gold transition-colors">{stats.active}</p>
        </Link>
        <Link href="/admin/bookings?filter=upcoming" className="px-6 group">
          <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted mb-1.5">Upcoming</p>
          <p className="font-sans text-xl font-medium text-white group-hover:text-gold transition-colors">{stats.upcoming}</p>
        </Link>
        <div className="pl-6">
          <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted mb-1.5">This month</p>
          <p className="font-sans text-xl font-medium text-white tabular-nums">{formatPrice(stats.monthlyRevenue)}</p>
        </div>
      </div>

      {/* Quick links */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <Link
          href="/admin/bookings"
          className="flex items-center justify-center min-h-[44px] rounded-md border border-gold/40 px-4 py-2 text-xs font-sans uppercase tracking-[0.15em] text-gold hover:bg-gold hover:text-black transition-colors"
        >
          View all bookings
        </Link>
        <Link
          href="/admin/cars"
          className="flex items-center justify-center min-h-[44px] rounded-md border border-border px-4 py-2 text-xs font-sans uppercase tracking-[0.15em] text-muted hover:border-gold/30 hover:text-white transition-colors"
        >
          Manage fleet
        </Link>
      </div>
    </div>
  )
}
