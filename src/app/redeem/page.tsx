'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Gift, Check, ArrowRight, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function RedeemPage() {
  const [code, setCode] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleRedeem = async () => {
    if (!code.trim()) return
    setStatus('loading')

    try {
      const res = await fetch('/api/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'current-user-id', code: code.trim() }),
      })

      const data = await res.json()

      if (res.ok) {
        setStatus('success')
        setMessage(data.message)
      } else {
        setStatus('error')
        setMessage(data.error)
      }
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col">
      <header className="px-6 py-6">
        <Link href="/"><Logo /></Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 pb-16">
        <div className="w-full max-w-md text-center">
          {status === 'success' ? (
            <div>
              <div className="size-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                <Check size={28} className="text-emerald-400" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">License Redeemed!</h1>
              <p className="text-muted-foreground text-sm mb-8">{message}</p>
              <Link href="/dashboard">
                <Button className="rounded-xl h-11 px-6 gap-2">
                  Go to Dashboard <ArrowRight size={14} />
                </Button>
              </Link>
            </div>
          ) : (
            <div>
              <div className="size-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                <Gift size={22} className="text-emerald-400" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Redeem Your License</h1>
              <p className="text-muted-foreground text-sm mb-8">Enter your AppSumo license code to activate your lifetime access.</p>

              <div className="space-y-4">
                <input
                  type="text"
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  placeholder="LUMA-XXXXX-XXXXX"
                  className="w-full h-12 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 text-center text-lg font-mono text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/30 tracking-widest"
                  maxLength={17}
                />

                {status === 'error' && (
                  <p className="text-red-400 text-sm">{message}</p>
                )}

                <Button
                  onClick={handleRedeem}
                  disabled={code.trim().length < 10 || status === 'loading'}
                  className="w-full rounded-xl h-11 gap-2"
                >
                  {status === 'loading' ? (
                    <><Loader2 size={14} className="animate-spin" /> Validating...</>
                  ) : (
                    <>Redeem Code</>
                  )}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground mt-6">
                Don&apos;t have a code? <Link href="/dashboard/pricing" className="text-emerald-400 hover:underline">View plans</Link>
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
