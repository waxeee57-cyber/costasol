import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { generateBookingCode } from '@/lib/booking-code'
import { formatDate, formatTime, formatPriceDecimals, isFutureOrToday, TZ } from '@/lib/formatters'
import { notifyInquiry } from '@/lib/n8n'
import { formatInTimeZone } from 'date-fns-tz'
import { differenceInCalendarDays, parseISO } from 'date-fns'
import { z } from 'zod'

const schema = z.object({
  car_slug:           z.string(),
  start_date:         z.string(),
  end_date:           z.string(),
  pickup_location:    z.string(),
  full_name:          z.string().min(2),
  email:              z.string().email(),
  phone:              z.string().min(5),
  country:            z.string().min(1),
  pickup_time:        z.string().min(1),
  message:            z.string().optional(),
  transfer_requested: z.boolean().default(false),
  transfer_address:   z.string().optional(),
})

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request', details: parsed.error.issues }, { status: 400 })
  }

  const { car_slug, start_date, end_date, pickup_location, full_name, email, phone, country, pickup_time, message, transfer_requested, transfer_address } = parsed.data

  // Validate dates in Madrid TZ
  const startDate = parseISO(start_date)
  const endDate = parseISO(end_date)

  if (!isFutureOrToday(startDate)) {
    return NextResponse.json({ error: 'Start date must be today or in the future.' }, { status: 400 })
  }

  const days = differenceInCalendarDays(endDate, startDate)
  if (days <= 0) {
    return NextResponse.json({ error: 'End date must be after start date.' }, { status: 400 })
  }
  if (days > 14) {
    return NextResponse.json({
      error: 'Maximum rental duration is 14 days. For longer rentals, please contact us via WhatsApp.',
    }, { status: 400 })
  }

  // Get car
  const { data: car } = await supabaseAdmin
    .from('cars')
    .select('id, brand, model, year, daily_price_eur, deposit_eur')
    .eq('slug', car_slug)
    .neq('status', 'hidden')
    .single()

  if (!car) {
    return NextResponse.json({ error: 'Car not found.' }, { status: 404 })
  }

  // Lazy cleanup of orphaned inquiry rows older than 14 days (cosmetic, fire-and-forget)
  void supabaseAdmin
    .from('bookings')
    .delete()
    .eq('status', 'inquiry')
    .lt('created_at', new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString())

  // Upsert customer
  const { data: customer, error: custErr } = await supabaseAdmin
    .from('customers')
    .upsert({ email, phone, full_name, country }, { onConflict: 'email' })
    .select('id')
    .single()

  if (custErr || !customer) {
    console.error('[inquiries/create] customer upsert failed', custErr)
    return NextResponse.json({ error: 'Could not save customer. Please try again.' }, { status: 500 })
  }

  // Build timestamps — convert pickup date + time to UTC
  const pickupDateStr = formatInTimeZone(startDate, TZ, 'yyyy-MM-dd')
  const startUtc = new Date(`${pickupDateStr}T${pickup_time}:00`).toISOString()
  // end is end of day in Madrid TZ
  const endDateStr = formatInTimeZone(endDate, TZ, 'yyyy-MM-dd')
  const endUtc = new Date(`${endDateStr}T${pickup_time}:00`).toISOString()

  const total = car.daily_price_eur * days

  // Generate booking code with retry
  let booking_code = ''
  let inserted = null
  for (let attempt = 0; attempt < 3; attempt++) {
    booking_code = generateBookingCode()
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .insert({
        booking_code,
        car_id: car.id,
        customer_id: customer.id,
        pickup_location: transfer_requested ? 'Custom — see transfer address' : pickup_location,
        dropoff_location: pickup_location,
        start_at: startUtc,
        end_at: endUtc,
        days,
        total_eur: total,
        deposit_eur: car.deposit_eur,
        customer_message: message ?? null,
        status: 'inquiry',
        status_history: [{ status: 'inquiry', at: new Date().toISOString(), by: 'system' }],
        source: 'web',
        transfer_requested,
        transfer_address: transfer_requested ? (transfer_address ?? null) : null,
      })
      .select('id')
      .single()

    if (!error) {
      inserted = data
      break
    }
    if (error.code !== '23505') { // not a unique violation
      console.error('[inquiries/create] insert failed', error)
      return NextResponse.json({ error: 'Could not create booking. Please try again.' }, { status: 500 })
    }
  }

  if (!inserted) {
    return NextResponse.json({ error: 'Could not generate booking code. Please try again.' }, { status: 500 })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''
  const statusPageUrl = `${siteUrl}/booking/${booking_code}?email=${encodeURIComponent(email)}`

  // Fire-and-forget n8n notification
  notifyInquiry({
    event: 'inquiry',
    booking_code,
    customer_name: full_name,
    customer_email: email,
    customer_phone: phone,
    customer_message: message ?? '',
    car_label: `${car.brand} ${car.model} ${car.year}`,
    dates_label: `${formatDate(startDate)} → ${formatDate(endDate)}`,
    days,
    pickup_label: transfer_requested
      ? `Custom delivery · ${pickup_time}`
      : `${pickup_location} · ${pickup_time}`,
    estimated_total: formatPriceDecimals(total),
    deposit: formatPriceDecimals(car.deposit_eur),
    status_page_url: statusPageUrl,
    transfer_requested,
    transfer_address: transfer_requested ? (transfer_address ?? undefined) : undefined,
  }).catch((err) => console.warn('[inquiries/create] n8n notify failed', err))

  return NextResponse.json({ booking_code })
}
