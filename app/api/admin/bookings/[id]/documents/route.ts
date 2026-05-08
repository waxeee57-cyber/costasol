import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getSession } from '@/lib/supabase-server'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { id } = await params
  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const type = formData.get('type') as 'license' | 'id' | null

  if (!file || !type) return NextResponse.json({ error: 'file and type required' }, { status: 400 })

  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `bookings/${id}/${type}-${Date.now()}.${ext}`

  const buffer = Buffer.from(await file.arrayBuffer())

  const { error: uploadError } = await supabaseAdmin.storage
    .from('documents')
    .upload(path, buffer, { contentType: file.type, upsert: true })

  if (uploadError) {
    console.error('[documents] upload failed', uploadError)
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 })
  }

  // Generate a 1-hour signed URL
  const { data: signedData } = await supabaseAdmin.storage
    .from('documents')
    .createSignedUrl(path, 3600)

  const field = type === 'license' ? 'license_doc_url' : 'id_doc_url'
  await supabaseAdmin
    .from('bookings')
    .update({ [field]: path, updated_at: new Date().toISOString() })
    .eq('id', id)

  return NextResponse.json({ ok: true, url: signedData?.signedUrl ?? '' })
}
