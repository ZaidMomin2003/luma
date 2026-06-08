'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { completeMagicLinkSignIn } from '@/lib/firebase'
import { Loader2 } from 'lucide-react'

export default function AuthCallback() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function handleCallback() {
      try {
        const result = await completeMagicLinkSignIn()
        if (result) {
          router.push('/dashboard')
        } else {
          router.push('/login')
        }
      } catch (err: any) {
        setError(err.message || 'Authentication failed')
      }
    }
    handleCallback()
  }, [router])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-red-400 text-sm mb-4">Authentication error</p>
          <p className="text-muted-foreground text-xs">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex items-center gap-3">
        <Loader2 className="size-5 animate-spin text-emerald-400" />
        <span className="text-sm text-muted-foreground">Signing you in...</span>
      </div>
    </div>
  )
}
