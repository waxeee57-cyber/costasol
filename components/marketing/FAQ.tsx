'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const faqs = [
  {
    q: 'How does the booking process work?',
    a: 'Submit a request through the site or WhatsApp with your preferred dates and car. We confirm personally within the hour — you will receive an email and a WhatsApp message with full details. Payment and paperwork happen at pickup.',
  },
  {
    q: 'When and how do I pay?',
    a: 'Payment is made in person at pickup. We accept credit card (Stripe Terminal) and bank transfer. There is no online payment on this site — luxury rental is a relationship business, not a checkout.',
  },
  {
    q: 'Is a deposit required?',
    a: 'Yes. A refundable security deposit is held at pickup. It is returned the same day the vehicle comes back in good condition. The exact amount depends on the car and is shown on the listing.',
  },
  {
    q: 'What is included in the daily rate?',
    a: 'Each car includes a daily mileage allowance (listed on the car page), fully comprehensive insurance, and concierge delivery within 25 km of Marbella. Additional mileage is charged at the rate shown on the listing.',
  },
  {
    q: 'What are the age and license requirements?',
    a: 'Minimum driver age is 25. A full driving license held for at least 2 years is required. Both license and passport must be presented at pickup for document verification.',
  },
  {
    q: 'What is the cancellation policy?',
    a: 'Cancellation terms are agreed personally at confirmation. We handle each situation on its merits. For full details, see our cancellation policy page.',
  },
]

export function FAQ() {
  return (
    <section className="py-24 md:py-32 bg-black">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="font-display text-4xl font-light text-white mb-12 tracking-tight">
          Common questions
        </h2>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger>{faq.q}</AccordionTrigger>
              <AccordionContent>{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
