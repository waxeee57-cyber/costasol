import { Suspense } from 'react'
import { BookingStatusClient } from './BookingStatusClient'

interface PageProps {
  params: Promise<{ code: string }>
  searchParams: Promise<{ email?: string }>
}

export default async function BookingStatusPage({ params, searchParams }: PageProps) {
  const [{ code }, sp] = await Promise.all([params, searchParams])
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <BookingStatusClient code={code.toUpperCase()} emailParam={sp.email} />
    </Suspense>
  )
}
