export const dynamic = 'force-dynamic'

import Image from 'next/image'
import { supabaseAdmin } from '@/lib/supabase'
import { HeroSearch } from '@/components/marketing/HeroSearch'
import { CarCard } from '@/components/marketing/CarCard'
import { TrustStrip } from '@/components/marketing/TrustStrip'
import { FAQ } from '@/components/marketing/FAQ'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

async function getAvailableCars() {
  const { data } = await supabaseAdmin
    .from('cars')
    .select('slug, brand, model, year, category, daily_price_eur, transmission, fuel, seats, photos')
    .eq('status', 'available')
    .limit(2)

  return data ?? []
}

async function getAvailableCarCount() {
  const { count } = await supabaseAdmin
    .from('cars')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'available')
  return count ?? 0
}

export default async function HomePage() {
  const [cars, count] = await Promise.all([getAvailableCars(), getAvailableCarCount()])

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=2400&q=80"
            alt="Dramatic cinematic luxury car shot"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/55" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
          {/* Live fleet badge */}
          <div className="flex items-center gap-2.5 rounded-full border border-border bg-black/60 px-4 py-2 backdrop-blur-sm">
            <span className="animate-pulse-dot h-2 w-2 rounded-full bg-gold" />
            <span className="font-sans text-xs uppercase tracking-[0.2em] text-muted">
              Real-time fleet availability
            </span>
          </div>

          {/* Tagline */}
          <h1 className="font-display text-5xl font-light leading-tight tracking-[-0.02em] text-white md:text-7xl lg:text-8xl">
            The Coast,<br />Driven Beautifully
          </h1>

          <p className="max-w-md font-sans text-base leading-relaxed text-muted">
            Luxury car rental along the Costa del Sol. Every reservation
            personally confirmed. Every car delivered to your door.
          </p>

          {/* HeroSearch */}
          <div className="w-full max-w-3xl">
            <HeroSearch />
          </div>

          {/* Stats strip */}
          <div className="flex items-center gap-6 border-t border-border pt-6 text-center md:gap-12">
            <div>
              <p className="font-sans text-2xl font-medium text-gold">{count}</p>
              <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted mt-0.5">Vehicles</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <p className="font-sans text-sm uppercase tracking-[0.15em] text-muted">Concierge Service</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <p className="font-sans text-sm uppercase tracking-[0.15em] text-muted">Hotel Delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <TrustStrip />

      {/* Featured fleet */}
      <section className="py-24 md:py-32 bg-black">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="font-sans text-xs uppercase tracking-[0.2em] text-gold mb-3">The Fleet</p>
              <h2 className="font-display text-4xl font-light text-white tracking-tight md:text-5xl">
                Selected cars
              </h2>
            </div>
            <Link
              href="/fleet"
              className="hidden items-center gap-2 font-sans text-xs uppercase tracking-[0.15em] text-muted hover:text-white transition-colors md:flex"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {cars.map((car) => (
              <CarCard key={car.slug} car={car} />
            ))}
          </div>

          <div className="mt-8 flex md:hidden">
            <Link
              href="/fleet"
              className="font-sans text-xs uppercase tracking-[0.15em] text-muted hover:text-white transition-colors"
            >
              View all cars →
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 md:py-32 bg-graphite">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12">
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-gold mb-3">The Process</p>
            <h2 className="font-display text-4xl font-light text-white tracking-tight md:text-5xl">
              How it works
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {[
              { step: '01', title: 'Browse', desc: 'Explore the fleet. Select dates and location. No account needed.' },
              { step: '02', title: 'Request', desc: 'Submit your inquiry through the site or WhatsApp. Takes 60 seconds.' },
              { step: '03', title: 'Personal confirmation', desc: 'We confirm personally, usually within the hour during business hours. You will always hear from us before your pickup.' },
              { step: '04', title: 'Drive', desc: 'We deliver the car to your hotel. Payment and paperwork at pickup.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex flex-col gap-4">
                <span className="font-sans text-sm font-medium text-gold">{step}</span>
                <h3 className="font-display text-2xl font-medium text-white">{title}</h3>
                <p className="font-sans text-sm leading-relaxed text-muted">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ />
    </>
  )
}
