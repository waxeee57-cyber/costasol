import { Header } from '@/components/marketing/Header'
import { Footer } from '@/components/marketing/Footer'
import { WhatsAppButton } from '@/components/brand/WhatsAppButton'
import { CookieBanner } from '@/components/brand/CookieBanner'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
      <WhatsAppButton />
      <CookieBanner />
    </>
  )
}
