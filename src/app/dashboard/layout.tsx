'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Video, BarChart3, LineChart,
  User, Settings, LogOut, ChevronDown, Gauge, Sparkles, X, Loader2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dock, DockIcon } from '@/components/ui/dock'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useAuth } from '@/lib/auth-context'
import { logout } from '@/lib/firebase'

const dockItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Video, label: 'Campaigns', href: '/dashboard/campaigns' },
  { icon: BarChart3, label: 'Results', href: '/dashboard/results' },
  { icon: LineChart, label: 'Analytics', href: '/dashboard/analytics' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [profileOpen, setProfileOpen] = useState(false)
  const [creditsOpen, setCreditsOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const creditsRef = useRef<HTMLDivElement>(null)
  const { user, dbUser, loading } = useAuth()

  // Auth guard — redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [loading, user, router])

  // Show loading state while checking auth
  if (loading || !user) {
    return (
      <div className="h-screen bg-[#09090b] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-6 animate-spin text-emerald-400" />
          <span className="text-sm text-muted-foreground">Loading...</span>
        </div>
      </div>
    )
  }

  const displayName = user?.displayName || dbUser?.name || 'User'
  const displayEmail = user?.email || dbUser?.email || ''

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false)
      if (creditsRef.current && !creditsRef.current.contains(e.target as Node)) setCreditsOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="flex flex-col h-screen bg-[#09090b] overflow-hidden">
      {/* Header */}
      <header className="h-14 border-b border-white/[0.06] px-6 flex items-center justify-center shrink-0 bg-[#09090b]/90 backdrop-blur-xl sticky top-0 z-30">
        <div className="w-full max-w-6xl flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="size-9 rounded-lg overflow-hidden shrink-0">
            <svg viewBox="0 0 32 32" className="size-full">
              <defs><linearGradient id="hLogo" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#34d399"/><stop offset="100%" stopColor="#059669"/></linearGradient></defs>
              <rect width="32" height="32" rx="8" fill="url(#hLogo)"/>
              <path d="M10 22V10l12 6-12 6z" fill="white" opacity="0.95"/>
              <circle cx="22" cy="10" r="3" fill="white" opacity="0.6"/>
            </svg>
          </div>
          <span className="font-semibold text-base text-foreground hidden sm:block">Luma</span>
        </Link>

        {/* Right: Credits + Profile */}
        <div className="flex items-center gap-2">

          {/* Credits Icon */}
          <div className="relative" ref={creditsRef}>
            <button
              onClick={() => setCreditsOpen(!creditsOpen)}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all',
                creditsOpen ? 'bg-white/[0.06] text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.03]'
              )}
            >
              <Gauge size={14} />
              <span className="hidden sm:inline">Usage</span>
            </button>

            <AnimatePresence>
              {creditsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.12 }}
                  className="absolute top-full right-0 mt-2 w-72 bg-[#111113] rounded-xl border border-white/[0.08] shadow-2xl shadow-black/50 overflow-hidden z-50"
                >
                  <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground">Plan Usage</span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Pro Plan</span>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-muted-foreground">Campaigns</span>
                        <span className="text-xs text-foreground font-medium">12 / 20</span>
                      </div>
                      <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <div className="h-full w-[60%] bg-gradient-to-r from-emerald-500/80 to-emerald-500/30 rounded-full" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-muted-foreground">Viewer Sessions</span>
                        <span className="text-xs text-foreground font-medium">4,231 / 8,000</span>
                      </div>
                      <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <div className="h-full w-[53%] bg-gradient-to-r from-emerald-500/80 to-emerald-500/30 rounded-full" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-muted-foreground">AI Processing</span>
                        <span className="text-xs text-foreground font-medium">67 / 100 mins</span>
                      </div>
                      <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <div className="h-full w-[67%] bg-gradient-to-r from-amber-500/80 to-amber-500/30 rounded-full" />
                      </div>
                    </div>
                    <Link href="/dashboard/pricing" className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-lg bg-gradient-to-r from-emerald-600/20 to-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/30 text-xs font-medium text-emerald-300 transition-all">
                      <Sparkles size={11} />
                      Upgrade Plan
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className={cn(
                'flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all',
                profileOpen ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'
              )}
            >
              <div className="size-7 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 ring-2 ring-white/[0.06]" />
              <ChevronDown size={12} className={cn('text-muted-foreground transition-transform', profileOpen && 'rotate-180')} />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.12 }}
                  className="absolute top-full right-0 mt-2 w-56 bg-[#111113] rounded-xl border border-white/[0.08] shadow-2xl shadow-black/50 overflow-hidden z-50"
                >
                  <div className="px-4 py-3 border-b border-white/[0.06]">
                    <p className="text-sm font-medium text-foreground">{displayName}</p>
                    <p className="text-xs text-muted-foreground">{displayEmail}</p>
                  </div>
                  <div className="p-1.5">
                    <Link href="/dashboard/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-colors">
                      <User size={14} /> Profile
                    </Link>
                    <Link href="/dashboard/settings" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-colors">
                      <Settings size={14} /> Settings
                    </Link>
                    <div className="my-1 border-t border-white/[0.06]" />
                    <button onClick={async () => { await logout(); window.location.href = '/' }} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-red-400 hover:bg-red-500/10 transition-colors">
                      <LogOut size={14} /> Log out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10 pb-28">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="max-w-7xl mx-auto pb-16"
        >
          {children}
        </motion.div>
      </main>

      {/* Floating Dock */}
      <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50">
        <TooltipProvider>
          <Dock>
            {dockItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <DockIcon key={item.label}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center justify-center size-full rounded-full transition-colors',
                          isActive
                            ? 'bg-white/[0.1] text-foreground'
                            : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.05]'
                        )}
                      >
                        <item.icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                </DockIcon>
              )
            })}
          </Dock>
        </TooltipProvider>
      </div>
    </div>
  )
}
