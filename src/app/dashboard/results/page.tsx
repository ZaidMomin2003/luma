'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Download, Brain, ChevronRight, ArrowLeft, Eye, Users, Clock, Target, Globe, TrendingUp, Play, BarChart3, MoreHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

type Campaign = { id: number; name: string; sessions: number; completion: number; avgTime: string; engagement: number; status: string }

const campaigns: Campaign[] = [
  { id: 1, name: 'Product Onboarding Q4', sessions: 1342, completion: 82, avgTime: '3:24', engagement: 94, status: 'active' },
  { id: 2, name: 'Customer Feedback Survey', sessions: 891, completion: 76, avgTime: '5:12', engagement: 87, status: 'active' },
  { id: 3, name: 'Security Training Module', sessions: 456, completion: 91, avgTime: '8:45', engagement: 96, status: 'completed' },
  { id: 4, name: 'Employee Satisfaction Q1', sessions: 723, completion: 85, avgTime: '4:02', engagement: 91, status: 'active' },
]

export default function ResultsPage() {
  const [selected, setSelected] = useState<Campaign | null>(null)

  return (
    <div className="space-y-10 max-w-7xl">
      <AnimatePresence mode="wait">
        {selected ? (
          <motion.div key="detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
            <CampaignDetail campaign={selected} onBack={() => setSelected(null)} />
          </motion.div>
        ) : (
          <motion.div key="list" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.25 }}>
            <CampaignList campaigns={campaigns} onSelect={setSelected} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function CampaignList({ campaigns, onSelect }: { campaigns: Campaign[]; onSelect: (c: Campaign) => void }) {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Results</h1>
          <p className="text-sm text-muted-foreground mt-1.5">Campaign analytics and viewer insights</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl h-10 gap-2 border-white/[0.08]"><Download size={14} /> Export</Button>
          <Button className="rounded-xl h-10 gap-2"><Brain size={14} /> AI Insights</Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input placeholder="Search campaigns..." className="w-full h-10 rounded-xl border border-white/[0.06] bg-white/[0.02] pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-white/10 transition-all" />
        </div>
        <Button variant="outline" className="rounded-xl h-10 gap-2 border-white/[0.06]"><Filter size={14} /> Filter</Button>
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-5 py-3">Campaign</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-5 py-3">Sessions</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-5 py-3">Completion</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-5 py-3 hidden md:table-cell">Avg Time</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-5 py-3 hidden lg:table-cell">Engagement</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-5 py-3">Status</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map(c => (
                <tr key={c.id} onClick={() => onSelect(c)} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors cursor-pointer">
                  <td className="px-5 py-4"><p className="text-sm font-medium text-foreground">{c.name}</p></td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{c.sessions.toLocaleString()}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-white/[0.06] rounded-full overflow-hidden"><div className="h-full bg-emerald-500/60 rounded-full" style={{ width: `${c.completion}%` }} /></div>
                      <span className="text-xs text-muted-foreground">{c.completion}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-muted-foreground hidden md:table-cell">{c.avgTime}</td>
                  <td className="px-5 py-4 text-sm text-muted-foreground hidden lg:table-cell">{c.engagement}/100</td>
                  <td className="px-5 py-4">
                    <span className={cn('text-xs px-2 py-0.5 rounded-full', c.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400')}>{c.status}</span>
                  </td>
                  <td className="px-5 py-4"><ChevronRight size={14} className="text-muted-foreground" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
const viewsData = [
  { day: 'Mon', views: 142, responses: 58 },
  { day: 'Tue', views: 198, responses: 82 },
  { day: 'Wed', views: 267, responses: 112 },
  { day: 'Thu', views: 234, responses: 95 },
  { day: 'Fri', views: 312, responses: 140 },
  { day: 'Sat', views: 189, responses: 76 },
  { day: 'Sun', views: 256, responses: 108 },
]

const questionData = [
  { q: 'Q1', correct: 89, incorrect: 11 },
  { q: 'Q2', correct: 72, incorrect: 28 },
  { q: 'Q3', correct: 94, incorrect: 6 },
  { q: 'Q4', correct: 65, incorrect: 35 },
  { q: 'Q5', correct: 81, incorrect: 19 },
  { q: 'Q6', correct: 77, incorrect: 23 },
]

const regionData = [
  { region: 'US', viewers: 520 },
  { region: 'UK', viewers: 280 },
  { region: 'DE', viewers: 190 },
  { region: 'IN', viewers: 160 },
  { region: 'BR', viewers: 110 },
  { region: 'JP', viewers: 82 },
]

const hourlyData = [
  { hour: '6am', s: 8 }, { hour: '8am', s: 32 }, { hour: '10am', s: 67 },
  { hour: '12pm', s: 89 }, { hour: '2pm', s: 112 }, { hour: '4pm', s: 98 },
  { hour: '6pm', s: 74 }, { hour: '8pm', s: 45 }, { hour: '10pm', s: 21 },
]

const funnelData = [
  { stage: 'Started Video', value: 1342 },
  { stage: 'Q1 Reached', value: 1240 },
  { stage: 'Midpoint', value: 1080 },
  { stage: 'Q4 Reached', value: 920 },
  { stage: 'Completed', value: 812 },
]

const viewers = [
  { name: 'Sarah Chen', email: 'sarah@acme.com', score: '6/6', time: '3:45', date: '2h ago' },
  { name: 'Mike Johnson', email: 'mike@corp.io', score: '5/6', time: '4:12', date: '5h ago' },
  { name: 'Emily Davis', email: 'emily@startup.co', score: '6/6', time: '3:22', date: '1d ago' },
  { name: 'James Wilson', email: 'james@big.co', score: '4/6', time: '5:01', date: '1d ago' },
  { name: 'Lisa Park', email: 'lisa@design.io', score: '5/6', time: '3:58', date: '2d ago' },
]

function CampaignDetail({ campaign, onBack }: { campaign: Campaign; onBack: () => void }) {
  const tooltipStyle = { backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '11px', color: '#fafafa' }

  return (
    <div className="space-y-8">
      
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 rounded-lg hover:bg-white/[0.04] transition-colors">
          <ArrowLeft size={18} className="text-muted-foreground" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-foreground">{campaign.name}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Detailed analytics and viewer insights</p>
        </div>
        <Button variant="outline" className="rounded-xl border-white/[0.08] gap-2 hidden sm:flex"><Download size={13} /> Export</Button>
        <Button className="rounded-xl gap-2"><Brain size={13} /> AI Summary</Button>
      </div>

      
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { icon: Eye, label: 'Views', value: campaign.sessions.toLocaleString() },
          { icon: Users, label: 'Responses', value: Math.round(campaign.sessions * 0.6).toLocaleString() },
          { icon: Clock, label: 'Avg Time', value: campaign.avgTime },
          { icon: Target, label: 'Completion', value: `${campaign.completion}%` },
          { icon: TrendingUp, label: 'Engagement', value: `${campaign.engagement}/100` },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <s.icon size={14} className="text-muted-foreground mb-2" />
            <p className="text-lg font-semibold text-foreground">{s.value}</p>
            <p className="text-[11px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-medium text-foreground">Views & Responses</h3>
            <p className="text-[11px] text-muted-foreground">Last 7 days</p>
          </div>
          <div className="flex gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-white/50" />Views</span>
            <span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-emerald-400" />Responses</span>
          </div>
        </div>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={viewsData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="vG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="rgba(255,255,255,0.1)" /><stop offset="100%" stopColor="rgba(255,255,255,0)" /></linearGradient>
                <linearGradient id="rG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="rgba(52,211,153,0.15)" /><stop offset="100%" stopColor="rgba(52,211,153,0)" /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#71717a' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#71717a' }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="views" stroke="rgba(255,255,255,0.4)" strokeWidth={1.5} fill="url(#vG)" />
              <Area type="monotone" dataKey="responses" stroke="#34d399" strokeWidth={1.5} fill="url(#rG)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      
      <div className="grid lg:grid-cols-2 gap-4">
        
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
          <h3 className="text-sm font-medium text-foreground mb-1">Question Performance</h3>
          <p className="text-[11px] text-muted-foreground mb-5">Correct vs incorrect per question</p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={questionData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="q" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#71717a' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#71717a' }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="correct" fill="rgba(139,92,246,0.5)" radius={[3, 3, 0, 0]} />
                <Bar dataKey="incorrect" fill="rgba(255,255,255,0.06)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
          <h3 className="text-sm font-medium text-foreground mb-1">Viewers by Region</h3>
          <p className="text-[11px] text-muted-foreground mb-5">Geographic distribution</p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="region" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#71717a' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#71717a' }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="viewers" fill="rgba(255,255,255,0.1)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      
      <div className="grid lg:grid-cols-2 gap-4">
        
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
          <h3 className="text-sm font-medium text-foreground mb-1">Sessions by Hour</h3>
          <p className="text-[11px] text-muted-foreground mb-5">Peak engagement times</p>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#71717a' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#71717a' }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="s" fill="rgba(52,211,153,0.3)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
          <h3 className="text-sm font-medium text-foreground mb-1">Completion Funnel</h3>
          <p className="text-[11px] text-muted-foreground mb-5">Viewer drop-off analysis</p>
          <div className="space-y-2.5">
            {funnelData.map((f, i) => (
              <div key={f.stage} className="flex items-center gap-3">
                <span className="text-[10px] text-muted-foreground w-20 shrink-0 truncate">{f.stage}</span>
                <div className="flex-1 h-6 bg-white/[0.03] rounded-md overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(f.value / funnelData[0].value) * 100}%` }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="h-full bg-gradient-to-r from-violet-500/20 to-violet-500/5 rounded-md flex items-center px-2"
                  >
                    <span className="text-[10px] font-medium text-foreground">{f.value.toLocaleString()}</span>
                  </motion.div>
                </div>
                <span className="text-[10px] text-muted-foreground w-8 text-right">{Math.round((f.value / funnelData[0].value) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      
      <ViewerResponsesTable />
    </div>
  )
}

const questions = [
  { id: 'q1', text: 'What is the primary benefit discussed?', shortLabel: 'Q1: Primary benefit' },
  { id: 'q2', text: 'Did the speaker mention integration?', shortLabel: 'Q2: Integration' },
  { id: 'q3', text: 'Which features were highlighted?', shortLabel: 'Q3: Features' },
  { id: 'q4', text: 'Would you recommend this?', shortLabel: 'Q4: Recommend' },
  { id: 'q5', text: 'What was the main takeaway?', shortLabel: 'Q5: Takeaway' },
  { id: 'q6', text: 'Rate the clarity of content', shortLabel: 'Q6: Clarity' },
]

const viewerResponseData = [
  { id: 1, name: 'Sarah Chen', email: 'sarah@acme.com', score: '6/6', time: '3:45', completed: true, date: '2h ago', answers: ['AI automation', 'Yes', 'Auto-scaling, API', 'Yes', 'Efficiency gains', 'Very clear'] },
  { id: 2, name: 'Mike Johnson', email: 'mike@corp.io', score: '5/6', time: '4:12', completed: true, date: '5h ago', answers: ['Cost reduction', 'Yes', 'Dashboard, Reports', 'Yes', 'Better analytics', 'Clear'] },
  { id: 3, name: 'Emily Davis', email: 'emily@startup.co', score: '6/6', time: '3:22', completed: true, date: '1d ago', answers: ['AI automation', 'Yes', 'Auto-scaling, API', 'Yes', 'Time savings', 'Very clear'] },
  { id: 4, name: 'James Wilson', email: 'james@big.co', score: '4/6', time: '5:01', completed: false, date: '1d ago', answers: ['Not sure', 'No', 'Dashboard', 'No', 'Needs more detail', 'Somewhat'] },
  { id: 5, name: 'Lisa Park', email: 'lisa@design.io', score: '5/6', time: '3:58', completed: true, date: '2d ago', answers: ['Productivity', 'Yes', 'API, Webhooks', 'Yes', 'Great product', 'Clear'] },
  { id: 6, name: 'Alex Turner', email: 'alex@media.com', score: '6/6', time: '3:30', completed: true, date: '2d ago', answers: ['AI automation', 'Yes', 'All features', 'Yes', 'Must-have tool', 'Very clear'] },
  { id: 7, name: 'Priya Sharma', email: 'priya@tech.in', score: '4/6', time: '4:45', completed: true, date: '3d ago', answers: ['Speed', 'Yes', 'Reports', 'No', 'Good overview', 'Moderate'] },
]

function ViewerResponsesTable() {
  const [search, setSearch] = useState('')
  const [selectedViewer, setSelectedViewer] = useState<typeof viewerResponseData[0] | null>(null)

  const filtered = viewerResponseData.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-sm font-medium text-foreground">Viewer Responses</h3>
            <p className="text-[11px] text-muted-foreground">Individual answers per question</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search viewer..."
                className="h-8 w-48 rounded-lg border border-white/[0.06] bg-white/[0.02] pl-8 pr-3 text-xs placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-white/10 transition-all"
              />
            </div>
            <Button variant="outline" size="sm" className="border-white/[0.08] gap-1.5 text-xs h-8"><Download size={11} /> CSV</Button>
          </div>
        </div>

        <div className="overflow-x-auto relative">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wide pb-3 pr-4 whitespace-nowrap sticky left-0 bg-[#111113] z-10">Viewer</th>
                {questions.map(q => (
                  <th key={q.id} className="text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wide pb-3 px-2 whitespace-nowrap max-w-[120px]" title={q.text}>
                    {q.shortLabel}
                  </th>
                ))}
                <th className="text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wide pb-3 pl-2">Score</th>
                <th className="pb-3 w-8"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(v => (
                <tr key={v.id} className="border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 pr-4 sticky left-0 bg-[#0c0c0e] z-10">
                    <p className="text-xs font-medium text-foreground whitespace-nowrap">{v.name}</p>
                    <p className="text-[10px] text-muted-foreground">{v.email}</p>
                  </td>
                  {v.answers.map((ans, i) => (
                    <td key={i} className="py-3 px-2">
                      <span className="text-[11px] text-muted-foreground max-w-[100px] truncate block" title={ans}>{ans}</span>
                    </td>
                  ))}
                  <td className="py-3 pl-2">
                    <span className="text-xs font-medium text-foreground">{v.score}</span>
                  </td>
                  <td className="py-3 pl-2">
                    <button
                      onClick={() => setSelectedViewer(v)}
                      className="p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors"
                    >
                      <MoreHorizontal size={13} className="text-muted-foreground" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={questions.length + 3} className="py-8 text-center text-xs text-muted-foreground">No viewers match your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      
      <AnimatePresence>
        {selectedViewer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedViewer(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-[#111113] border border-white/[0.08] rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-sm font-bold text-black">
                    {selectedViewer.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{selectedViewer.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedViewer.email}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedViewer(null)} className="p-1.5 rounded-lg hover:bg-white/[0.06]">
                  <X size={16} className="text-muted-foreground" />
                </button>
              </div>

              
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-3 text-center">
                  <p className="text-lg font-semibold text-foreground">{selectedViewer.score}</p>
                  <p className="text-[10px] text-muted-foreground">Score</p>
                </div>
                <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-3 text-center">
                  <p className="text-lg font-semibold text-foreground">{selectedViewer.time}</p>
                  <p className="text-[10px] text-muted-foreground">Watch Time</p>
                </div>
                <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-3 text-center">
                  <p className="text-lg font-semibold text-foreground">{selectedViewer.completed ? '✓' : '✗'}</p>
                  <p className="text-[10px] text-muted-foreground">{selectedViewer.completed ? 'Completed' : 'Incomplete'}</p>
                </div>
              </div>

              
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Responses</h4>
              <div className="space-y-2.5">
                {questions.map((q, i) => (
                  <div key={q.id} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                    <p className="text-[11px] text-muted-foreground mb-1">{q.text}</p>
                    <p className="text-sm text-foreground">{selectedViewer.answers[i]}</p>
                  </div>
                ))}
              </div>

              <p className="text-[10px] text-muted-foreground mt-4 text-right">Responded {selectedViewer.date}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
