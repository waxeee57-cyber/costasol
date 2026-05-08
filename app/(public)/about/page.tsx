export const metadata = { title: 'About' }

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black py-24">
      <div className="mx-auto max-w-3xl px-6">
        <p className="font-sans text-xs uppercase tracking-[0.2em] text-gold mb-4">About</p>
        <h1 className="font-display text-5xl font-light text-white tracking-tight mb-10">
          A different kind of rental
        </h1>
        <div className="space-y-6 font-sans text-base leading-relaxed text-muted max-w-2xl">
          <p className="italic text-xs border border-warning/20 rounded-sm bg-warning/5 px-3 py-2 text-warning">
            PLACEHOLDER: About copy to be written by owner — see PLACEHOLDERS.md
          </p>
          <p>
            CostaSol Car Rent was built for guests who expect more than a key and a fuel gauge.
            Every reservation is personally confirmed. Every car is delivered to your hotel.
            Every question gets a human answer.
          </p>
          <p>
            Based in Marbella. Serving the full Costa del Sol.
          </p>
        </div>
      </div>
    </div>
  )
}
