import { formatInTimeZone } from 'date-fns-tz'

export const TZ = 'Europe/Madrid'

export const formatPrice = (eur: number) =>
  new Intl.NumberFormat('en-IE', {
    style: 'currency', currency: 'EUR', maximumFractionDigits: 0,
  }).format(eur)

export const formatPriceDecimals = (eur: number) =>
  new Intl.NumberFormat('en-IE', {
    style: 'currency', currency: 'EUR',
  }).format(eur)

export const formatDate = (utc: string | Date) =>
  formatInTimeZone(utc, TZ, 'd MMM yyyy')

export const formatDateTime = (utc: string | Date) =>
  formatInTimeZone(utc, TZ, 'd MMM yyyy, HH:mm')

export const formatTime = (utc: string | Date) =>
  formatInTimeZone(utc, TZ, 'HH:mm')

export const formatDateRange = (startUtc: string, endUtc: string) =>
  `${formatDate(startUtc)} → ${formatDate(endUtc)}`

export const isFutureOrToday = (date: Date): boolean => {
  const todayMadrid = formatInTimeZone(new Date(), TZ, 'yyyy-MM-dd')
  const candidate   = formatInTimeZone(date, TZ, 'yyyy-MM-dd')
  return candidate >= todayMadrid
}
