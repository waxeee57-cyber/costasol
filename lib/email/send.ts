import { sendEmail, ADMIN_EMAIL } from '@/lib/resend'
import {
  inquiryConfirmationEmail,
  inquiryAdminAlertEmail,
  bookingConfirmedEmail,
  bookingConfirmedAdminEmail,
  bookingCancelledEmail,
} from '@/lib/email/templates'

export async function sendInquiryEmails(data: {
  customerName: string
  customerEmail: string
  customerPhone?: string
  carLabel: string
  startAt: string
  endAt: string
  days: number
  pickupLocation: string
  pickupTime: string
  totalEur: number
  depositEur: number
  bookingCode: string
  customerMessage?: string
  transferRequested?: boolean
  transferAddress?: string
}) {
  console.log('[Email] sendInquiryEmails called for:', data.customerEmail)
  const [customerResult, adminResult] = await Promise.allSettled([
    sendEmail({
      to: data.customerEmail,
      subject: `Reservation request received — ${data.bookingCode}`,
      html: inquiryConfirmationEmail(data),
      replyTo: ADMIN_EMAIL,
    }),
    sendEmail({
      to: ADMIN_EMAIL,
      subject: data.transferRequested
        ? `⚠ New inquiry (transfer) — ${data.bookingCode} — ${data.carLabel}`
        : `New inquiry — ${data.bookingCode} — ${data.carLabel}`,
      html: inquiryAdminAlertEmail(data),
    }),
  ])

  if (customerResult.status === 'rejected') {
    console.error('[Email] Customer inquiry email failed:', customerResult.reason)
  }
  if (adminResult.status === 'rejected') {
    console.error('[Email] Admin inquiry alert failed:', adminResult.reason)
  }
}

export async function sendConfirmationEmails(data: {
  customerName: string
  customerEmail: string
  carLabel: string
  startAt: string
  endAt: string
  days: number
  pickupLocation: string
  pickupTime: string
  totalEur: number
  depositEur: number
  bookingCode: string
  transferRequested?: boolean
  transferAddress?: string
  transferFeeEur?: number | null
}) {
  console.log('[Email] sendConfirmationEmails called for:', data.customerEmail)
  const [customerResult, adminResult] = await Promise.allSettled([
    sendEmail({
      to: data.customerEmail,
      subject: `Your reservation is confirmed — ${data.bookingCode}`,
      html: bookingConfirmedEmail(data),
      replyTo: ADMIN_EMAIL,
    }),
    sendEmail({
      to: ADMIN_EMAIL,
      subject: `Confirmed — ${data.bookingCode} — ${data.carLabel}`,
      html: bookingConfirmedAdminEmail(data),
    }),
  ])

  if (customerResult.status === 'rejected') {
    console.error('[Email] Customer confirmation email failed:', customerResult.reason)
  }
  if (adminResult.status === 'rejected') {
    console.error('[Email] Admin confirmation alert failed:', adminResult.reason)
  }
}

export async function sendCancellationEmail(data: {
  customerName: string
  customerEmail: string
  carLabel: string
  startAt: string
  endAt: string
  bookingCode: string
}) {
  const result = await Promise.allSettled([
    sendEmail({
      to: data.customerEmail,
      subject: `Your reservation has been cancelled — ${data.bookingCode}`,
      html: bookingCancelledEmail(data),
      replyTo: ADMIN_EMAIL,
    }),
  ])

  if (result[0].status === 'rejected') {
    console.error('[Email] Customer cancellation email failed:', result[0].reason)
  }
}
