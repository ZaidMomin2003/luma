import { Button } from '@/components/ui/button'
import { CreditCard, Bell, Shield, Palette } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure your workspace preferences</p>
      </div>

      
      <div className="rounded-xl border border-border/50 bg-white/[0.02] p-6">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard size={16} className="text-muted-foreground" />
          <h3 className="font-medium text-foreground">Billing</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-border/30">
            <span className="text-sm text-muted-foreground">Current plan</span>
            <span className="text-sm text-foreground font-medium">Pro — $249/mo</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-border/30">
            <span className="text-sm text-muted-foreground">Next billing date</span>
            <span className="text-sm text-foreground">July 1, 2026</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-sm text-muted-foreground">Payment method</span>
            <span className="text-sm text-foreground">•••• 4242</span>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button variant="outline" className="rounded-lg border-border/50">Update payment</Button>
          <Button variant="outline" className="rounded-lg border-border/50">View invoices</Button>
        </div>
      </div>

      
      <div className="rounded-xl border border-border/50 bg-white/[0.02] p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell size={16} className="text-muted-foreground" />
          <h3 className="font-medium text-foreground">Notifications</h3>
        </div>
        <div className="space-y-4">
          {[
            { label: 'Campaign completed', desc: 'When a campaign finishes collecting responses' },
            { label: 'Weekly digest', desc: 'Summary of campaign performance every Monday' },
            { label: 'New responses', desc: 'When viewers complete your interactive video' },
          ].map(n => (
            <div key={n.label} className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground">{n.label}</p>
                <p className="text-xs text-muted-foreground">{n.desc}</p>
              </div>
              <div className="w-10 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 relative cursor-pointer">
                <div className="absolute right-0.5 top-0.5 size-4 rounded-full bg-emerald-400 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>

      
      <div className="rounded-xl border border-border/50 bg-white/[0.02] p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={16} className="text-muted-foreground" />
          <h3 className="font-medium text-foreground">Security</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-border/30">
            <div>
              <p className="text-sm text-foreground">Two-factor authentication</p>
              <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
            </div>
            <Button variant="outline" className="rounded-lg border-border/50 text-xs">Enable</Button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm text-foreground">Active sessions</p>
              <p className="text-xs text-muted-foreground">Manage your logged-in devices</p>
            </div>
            <Button variant="outline" className="rounded-lg border-border/50 text-xs">Manage</Button>
          </div>
        </div>
      </div>

      
      <div className="rounded-xl border border-border/50 bg-white/[0.02] p-6">
        <div className="flex items-center gap-2 mb-4">
          <Palette size={16} className="text-muted-foreground" />
          <h3 className="font-medium text-foreground">Branding</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">Customize how your campaigns look to viewers.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Brand color</label>
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-violet-500 border border-border/50" />
              <input defaultValue="#8b5cf6" className="flex-1 h-10 rounded-lg border border-border/50 bg-white/[0.02] px-3 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-white/10" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Logo URL</label>
            <input placeholder="https://..." className="w-full h-10 rounded-lg border border-border/50 bg-white/[0.02] px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-white/10" />
          </div>
        </div>
      </div>
    </div>
  )
}
