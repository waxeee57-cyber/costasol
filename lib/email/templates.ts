import { formatDate, formatDateRange, formatPriceDecimals, TZ } from '@/lib/formatters'

const BRAND_GOLD = '#C8A96B'
const BRAND_DARK = '#0F0F10'
const TEXT_DARK = '#181818'
const TEXT_GREY = '#666666'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://costasol.vercel.app'

function getWhatsAppLink(): string | null {
  const num = process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP
  if (!num || num.startsWith('36')) return null
  return `https://wa.me/${num}`
}

function layout(content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CostaSol Car Rent</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0"
          style="max-width:560px;background:#ffffff;border-radius:8px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background:${BRAND_DARK};padding:24px 32px;text-align:center;">
              <p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;
                color:${BRAND_GOLD};font-weight:600;">CostaSol Car Rent</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:32px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:16px 32px 24px;border-top:1px solid #eeeeee;text-align:center;">
              <p style="margin:0;font-size:12px;color:${TEXT_GREY};">
                CostaSol Car Rent &nbsp;·&nbsp; Costa del Sol, Spain<br>
                <a href="mailto:rent@drivecostasol.com"
                  style="color:${BRAND_GOLD};text-decoration:none;">rent@drivecostasol.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function button(text: string, href: string): string {
  return `
<table cellpadding="0" cellspacing="0" style="margin:24px 0;">
  <tr>
    <td style="background:${BRAND_GOLD};border-radius:4px;">
      <a href="${href}"
        style="display:block;padding:14px 28px;color:${BRAND_DARK};
        font-size:13px;font-weight:700;text-decoration:none;
        letter-spacing:1px;text-transform:uppercase;">${text}</a>
    </td>
  </tr>
</table>`
}

const divider = `<hr style="border:none;border-top:1px solid #eeeeee;margin:24px 0;">`

function row(label: string, value: string): string {
  return `
<tr>
  <td style="padding:6px 0;font-size:13px;color:${TEXT_GREY};width:140px;
    vertical-align:top;">${label}</td>
  <td style="padding:6px 0;font-size:13px;color:${TEXT_DARK};
    font-weight:600;vertical-align:top;">${value}</td>
</tr>`
}

// ─── TEMPLATE 1: Customer inquiry confirmation ────────────────────────────

export function inquiryConfirmationEmail(data: {
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
}): string {
  const content = `
<h1 style="margin:0 0 8px;font-size:24px;color:${TEXT_DARK};font-weight:700;">
  We have your request.
</h1>
<p style="margin:0 0 24px;font-size:15px;color:${TEXT_GREY};line-height:1.6;">
  Thank you, ${data.customerName}. We have received your reservation request
  for the ${data.carLabel}. We will be in touch personally to confirm.
</p>

${divider}

<table cellpadding="0" cellspacing="0" width="100%" style="margin:16px 0;">
  ${row('Booking reference', data.bookingCode)}
  ${row('Vehicle', data.carLabel)}
  ${row('Dates', formatDateRange(data.startAt, data.endAt))}
  ${row('Duration', `${data.days} day${data.days !== 1 ? 's' : ''}`)}
  ${row('Pickup', data.pickupLocation)}
  ${row('Pickup time', data.pickupTime)}
  ${data.transferRequested && data.transferAddress
    ? row('Custom delivery', data.transferAddress)
    : ''}
</table>

${divider}

<table cellpadding="0" cellspacing="0" width="100%" style="margin:16px 0;">
  ${row('Rental total', formatPriceDecimals(data.totalEur))}
  ${row('Refundable deposit', formatPriceDecimals(data.depositEur))}
  ${data.transferRequested
    ? row('Transfer fee', 'To be confirmed')
    : ''}
  ${row('Payment', 'In person at pickup')}
</table>

${divider}

<p style="margin:16px 0 8px;font-size:13px;color:${TEXT_GREY};line-height:1.6;">
  Track your reservation status at any time using your booking reference
  and the email address you provided:
</p>
${button('View Reservation Status', `${process.env.NEXT_PUBLIC_SITE_URL}/booking/${data.bookingCode}?email=${encodeURIComponent(data.customerEmail)}`)}

<p style="margin:16px 0 0;font-size:13px;color:${TEXT_GREY};line-height:1.6;">
  Need to make a change? Contact us directly —
  ${getWhatsAppLink()
    ? `<a href="${getWhatsAppLink()}" style="color:${BRAND_GOLD};text-decoration:none;">WhatsApp</a> or `
    : ''}
  <a href="mailto:rent@drivecostasol.com"
    style="color:${BRAND_GOLD};text-decoration:none;">email</a>.
</p>`

  return layout(content)
}

// ─── TEMPLATE 2: Admin new inquiry alert ─────────────────────────────────

export function inquiryAdminAlertEmail(data: {
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
}): string {
  const adminUrl = `${SITE_URL}/admin/bookings`
  const isTransfer = data.transferRequested && data.transferAddress

  const content = `
<h1 style="margin:0 0 8px;font-size:24px;color:${TEXT_DARK};font-weight:700;">
  ${isTransfer ? '⚠ New inquiry — Transfer requested' : 'New inquiry received'}
</h1>
<p style="margin:0 0 24px;font-size:15px;color:${TEXT_GREY};">
  Booking reference: <strong>${data.bookingCode}</strong>
</p>

${divider}

<h3 style="margin:0 0 12px;font-size:13px;text-transform:uppercase;
  letter-spacing:1px;color:${TEXT_GREY};">Customer</h3>
<table cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 16px;">
  ${row('Name', data.customerName)}
  ${row('Email', `<a href="mailto:${data.customerEmail}"
    style="color:${BRAND_GOLD};text-decoration:none;">${data.customerEmail}</a>`)}
  ${data.customerPhone ? row('Phone', `<a href="tel:${data.customerPhone}"
    style="color:${BRAND_GOLD};text-decoration:none;">${data.customerPhone}</a>`) : ''}
</table>

${divider}

<h3 style="margin:0 0 12px;font-size:13px;text-transform:uppercase;
  letter-spacing:1px;color:${TEXT_GREY};">Booking</h3>
<table cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 16px;">
  ${row('Vehicle', data.carLabel)}
  ${row('Dates', formatDateRange(data.startAt, data.endAt))}
  ${row('Duration', `${data.days} day${data.days !== 1 ? 's' : ''}`)}
  ${row('Pickup', data.pickupLocation)}
  ${row('Pickup time', data.pickupTime)}
  ${isTransfer ? row('⚠ Transfer to', data.transferAddress!) : ''}
  ${row('Rental total', formatPriceDecimals(data.totalEur))}
  ${row('Deposit', formatPriceDecimals(data.depositEur))}
</table>

${data.customerMessage ? `
${divider}
<h3 style="margin:0 0 8px;font-size:13px;text-transform:uppercase;
  letter-spacing:1px;color:${TEXT_GREY};">Customer message</h3>
<p style="margin:0;font-size:14px;color:${TEXT_DARK};line-height:1.6;
  font-style:italic;">"${data.customerMessage}"</p>
` : ''}

${isTransfer ? `
${divider}
<p style="margin:0;font-size:13px;color:#c0392b;line-height:1.6;font-weight:600;">
  ⚠ This booking requires a transfer fee. Set the fee in the admin panel
  before confirming with the customer.
</p>
` : ''}

${divider}

${button('Open in Admin Panel', adminUrl)}`

  return layout(content)
}

// ─── TEMPLATE 3: Customer booking confirmed ───────────────────────────────

export function bookingConfirmedEmail(data: {
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
}): string {
  const content = `
<h1 style="margin:0 0 8px;font-size:24px;color:${TEXT_DARK};font-weight:700;">
  Your reservation is confirmed.
</h1>
<p style="margin:0 0 24px;font-size:15px;color:${TEXT_GREY};line-height:1.6;">
  ${data.customerName}, we look forward to seeing you.
  Your ${data.carLabel} will be ready for you on ${formatDate(data.startAt)}.
</p>

${divider}

<h3 style="margin:0 0 12px;font-size:13px;text-transform:uppercase;
  letter-spacing:1px;color:${TEXT_GREY};">Pickup details</h3>
<table cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 16px;">
  ${row('Vehicle', data.carLabel)}
  ${row('Date', formatDate(data.startAt))}
  ${row('Time', data.pickupTime)}
  ${row('Location', data.pickupLocation)}
  ${data.transferRequested && data.transferAddress
    ? row('Delivery address', data.transferAddress)
    : ''}
</table>

${divider}

<h3 style="margin:0 0 12px;font-size:13px;text-transform:uppercase;
  letter-spacing:1px;color:${TEXT_GREY};">What to bring</h3>
<ul style="margin:0 0 16px;padding:0 0 0 20px;font-size:14px;
  color:${TEXT_DARK};line-height:1.8;">
  <li>Valid driving licence</li>
  <li>Passport or national ID</li>
  <li>Payment for the rental total and refundable deposit</li>
</ul>

${divider}

<h3 style="margin:0 0 12px;font-size:13px;text-transform:uppercase;
  letter-spacing:1px;color:${TEXT_GREY};">Payment at pickup</h3>
<table cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 16px;">
  ${row('Rental total', formatPriceDecimals(data.totalEur))}
  ${data.transferRequested
    ? row('Transfer fee',
        data.transferFeeEur != null
          ? formatPriceDecimals(data.transferFeeEur)
          : 'As agreed')
    : ''}
  ${row('Refundable deposit', formatPriceDecimals(data.depositEur))}
  ${row('Return date', formatDate(data.endAt))}
</table>

${divider}

${button('View Reservation', `${process.env.NEXT_PUBLIC_SITE_URL}/booking/${data.bookingCode}?email=${encodeURIComponent(data.customerEmail)}`)}

<p style="margin:16px 0 0;font-size:13px;color:${TEXT_GREY};line-height:1.6;">
  Any questions before pickup? Contact us directly —
  ${getWhatsAppLink()
    ? `<a href="${getWhatsAppLink()}" style="color:${BRAND_GOLD};text-decoration:none;">WhatsApp</a> or `
    : ''}
  <a href="mailto:rent@drivecostasol.com"
    style="color:${BRAND_GOLD};text-decoration:none;">email</a>.
</p>`

  return layout(content)
}

// ─── TEMPLATE 5: Customer booking cancelled ──────────────────────────────

export function bookingCancelledEmail(data: {
  customerName: string
  carLabel: string
  startAt: string
  endAt: string
  bookingCode: string
}): string {
  const content = `
<h1 style="margin:0 0 8px;font-size:24px;color:${TEXT_DARK};font-weight:700;">
  Your reservation has been cancelled.
</h1>
<p style="margin:0 0 24px;font-size:15px;color:${TEXT_GREY};line-height:1.6;">
  Dear ${data.customerName}, your reservation for the ${data.carLabel}
  from ${formatDate(data.startAt)} to ${formatDate(data.endAt)}
  (reference: <strong>${data.bookingCode}</strong>) has been cancelled.
</p>

${divider}

<p style="margin:0 0 16px;font-size:14px;color:${TEXT_DARK};line-height:1.6;">
  If you have any questions or would like to make a new reservation,
  please contact us directly —
  ${getWhatsAppLink()
    ? `<a href="${getWhatsAppLink()}" style="color:${BRAND_GOLD};text-decoration:none;">WhatsApp</a> or `
    : ''}
  <a href="mailto:rent@drivecostasol.com"
    style="color:${BRAND_GOLD};text-decoration:none;">rent@drivecostasol.com</a>.
</p>`

  return layout(content)
}

// ─── TEMPLATE 4: Admin booking confirmed alert ────────────────────────────

export function bookingConfirmedAdminEmail(data: {
  customerName: string
  customerEmail: string
  carLabel: string
  startAt: string
  endAt: string
  pickupLocation: string
  pickupTime: string
  bookingCode: string
}): string {
  const adminUrl = `${SITE_URL}/admin/bookings`

  const content = `
<h1 style="margin:0 0 8px;font-size:24px;color:${TEXT_DARK};font-weight:700;">
  Booking confirmed.
</h1>
<p style="margin:0 0 24px;font-size:15px;color:${TEXT_GREY};">
  You confirmed <strong>${data.bookingCode}</strong> for ${data.customerName}.
  A confirmation email has been sent to the customer.
</p>

${divider}

<table cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 16px;">
  ${row('Customer', data.customerName)}
  ${row('Email', data.customerEmail)}
  ${row('Vehicle', data.carLabel)}
  ${row('Pickup', formatDate(data.startAt))}
  ${row('Time', data.pickupTime)}
  ${row('Location', data.pickupLocation)}
  ${row('Return', formatDate(data.endAt))}
</table>

${divider}

${button('View in Admin', adminUrl)}`

  return layout(content)
}
