import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getSession } from '@/lib/supabase-server'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { data, error } = await supabaseAdmin
    .from('cars')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const body = await req.json()
  const { brand, model, year, category, daily_price_eur, deposit_eur, transmission, fuel, seats, license_plate, description } = body

  if (!brand || !model || !year || !category || !daily_price_eur || !deposit_eur) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  if (Number(daily_price_eur) <= 0 || Number(deposit_eur) <= 0) {
    return NextResponse.json({ error: 'Prices must be greater than 0' }, { status: 400 })
  }

  // Generate slug with collision check
  const base = `${brand}-${model}-${year}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  let slug = base
  let attempt = 0
  while (true) {
    const { data: existing } = await supabaseAdmin
      .from('cars')
      .select('id')
      .eq('slug', slug)
      .maybeSingle()

    if (!existing) break
    attempt++
    slug = `${base}-${attempt + 1}`
    if (attempt > 10) return NextResponse.json({ error: 'Slug collision' }, { status: 500 })
  }

  const { data, error } = await supabaseAdmin
    .from('cars')
    .insert({
      brand: String(brand).trim(),
      model: String(model).trim(),
      year: Number(year),
      category,
      daily_price_eur: Number(daily_price_eur),
      deposit_eur: Number(deposit_eur),
      transmission: transmission ?? 'Automatic',
      fuel: fuel ?? 'Petrol',
      seats: Number(seats ?? 2),
      license_plate: license_plate?.trim() ?? null,
      description: description?.trim() || null,
      slug,
      status: 'hidden',
      photos: [],
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
