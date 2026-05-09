import { Shield, UserCheck, Hotel, BadgeCheck } from 'lucide-react'

const items = [
  { icon: Shield, label: 'Fully Insured', desc: 'Comprehensive coverage included on every rental.' },
  { icon: UserCheck, label: 'Concierge Service', desc: 'Personal confirmation, every time' },
  { icon: Hotel, label: 'Hotel Delivery', desc: 'Delivered to your door' },
  { icon: BadgeCheck, label: 'No Hidden Fees', desc: 'The price you see is what you pay' },
]

export function TrustStrip() {
  return (
    <section className="border-y border-border bg-graphite">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          {items.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex flex-col gap-3 text-center md:text-left">
              <Icon className="mx-auto h-5 w-5 text-gold md:mx-0" />
              <div>
                <p className="font-sans text-xs uppercase tracking-[0.15em] text-gold">{label}</p>
                <p className="mt-1 font-sans text-sm text-muted">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
