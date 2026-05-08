import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getSession } from '@/lib/supabase-server'
import { generateBookingCode } from '@/lib/booking-code'
import { formatDate, formatPriceDecimals, isFutureOrToday, TZ } from '@/lib/formatters'
import { notifyInquiry } from '@/lib/n8n'
import { z } from 'zod'
import { formatInTimeZone } from 'date-fns-tz'
import { differenceInCalendarDays, parseISO } from 'date-fns'

const schema = z.object({
  car_id:          z.string().uuid(),
  start_date:      z.string(),
  end_date:        z.string(),
  pickup_location: z.string(),
  pickup_time:     z.string(),
  full_name:       z.string().min(2),
  email:           z.string().email(),
  phone:           z.string().optional(),
  country:         z.string().optional(),
  initial_status:  z.enum(['inquiry', 'confirmed']),
})

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  const { car_id, start_date, end_date, pickup_location, pickup_time, full_name, email, phone, country, initial_status } = parsed.data

  const startDate = parseISO(start_date)
  const endDate = parseISO(end_date)

  if (!isFutureOrToday(startDate)) return NextResponse.json({ error: 'Start date must be today or future' }, { status: 400 })

  const days = differenceInCalendarDays(endDate, startDate)
  if (days <= 0 || days > 14) return NextResponse.json({ error: 'Invalid date range (1–14 days)' }, { status: 400 })

  const { data: car } = await supabaseAdmin
    .from('cars')
    .select('brand, model, year, daily_price_eur, deposit_eur')
    .eq('id', car_id)
    .single()
  if (!car) return NextResponse.json({ error: 'Car not found' }, { status: 404 })

  const pickupDateStr = formatInTimeZone(startDate, TZ, 'yyyy-MM-dd')
  const endDateStr = formatInTimeZone(endDate, TZ, 'yyyy-MM-dd')
  const startUtc = new Date(`${pickupDateStr}T${pickup_time}:00`).toISOString()
  const endUtc = new Date(`${endDateStr}T${pickup_time}:00`).toISOString()
  const total = car.daily_price_eur * days

  // Overlap check if confirming
  if (initial_status === 'confirmed') {
    const { data: conflicts } = await supabaseAdmin
      .from('bookings')
      .select('booking_code')
      .eq('car_id', car_id)
      .in('status', ['confirmed', 'picked_up', 'returned'])
      .lt('start_at', endUtc)
      .gt('end_at', startUtc)
      .limit(1)

    if (conflicts && conflicts.length > 0) {
      return NextResponse.json({
        error: `Car already booked for overlapping dates.`,
        conflicting_booking_code: conflicts[0].booking_code,
      }, { status: 409 })
    }
  }

  // Upsert customer
  const { data: customer } = await supabaseAdmin
    .from('customers')
    .upsert({ email, phone: phone ?? null, full_name, country: country ?? null }, { onConflict: 'email' })
    .select('id')
    .single()
  if (!customer) return NextResponse.json({ error: 'Customer upsert failed' }, { status: 500 })

  let booking_code = ''
  let inserted = null
  for (let attempt = 0; attempt < 3; attempt++) {
    booking_code = generateBookingCode()
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .insert({
        booking_code,
        car_id,
        customer_id: customer.id,
        pickup_location,
        dropoff_location: pickup_location,
        start_at: startUtc,
        end_at: endUtc,
        days,
        total_eur: total,
        deposit_eur: car.deposit_eur,
        status: initial_status,
        status_history: [{ status: initial_status, at: new Date().toISOString(), by: session.user.email ?? 'admin' }],
        source: 'manual',
      })
      .select('id')
      .single()
    if (!error) { inserted = data; break }
    if (error.code !== '23505') return NextResponse.json({ error: 'Insert failed' }, { status: 500 })
  }

  if (!inserted) return NextResponse.json({ error: 'Booking code collision' }, { status: 500 })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''
  const statusPageUrl = `${siteUrl}/booking/${booking_code}?email=${encodeURIComponent(email)}`

  notifyInquiry({
    event: initial_status,
    booking_code,
    customer_name: full_name,
    customer_email: email,
    customer_phone: phone ?? '',
    customer_message: '',
    car_label: `${car.brand} ${car.model} ${car.year}`,
    dates_label: `${formatDate(startDate)} → ${formatDate(endDate)}`,
    days,
    pickup_label: `${pickup_location} · ${pickup_time}`,
    estimated_total: formatPriceDecimals(total),
    deposit: formatPriceDecimals(car.deposit_eur),
    status_page_url: statusPageUrl,
  }).catch((err) => console.warn('[manual] n8n notify failed', err))

  return NextResponse.json({ booking_code })
}
