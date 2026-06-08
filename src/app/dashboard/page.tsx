'use client'
import Link from 'next/link'
import { Plus, TrendingUp, TrendingDown, Video, Users, Clock, Target, Play, Globe, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const stats = [
  { label: 'Videos Created', value: '12', change: '+3', trend: 'up', icon: Video },
  { label: 'Viewer Sessions', value: '4,231', change: '+18%', trend: 'up', icon: Users },
  { label: 'Completion Rate', value: '78%', change: '+5%', trend: 'up', icon: Target },
  { label: 'Avg Watch Time', value: '3:42', change: '-0:12', trend: 'down', icon: Clock },
]

const chartData = [
  { day: 'Mon', views: 120, responses: 45 },
  { day: 'Tue', views: 180, responses: 72 },
  { day: 'Wed', views: 250, responses: 98 },
  { day: 'Thu', views: 220, responses: 85 },
  { day: 'Fri', views: 380, responses: 150 },
  { day: 'Sat', views: 290, responses: 110 },
  { day: 'Sun', views: 340, responses: 130 },
]

const recentCampaigns = [
  { name: 'Product Onboarding Q4', views: 1342, completion: 82, status: 'active', updated: '2h ago' },
  { name: 'Customer Feedback Survey', views: 891, completion: 76, status: 'active', updated: '5h ago' },
  { name: 'Security Training Module', views: 456, completion: 91, status: 'completed', updated: '1d ago' },
  { name: 'Feature Validation: AI Chat', views: 234, completion: 68, status: 'draft', updated: '3d ago' },
]

const insights = [
  { icon: Globe, label: 'Top Region', value: 'United States', sub: '34% of viewers' },
  { icon: Clock, label: 'Best Hour', value: '2:00 PM', sub: 'Highest engagement' },
  { icon: Play, label: 'Most Replayed', value: '1:24 - 2:08', sub: 'Product Onboarding Q4' },
  { icon: Zap, label: 'Top Campaign', value: 'Product Onboarding', sub: '82% completion' },
]

export default function DashboardPage() {
  return (
    <div className="space-y-10 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Welcome back, Alex</h1>
          <p className="text-sm text-muted-foreground mt-1">Here&apos;s what&apos;s happening with your campaigns.</p>
        </div>
        <Link href="/dashboard/campaigns">
          <Button className="rounded-xl h-10 px-5 gap-2">
            <Plus size={16} />
            Create Campaign
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="group rounded-xl border border-border/50 bg-white/[0.02] p-5 hover:bg-white/[0.04] hover:border-border transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="size-9 rounded-lg bg-white/[0.04] flex items-center justify-center">
                <stat.icon size={16} className="text-muted-foreground" />
              </div>
              <span className={`text-xs font-medium flex items-center gap-1 ${stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                {stat.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="rounded-xl border border-border/50 bg-white/[0.02] p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-medium text-foreground">Views & Responses</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Last 7 days</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-white/60" />Views</span>
            <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-emerald-400" />Responses</span>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="viewsG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </linearGradient>
                <linearGradient id="responsesG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(52,211,153,0.2)" />
                  <stop offset="100%" stopColor="rgba(52,211,153,0)" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} />
              <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px', color: '#fafafa' }} />
              <Area type="monotone" dataKey="views" stroke="rgba(255,255,255,0.5)" strokeWidth={2} fill="url(#viewsG)" />
              <Area type="monotone" dataKey="responses" stroke="#34d399" strokeWidth={2} fill="url(#responsesG)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights + Recent */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Insights */}
        <div className="space-y-3">
          {insights.map(item => (
            <div key={item.label} className="rounded-xl border border-border/50 bg-white/[0.02] p-4 hover:bg-white/[0.04] transition-colors">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
                  <item.icon size={14} className="text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{item.value}</p>
                  <p className="text-xs text-muted-foreground">{item.label} · {item.sub}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Campaigns */}
        <div className="lg:col-span-2 rounded-xl border border-border/50 bg-white/[0.02] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-foreground">Recent Campaigns</h3>
            <Link href="/dashboard/campaigns" className="text-xs text-muted-foreground hover:text-foreground transition-colors">View all →</Link>
          </div>
          <div className="space-y-2">
            {recentCampaigns.map(c => (
              <div key={c.name} className="flex items-center justify-between py-3 border-b border-border/30 last:border-0 last:pb-0 first:pt-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-9 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
                    <Video size={14} className="text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.views.toLocaleString()} views · {c.completion}% completion</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-muted-foreground hidden sm:block">{c.updated}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    c.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
                    c.status === 'completed' ? 'bg-blue-500/10 text-blue-400' :
                    'bg-white/[0.06] text-muted-foreground'
                  }`}>{c.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
