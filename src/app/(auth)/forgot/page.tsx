import { Metadata } from 'next'
import Link from 'next/link'
import { Mail, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = { title: 'Reset access — Luma' }

export default function ForgotPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
          <Mail className="size-5 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Reset your access</h1>
        <p className="text-muted-foreground mt-2 text-sm">Enter your email and we&apos;ll send you a magic link to sign back in.</p>
      </div>

      <form className="space-y-4">
        <div>
          <label htmlFor="email" className="text-sm font-medium text-foreground block mb-1.5">Email address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              id="email"
              type="email"
              placeholder="you@company.com"
              className="w-full h-11 rounded-xl border border-border bg-background pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
            />
          </div>
        </div>
        <Button className="w-full h-11 rounded-xl text-sm font-medium">
          Send reset link
        </Button>
      </form>

      <div className="mt-8 text-center">
        <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="size-3.5" />
          Back to login
        </Link>
      </div>
    </div>
  )
}
