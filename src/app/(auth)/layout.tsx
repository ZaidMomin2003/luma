import Link from 'next/link'
import { Logo } from '@/components/logo'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ backgroundColor: '#09090b' }}>
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1536431311719-398b6704d4cc?q=80&w=2000&auto=format&fit=crop"
          alt=""
          className="size-full object-cover opacity-40"
        />
      </div>

      <header className="relative z-10 px-6 py-6">
        <Link href="/" className="inline-block">
          <Logo />
        </Link>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-6 pb-16">
        {children}
      </main>

      <footer className="relative z-10 px-6 py-6 text-center">
        <p className="text-xs text-muted-foreground">
          © 2026 Luma · <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link> · <Link href="/refund" className="hover:text-foreground transition-colors">Terms</Link>
        </p>
      </footer>
    </div>
  )
}
