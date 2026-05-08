import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { code, email } = body

  if (!code || !email) {
    return NextResponse.json({ error: 'Code and email required.' }, { status: 400 })
  }

  const { data: booking } = await supabaseAdmin
    .from('bookings')
    .select(`
      id, booking_code, status, status_history,
      pickup_location, dropoff_location,
      start_at, end_at, days, total_eur, deposit_eur,
      customer_message, created_at, updated_at,
      transfer_requested, transfer_address, transfer_fee_eur,
      car_id,
      customer_id
    `)
    .eq('booking_code', code.toUpperCase())
    .single()

  if (!booking) {
    return NextResponse.json({ error: 'Booking not found.' }, { status: 404 })
  }

  // Verify email matches customer
  const { data: customer } = await supabaseAdmin
    .from('customers')
    .select('email, full_name, phone, country')
    .eq('id', booking.customer_id)
    .single()

  if (!customer || customer.email.toLowerCase() !== email.toLowerCase()) {
    return NextResponse.json({ error: 'Email does not match this booking.' }, { status: 403 })
  }

  // Get car info
  const { data: car } = await supabaseAdmin
    .from('cars')
    .select('brand, model, year, slug, photos')
    .eq('id', booking.car_id)
    .single()

  // Return sanitized record (no admin_notes, no internal UUIDs exposed unnecessarily)
  return NextResponse.json({
    booking_code: booking.booking_code,
    status: booking.status,
    pickup_location: booking.pickup_location,
    dropoff_location: booking.dropoff_location,
    start_at: booking.start_at,
    end_at: booking.end_at,
    days: booking.days,
    total_eur: booking.total_eur,
    deposit_eur: booking.deposit_eur,
    customer_message: booking.customer_message,
    created_at: booking.created_at,
    transfer_requested: booking.transfer_requested,
    transfer_address: booking.transfer_address,
    transfer_fee_eur: booking.transfer_fee_eur,
    customer: {
      full_name: customer.full_name,
    },
    car: car
      ? { brand: car.brand, model: car.model, year: car.year, slug: car.slug, photos: car.photos }
      : null,
  })
}
