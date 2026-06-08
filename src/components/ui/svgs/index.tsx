import { cn } from '@/lib/utils'

interface SvgProps {
  className?: string
}

export function Spotify({ className }: SvgProps) {
  return <span className={cn('font-bold text-lg tracking-tight', className)}>Spotify</span>
}

export function SupabaseFull({ className }: SvgProps) {
  return <span className={cn('font-bold text-lg tracking-tight', className)}>Supabase</span>
}

export function Hulu({ className }: SvgProps) {
  return <span className={cn('font-bold text-lg tracking-tight', className)}>Notion</span>
}

export function Bolt({ className }: SvgProps) {
  return <span className={cn('font-bold text-lg tracking-tight', className)}>Linear</span>
}

export function FirebaseFull({ className }: SvgProps) {
  return <span className={cn('font-bold text-lg tracking-tight', className)}>Vercel</span>
}

export function Beacon({ className }: SvgProps) {
  return <span className={cn('font-bold text-lg tracking-tight', className)}>Stripe</span>
}

export function Claude({ className }: SvgProps) {
  return <span className={cn('font-bold text-lg tracking-tight', className)}>OpenAI</span>
}

export function VercelFull({ className }: SvgProps) {
  return <span className={cn('font-bold text-lg tracking-tight', className)}>Google</span>
}
