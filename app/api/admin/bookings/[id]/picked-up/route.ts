import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getSession } from '@/lib/supabase-server'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { id } = await params
  const { data: booking } = await supabaseAdmin.from('bookings').select('status, status_history').eq('id', id).single()

  if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (booking.status !== 'confirmed') return NextResponse.json({ error: 'Booking must be confirmed first' }, { status: 400 })

  const now = new Date().toISOString()
  const newHistory = [...(booking.status_history ?? []), { status: 'picked_up', at: now, by: session.user.email ?? 'admin' }]

  await supabaseAdmin.from('bookings').update({ status: 'picked_up', status_history: newHistory, updated_at: now }).eq('id', id)
  return NextResponse.json({ ok: true })
}
