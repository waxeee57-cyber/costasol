const WA_BASE = 'https://wa.me/'

function getNumber(): string {
  return process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP ?? ''
}

export function buildWhatsAppLink(message?: string): string {
  const num = getNumber()
  if (!message) return `${WA_BASE}${num}`
  return `${WA_BASE}${num}?text=${encodeURIComponent(message)}`
}

export function buildCarInquiryLink(opts: {
  carLabel: string
  startDate: string
  endDate: string
  pickupLocation: string
  totalFormatted: string
}): string {
  const msg =
    `Hi, I'm interested in the ${opts.carLabel} from ${opts.startDate} to ${opts.endDate}, ` +
    `picking up at ${opts.pickupLocation}. Estimated total: ${opts.totalFormatted}.`
  return buildWhatsAppLink(msg)
}

export function buildBookingLink(opts: {
  customerName: string
  bookingCode: string
}): string {
  const msg = `Hi ${opts.customerName}, this is CostaSol about your reservation ${opts.bookingCode}.`
  return buildWhatsAppLink(msg)
}

export function buildStatusPageLink(opts: {
  bookingCode: string
}): string {
  const msg = `Hi, I'm following up on my reservation ${opts.bookingCode}.`
  return buildWhatsAppLink(msg)
}
