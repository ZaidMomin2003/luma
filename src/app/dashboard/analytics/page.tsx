'use client'
import { Globe, Clock, TrendingUp, Users, BarChart3 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const regionData = [
  { region: 'US', viewers: 1420 },
  { region: 'UK', viewers: 680 },
  { region: 'DE', viewers: 520 },
  { region: 'IN', viewers: 890 },
  { region: 'BR', viewers: 340 },
  { region: 'JP', viewers: 280 },
]

const hourlyData = [
  { hour: '6am', sessions: 12 }, { hour: '8am', sessions: 45 }, { hour: '10am', sessions: 89 },
  { hour: '12pm', sessions: 120 }, { hour: '2pm', sessions: 156 }, { hour: '4pm', sessions: 134 },
  { hour: '6pm', sessions: 98 }, { hour: '8pm', sessions: 67 }, { hour: '10pm', sessions: 34 },
]

const completionFunnel = [
  { stage: 'Started', value: 4231 },
  { stage: 'Q1 Answered', value: 3890 },
  { stage: 'Midpoint', value: 3200 },
  { stage: 'Q5 Answered', value: 2800 },
  { stage: 'Completed', value: 2450 },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Deep insights across all campaigns</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Viewers', value: '4,231', icon: Users },
          { label: 'Avg Engagement', value: '92/100', icon: TrendingUp },
          { label: 'Top Region', value: 'United States', icon: Globe },
          { label: 'Peak Hour', value: '2:00 PM', icon: Clock },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-border/50 bg-white/[0.02] p-4">
            <div className="size-8 rounded-lg bg-white/[0.04] flex items-center justify-center mb-3">
              <s.icon size={14} className="text-muted-foreground" />
            </div>
            <p className="text-lg font-semibold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Region */}
        <div className="rounded-xl border border-border/50 bg-white/[0.02] p-6">
          <h3 className="font-medium text-foreground mb-1">Viewers by Region</h3>
          <p className="text-xs text-muted-foreground mb-6">Geographic distribution</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="region" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#71717a' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#71717a' }} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px', color: '#fafafa' }} />
                <Bar dataKey="viewers" fill="rgba(255,255,255,0.15)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly */}
        <div className="rounded-xl border border-border/50 bg-white/[0.02] p-6">
          <h3 className="font-medium text-foreground mb-1">Sessions by Hour</h3>
          <p className="text-xs text-muted-foreground mb-6">Best performing times</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#71717a' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#71717a' }} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px', color: '#fafafa' }} />
                <Bar dataKey="sessions" fill="rgba(52,211,153,0.4)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Completion Funnel */}
      <div className="rounded-xl border border-border/50 bg-white/[0.02] p-6">
        <h3 className="font-medium text-foreground mb-1">Completion Funnel</h3>
        <p className="text-xs text-muted-foreground mb-6">How viewers progress through campaigns</p>
        <div className="space-y-3">
          {completionFunnel.map((stage, i) => (
            <div key={stage.stage} className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground w-28 shrink-0">{stage.stage}</span>
              <div className="flex-1 h-8 bg-white/[0.03] rounded-lg overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-white/[0.08] to-white/[0.03] rounded-lg flex items-center px-3"
                  style={{ width: `${(stage.value / completionFunnel[0].value) * 100}%` }}
                >
                  <span className="text-xs font-medium text-foreground">{stage.value.toLocaleString()}</span>
                </div>
              </div>
              <span className="text-xs text-muted-foreground w-12 text-right">
                {Math.round((stage.value / completionFunnel[0].value) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
