'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

interface CodeEmailLookupProps {
  initialCode?: string
  title?: string
}

export function CodeEmailLookup({ initialCode, title = 'Look up your reservation' }: CodeEmailLookupProps) {
  const router = useRouter()
  const [code, setCode] = useState(initialCode ?? '')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/booking/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.toUpperCase(), email }),
      })

      if (res.ok) {
        router.push(`/booking/${code.toUpperCase()}?email=${encodeURIComponent(email)}`)
      } else {
        const data = await res.json()
        setError(data.error ?? 'Booking not found.')
      }
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg border border-border bg-graphite p-6 md:p-8">
      <h2 className="font-display text-2xl font-medium text-white mb-1">{title}</h2>
      <p className="font-sans text-sm text-muted mb-6">Enter your booking code and email address.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="lookup-code">Booking code</Label>
          <Input
            id="lookup-code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="CSR-XXXXXX"
            className="uppercase tracking-widest"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="lookup-email">Email address</Label>
          <Input
            id="lookup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        {error && <p className="text-xs font-sans text-danger">{error}</p>}

        <Button type="submit" className="w-full" disabled={loading || !code || !email}>
          {loading ? 'Looking up...' : 'Find Reservation'}
        </Button>
      </form>
    </div>
  )
}
