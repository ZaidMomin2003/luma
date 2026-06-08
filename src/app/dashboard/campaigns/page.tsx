'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Plus, Search, Filter, Video, Globe, Users, ChevronRight, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const campaigns = [
  { id: '1', name: 'Product Onboarding Q4', sessions: 1342, completion: 82, languages: 3, status: 'active', updated: '2 hours ago', questions: 8 },
  { id: '2', name: 'Customer Feedback Survey', sessions: 891, completion: 76, languages: 1, status: 'active', updated: '5 hours ago', questions: 6 },
  { id: '3', name: 'Security Training Module', sessions: 456, completion: 91, languages: 5, status: 'completed', updated: '1 day ago', questions: 12 },
  { id: '4', name: 'Feature Validation: AI Chat', sessions: 234, completion: 68, languages: 1, status: 'draft', updated: '3 days ago', questions: 5 },
  { id: '5', name: 'Employee Satisfaction Q1', sessions: 723, completion: 85, languages: 2, status: 'active', updated: '6 hours ago', questions: 9 },
  { id: '6', name: 'Quarterly Review Prep', sessions: 67, completion: 45, languages: 1, status: 'draft', updated: '1 day ago', questions: 4 },
]

export default function CampaignsPage() {
  const [search, setSearch] = useState('')

  const filtered = campaigns.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-10 max-w-7xl">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Campaigns</h1>
          <p className="text-sm text-muted-foreground mt-1.5">Manage your interactive video campaigns</p>
        </div>
        <Link href="/dashboard/campaigns/new">
          <Button className="rounded-xl h-10 px-5 gap-2">
            <Plus size={16} />
            New Campaign
          </Button>
        </Link>
      </div>

      
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search campaigns..."
            className="w-full h-10 rounded-xl border border-white/[0.06] bg-white/[0.02] pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-white/10 transition-all"
          />
        </div>
        <Button variant="outline" className="rounded-xl h-10 gap-2 border-white/[0.06]">
          <Filter size={14} />
          Filter
        </Button>
      </div>

      
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wide px-5 py-3">Campaign</th>
              <th className="text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wide px-5 py-3 hidden sm:table-cell">Sessions</th>
              <th className="text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wide px-5 py-3 hidden md:table-cell">Questions</th>
              <th className="text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wide px-5 py-3 hidden md:table-cell">Completion</th>
              <th className="text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wide px-5 py-3 hidden lg:table-cell">Languages</th>
              <th className="text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wide px-5 py-3">Status</th>
              <th className="px-5 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr
                key={c.id}
                className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors group cursor-pointer"
              >
                <td className="px-5 py-4">
                  <Link href={`/dashboard/campaigns/${c.id}`} className="block">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
                        <Video size={15} className="text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{c.name}</p>
                        <p className="text-[11px] text-muted-foreground">{c.updated}</p>
                      </div>
                    </div>
                  </Link>
                </td>
                <td className="px-5 py-4 hidden sm:table-cell">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Users size={12} />
                    {c.sessions.toLocaleString()}
                  </div>
                </td>
                <td className="px-5 py-4 hidden md:table-cell">
                  <span className="text-sm text-muted-foreground">{c.questions}</span>
                </td>
                <td className="px-5 py-4 hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500/60 rounded-full" style={{ width: `${c.completion}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground">{c.completion}%</span>
                  </div>
                </td>
                <td className="px-5 py-4 hidden lg:table-cell">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Globe size={12} />
                    {c.languages}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className={cn('text-xs px-2 py-0.5 rounded-full',
                    c.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
                    c.status === 'completed' ? 'bg-blue-500/10 text-blue-400' :
                    'bg-white/[0.06] text-muted-foreground'
                  )}>{c.status}</span>
                </td>
                <td className="px-5 py-4">
                  <Link href={`/dashboard/campaigns/${c.id}`}>
                    <ChevronRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="py-12 text-center text-sm text-muted-foreground">No campaigns match your search.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
