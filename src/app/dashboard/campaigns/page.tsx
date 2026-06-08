'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Plus, Search, Filter, Video, MoreHorizontal, Globe, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const campaigns = [
  { id: 1, name: 'Product Onboarding Q4', sessions: 1342, completion: 82, languages: 3, status: 'active', updated: '2 hours ago', thumb: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=225&fit=crop' },
  { id: 2, name: 'Customer Feedback Survey', sessions: 891, completion: 76, languages: 1, status: 'active', updated: '5 hours ago', thumb: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=225&fit=crop' },
  { id: 3, name: 'Security Training Module', sessions: 456, completion: 91, languages: 5, status: 'completed', updated: '1 day ago', thumb: 'https://images.unsplash.com/photo-1563986768609-322da13575f2?w=400&h=225&fit=crop' },
  { id: 4, name: 'Feature Validation: AI Chat', sessions: 234, completion: 68, languages: 1, status: 'draft', updated: '3 days ago', thumb: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=225&fit=crop' },
  { id: 5, name: 'Employee Satisfaction Q1', sessions: 723, completion: 85, languages: 2, status: 'active', updated: '6 hours ago', thumb: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=225&fit=crop' },
  { id: 6, name: 'Quarterly Review Prep', sessions: 67, completion: 45, languages: 1, status: 'draft', updated: '1 day ago', thumb: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=225&fit=crop' },
]

export default function CampaignsPage() {
  return (
    <div className="space-y-10 max-w-7xl">
      {/* Header */}
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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search campaigns..."
            className="w-full h-10 rounded-xl border border-white/[0.06] bg-white/[0.02] pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-white/10 transition-all"
          />
        </div>
        <Button variant="outline" className="rounded-xl h-10 gap-2 border-white/[0.06]">
          <Filter size={14} />
          Filter
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns.map(c => (
          <div key={c.id} className="group rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-200 cursor-pointer">
            {/* Thumbnail */}
            <div className="aspect-video relative overflow-hidden bg-zinc-900">
              <img src={c.thumb} alt={c.name} className="size-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <span className={cn('absolute top-2.5 right-2.5 text-[10px] px-2 py-0.5 rounded-full font-medium',
                c.status === 'active' ? 'bg-emerald-500/20 text-emerald-300 backdrop-blur-sm' :
                c.status === 'completed' ? 'bg-blue-500/20 text-blue-300 backdrop-blur-sm' :
                'bg-white/10 text-white/70 backdrop-blur-sm'
              )}>{c.status}</span>
              <button className="absolute top-2.5 left-2.5 p-1.5 rounded-lg bg-black/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 hover:bg-black/50 transition-all">
                <MoreHorizontal size={14} className="text-white/80" />
              </button>
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="font-medium text-foreground text-sm mb-1 truncate">{c.name}</h3>
              <p className="text-xs text-muted-foreground mb-3">{c.updated}</p>

              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1"><Users size={11} />{c.sessions.toLocaleString()}</span>
                <span className="flex items-center gap-1"><Globe size={11} />{c.languages} lang</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500/80 to-emerald-500/40 rounded-full" style={{ width: `${c.completion}%` }} />
                </div>
                <span className="text-[11px] text-muted-foreground">{c.completion}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
