import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getAuthUser } from '@/lib/supabase-server'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { id } = await params
  const { data: booking } = await supabaseAdmin.from('bookings').select('status, status_history').eq('id', id).single()

  if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (booking.status !== 'returned') return NextResponse.json({ error: 'Car must be returned first' }, { status: 400 })

  const now = new Date().toISOString()
  const newHistory = [...(booking.status_history ?? []), { status: 'completed', at: now, by: user.email ?? 'admin' }]

  await supabaseAdmin.from('bookings').update({ status: 'completed', status_history: newHistory, updated_at: now }).eq('id', id)
  return NextResponse.json({ ok: true })
}
