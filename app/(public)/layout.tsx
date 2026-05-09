import { Header } from '@/components/marketing/Header'
import { Footer } from '@/components/marketing/Footer'
import { WhatsAppButton } from '@/components/brand/WhatsAppButton'
import { CookieBanner } from '@/components/brand/CookieBanner'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main-content" className="skip-nav">Skip to content</a>
      <Header />
      <main id="main-content" className="flex-1 pt-16 animate-page-enter">{children}</main>
      <Footer />
      <WhatsAppButton />
      <CookieBanner />
    </>
  )
}
