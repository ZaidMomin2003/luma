import Link from 'next/link'
import { Logo } from '@/components/logo'
import { ArrowLeft } from 'lucide-react'

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="mx-auto max-w-3xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
          </Link>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors duration-200">
            <ArrowLeft className="size-3.5" />
            Home
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        {children}
      </main>
      <footer className="border-t border-border/50 py-8">
        <div className="mx-auto max-w-3xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">© 2026 Luma. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/refund" className="text-muted-foreground hover:text-foreground transition-colors">Refund</Link>
            <Link href="/support" className="text-muted-foreground hover:text-foreground transition-colors">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
