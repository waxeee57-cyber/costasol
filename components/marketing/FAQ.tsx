'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const faqs = [
  {
    q: 'How does the booking process work?',
    a: 'Submit a request through the site or WhatsApp. We confirm personally, usually within the hour during business hours. We deliver the car to your hotel — payment and documents at pickup.',
  },
  {
    q: 'When and how do I pay?',
    a: 'Payment is made in person at pickup by card or bank transfer. We do not charge your card online. A refundable deposit is also held at pickup and returned when the car comes back in good condition.',
  },
  {
    q: 'Is a deposit required?',
    a: 'Yes. A refundable security deposit is held at pickup. The amount depends on the vehicle. It is returned in full on the same day the car is returned undamaged.',
  },
  {
    q: 'What is included in the daily rate?',
    a: 'Comprehensive insurance, unlimited mileage within Spain, 24/7 roadside assistance, and delivery and collection within 25km of San Juan de los Terreros. Nothing hidden.',
  },
  {
    q: 'What are the age and license requirements?',
    a: 'Drivers must be at least 25 years old and hold a full driving licence issued at least 2 years ago. International licences are accepted.',
  },
  {
    q: 'What is the cancellation policy?',
    a: 'Cancellations must be made by contacting us directly via WhatsApp or email. Our cancellation policy is communicated at the time of booking confirmation.',
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
