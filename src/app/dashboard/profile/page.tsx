'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Key, Eye, EyeOff, Copy, AlertTriangle, Users, Mail, Shield } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'

export default function ProfilePage() {
  const [showKey, setShowKey] = useState(false)
  const { user, dbUser } = useAuth()

  // Determine sign-in provider
  const getProvider = () => {
    if (!user) return null
    const providerData = user.providerData?.[0]
    if (!providerData) return { id: 'email', label: 'Email Magic Link', icon: '✉️' }
    switch (providerData.providerId) {
      case 'google.com': return { id: 'google', label: 'Google', icon: '🔵' }
      case 'github.com': return { id: 'github', label: 'GitHub', icon: '⚫' }
      default: return { id: 'email', label: 'Email Magic Link', icon: '✉️' }
    }
  }

  const provider = getProvider()
  const displayName = user?.displayName || dbUser?.name || ''
  const displayEmail = user?.email || dbUser?.email || ''
  const photoUrl = user?.photoURL
  const plan = dbUser?.plan || 'free'
  const company = dbUser?.company || ''

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
        <div className="flex items-center gap-4 mb-6">
          {photoUrl ? (
            <img src={photoUrl} alt={displayName} className="size-14 rounded-full object-cover ring-2 ring-white/[0.06]" />
          ) : (
            <div className="size-14 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-xl font-bold text-black">
              {displayName ? displayName[0].toUpperCase() : displayEmail[0]?.toUpperCase() || '?'}
            </div>
          )}
          <div>
            <h3 className="font-medium text-foreground">{displayName || 'No name set'}</h3>
            <p className="text-sm text-muted-foreground">{displayEmail}</p>
          </div>
        </div>

        {/* Sign-in method badge */}
        {provider && (
          <div className="mb-6 flex items-center gap-2">
            <Shield size={13} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Signed in with</span>
            <span className="text-xs font-medium text-foreground bg-white/[0.04] border border-white/[0.06] px-2.5 py-0.5 rounded-full">
              {provider.icon} {provider.label}
            </span>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Full name</label>
            <input
              defaultValue={displayName}
              placeholder="Your name"
              className="w-full h-10 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 text-sm focus:outline-none focus:ring-1 focus:ring-white/10 transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Email</label>
            <input
              defaultValue={displayEmail}
              disabled
              className="w-full h-10 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 text-sm text-muted-foreground cursor-not-allowed"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Company</label>
            <input
              defaultValue={company}
              placeholder="Your company"
              className="w-full h-10 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 text-sm focus:outline-none focus:ring-1 focus:ring-white/10 transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">User ID</label>
            <input
              defaultValue={user?.uid || ''}
              disabled
              className="w-full h-10 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 text-xs font-mono text-muted-foreground cursor-not-allowed"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button className="rounded-lg">Save changes</Button>
        </div>
      </div>

      {/* Plan */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
        <h3 className="font-medium text-foreground mb-4">Current Plan</h3>
        <div className="flex items-center justify-between p-4 rounded-lg bg-white/[0.03] border border-white/[0.06]">
          <div>
            <p className="font-medium text-foreground capitalize">{plan} Plan</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {plan === 'free' ? 'Free tier — upgrade for more features' :
               plan === 'starter' ? '$29/month' :
               plan === 'pro' ? '$249/month' : 'Custom pricing'}
            </p>
          </div>
          <Button variant="outline" className="rounded-lg border-white/[0.08]" asChild>
            <a href="/dashboard/pricing">Manage</a>
          </Button>
        </div>
      </div>

      {/* API Key */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
        <div className="flex items-center gap-2 mb-4">
          <Key size={16} className="text-muted-foreground" />
          <h3 className="font-medium text-foreground">API Key</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-10 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 flex items-center">
            <code className="text-sm text-muted-foreground font-mono">
              {showKey ? `luma_sk_${user?.uid?.slice(0, 20) || 'demo'}` : '••••••••••••••••••••••••••'}
            </code>
          </div>
          <Button variant="outline" size="icon" className="rounded-lg border-white/[0.06] size-10" onClick={() => setShowKey(!showKey)}>
            {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
          </Button>
          <Button variant="outline" size="icon" className="rounded-lg border-white/[0.06] size-10">
            <Copy size={14} />
          </Button>
        </div>
      </div>

      {/* Team */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
        <div className="flex items-center gap-2 mb-2">
          <Users size={16} className="text-muted-foreground" />
          <h3 className="font-medium text-foreground">Team</h3>
          <span className="text-xs bg-white/[0.06] px-2 py-0.5 rounded-full text-muted-foreground">Coming soon</span>
        </div>
        <p className="text-sm text-muted-foreground">Invite team members, manage roles, and collaborate on campaigns.</p>
      </div>

      {/* Danger */}
      <div className="rounded-xl border border-red-500/20 bg-red-500/[0.02] p-6">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle size={16} className="text-red-400" />
          <h3 className="font-medium text-red-400">Danger Zone</h3>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div>
            <p className="text-sm text-foreground">Delete account</p>
            <p className="text-xs text-muted-foreground">Permanently delete your account and all data</p>
          </div>
          <Button variant="outline" className="rounded-lg border-red-500/30 text-red-400 hover:bg-red-500/10">Delete</Button>
        </div>
      </div>
    </div>
  )
}
