import { Resend } from 'resend'

const apiKey = process.env.RESEND_API_KEY ?? ''
const isDev = !apiKey || apiKey === 'dev'

const resendClient = isDev ? null : new Resend(apiKey)

interface SendEmailOpts {
  to: string
  subject: string
  html: string
  from?: string
}

export async function sendEmail(opts: SendEmailOpts): Promise<void> {
  const from = opts.from ?? process.env.RESEND_FROM_EMAIL ?? 'noreply@example.com'

  if (isDev) {
    console.log('[resend:dev] email skipped — no API key configured', {
      to: opts.to,
      subject: opts.subject,
      from,
    })
    return
  }

  const { error } = await resendClient!.emails.send({
    from,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
  })

  if (error) {
    console.error('[resend] send failed', error)
    throw error
  }
}
