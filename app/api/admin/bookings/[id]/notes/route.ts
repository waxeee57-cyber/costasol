import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getAuthUser } from '@/lib/supabase-server'
import { z } from 'zod'

const schema = z.object({
  field: z.enum(['admin_notes', 'return_notes']),
  value: z.string().max(10_000),
})

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid' }, { status: 400 })

  const { field, value } = parsed.data
  await supabaseAdmin
    .from('bookings')
    .update({ [field]: value, updated_at: new Date().toISOString() })
    .eq('id', id)

  return NextResponse.json({ ok: true })
}
