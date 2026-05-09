import { Shield, UserCheck, Hotel, BadgeCheck } from 'lucide-react'

const items = [
  { icon: Shield,     label: 'Fully Insured',     desc: 'Comprehensive coverage on every rental.' },
  { icon: UserCheck,  label: 'Concierge Service',  desc: 'Personal confirmation, every time.' },
  { icon: Hotel,      label: 'Hotel Delivery',     desc: 'Delivered to your door.' },
  { icon: BadgeCheck, label: 'No Hidden Fees',     desc: 'The price you see is what you pay.' },
]

export function TrustStrip() {
  return (
    <section className="border-y border-border bg-graphite">
      <div className="mx-auto max-w-7xl px-6 py-10 md:py-12">
        <div className="grid grid-cols-2 gap-x-8 gap-y-7 md:grid-cols-4">
          {items.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-start gap-3">
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <div>
                <p className="font-sans text-xs font-medium text-white">{label}</p>
                <p className="mt-0.5 font-sans text-xs leading-relaxed text-muted">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
