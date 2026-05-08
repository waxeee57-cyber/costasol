import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getSession } from '@/lib/supabase-server'
import { notifyInquiry } from '@/lib/n8n'
import { formatDate, formatPriceDecimals } from '@/lib/formatters'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { id } = await params

  const { data: booking } = await supabaseAdmin
    .from('bookings')
    .select('*, car:cars(brand,model,year,daily_price_eur,deposit_eur), customer:customers(full_name,email,phone)')
    .eq('id', id)
    .single()

  if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  if (booking.status !== 'inquiry') return NextResponse.json({ error: 'Booking is not in inquiry status' }, { status: 400 })

  // Overlap check
  const { data: conflicts } = await supabaseAdmin
    .from('bookings')
    .select('booking_code')
    .eq('car_id', booking.car_id)
    .in('status', ['confirmed', 'picked_up', 'returned'])
    .neq('id', id)
    .lt('start_at', booking.end_at)
    .gt('end_at', booking.start_at)
    .limit(1)

  if (conflicts && conflicts.length > 0) {
    return NextResponse.json({
      error: `This car is already booked for overlapping dates (${conflicts[0].booking_code}). Resolve that booking first or change dates with the customer.`,
      conflicting_booking_code: conflicts[0].booking_code,
    }, { status: 409 })
  }

  const now = new Date().toISOString()
  const newHistory = [
    ...(booking.status_history ?? []),
    { status: 'confirmed', at: now, by: session.user.email ?? 'admin' },
  ]

  const { error } = await supabaseAdmin
    .from('bookings')
    .update({ status: 'confirmed', status_history: newHistory, updated_at: now })
    .eq('id', id)

  if (error) return NextResponse.json({ error: 'Update failed' }, { status: 500 })

  // Fire n8n confirmation notification (non-blocking)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''
  const statusPageUrl = `${siteUrl}/booking/${booking.booking_code}?email=${encodeURIComponent(booking.customer.email)}`

  notifyInquiry({
    event: 'confirmed',
    booking_code: booking.booking_code,
    customer_name: booking.customer.full_name,
    customer_email: booking.customer.email,
    customer_phone: booking.customer.phone ?? '',
    customer_message: booking.customer_message ?? '',
    car_label: `${booking.car.brand} ${booking.car.model} ${booking.car.year}`,
    dates_label: `${formatDate(booking.start_at)} → ${formatDate(booking.end_at)}`,
    days: booking.days,
    pickup_label: `${booking.pickup_location} · ${new Date(booking.start_at).toISOString().slice(11, 16)}`,
    estimated_total: formatPriceDecimals(booking.total_eur),
    deposit: formatPriceDecimals(booking.deposit_eur),
    status_page_url: statusPageUrl,
  }).catch((err) => console.warn('[confirm] n8n notify failed', err))

  return NextResponse.json({ ok: true })
}
