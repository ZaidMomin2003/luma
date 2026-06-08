'use client'
import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Trash2, Play, Globe, Settings, Plus, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
const campaignData: Record<string, any> = {
  '1': { name: 'Product Onboarding Q4', description: 'Onboarding flow for new customers', language: 'English', status: 'active', videoUrl: '/demo.mp4', questions: [
    { id: 'q1', timestamp: '0:45', text: 'What is the primary benefit discussed?', type: 'mcq', required: true },
    { id: 'q2', timestamp: '1:22', text: 'Did the speaker mention integration support?', type: 'yesno', required: true },
    { id: 'q3', timestamp: '2:08', text: 'Which features were highlighted as new?', type: 'multi', required: false },
    { id: 'q4', timestamp: '2:55', text: 'Name the product mentioned', type: 'oneword', required: true },
    { id: 'q5', timestamp: '3:30', text: 'Would you recommend this to a colleague?', type: 'yesno', required: false },
    { id: 'q6', timestamp: '4:10', text: 'What was the main takeaway?', type: 'mcq', required: true },
    { id: 'q7', timestamp: '4:45', text: 'Rate the clarity of the presentation', type: 'mcq', required: true },
    { id: 'q8', timestamp: '5:20', text: 'Any additional feedback?', type: 'oneword', required: false },
  ]},
  '2': { name: 'Customer Feedback Survey', description: 'Post-purchase feedback collection', language: 'English', status: 'active', videoUrl: '/demo.mp4', questions: [
    { id: 'q1', timestamp: '0:30', text: 'How did you hear about us?', type: 'mcq', required: true },
    { id: 'q2', timestamp: '1:15', text: 'Was the purchase process smooth?', type: 'yesno', required: true },
    { id: 'q3', timestamp: '2:00', text: 'Rate your overall experience', type: 'mcq', required: true },
  ]},
}

export default function CampaignEditPage() {
  const params = useParams()
  const id = params.id as string
  const campaign = campaignData[id] || campaignData['1']

  const [name, setName] = useState(campaign.name)
  const [description, setDescription] = useState(campaign.description)
  const [language, setLanguage] = useState(campaign.language)
  const [questions, setQuestions] = useState(campaign.questions)

  const toggleRequired = (qId: string) => {
    setQuestions((prev: any[]) => prev.map(q => q.id === qId ? { ...q, required: !q.required } : q))
  }

  const removeQuestion = (qId: string) => {
    setQuestions((prev: any[]) => prev.filter(q => q.id !== qId))
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/campaigns" className="p-2 rounded-lg hover:bg-white/[0.04] transition-colors">
            <ArrowLeft size={18} className="text-muted-foreground" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Edit Campaign</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Last saved 2 hours ago</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/play/${id}`} target="_blank">
            <Button variant="outline" className="rounded-xl border-white/[0.08] gap-2 h-9">
              <Play size={13} /> Preview
            </Button>
          </Link>
          <Button className="rounded-xl gap-2 h-9">
            <Save size={13} /> Save
          </Button>
        </div>
      </div>

      
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 space-y-5">
        <div className="flex items-center gap-2 mb-2">
          <Settings size={15} className="text-muted-foreground" />
          <h2 className="text-sm font-medium text-foreground">Campaign Details</h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Campaign Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full h-10 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500/30 transition-all"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500/30 transition-all resize-none"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Language</label>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="w-full h-10 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all appearance-none"
            >
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
              <option>Japanese</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Status</label>
            <div className="h-10 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 flex items-center">
              <span className={cn('text-xs px-2 py-0.5 rounded-full',
                campaign.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
                campaign.status === 'completed' ? 'bg-blue-500/10 text-blue-400' :
                'bg-white/[0.06] text-muted-foreground'
              )}>{campaign.status}</span>
            </div>
          </div>
        </div>
      </div>

      
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Globe size={15} className="text-muted-foreground" />
            <h2 className="text-sm font-medium text-foreground">Questions ({questions.length})</h2>
          </div>
          <Button variant="outline" size="sm" className="border-white/[0.08] gap-1.5 text-xs h-8">
            <Plus size={12} /> Add Question
          </Button>
        </div>

        <div className="space-y-2">
          {questions.map((q: any, i: number) => (
            <div key={q.id} className="flex items-center gap-3 p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.01] group hover:bg-white/[0.03] transition-colors">
              <GripVertical size={14} className="text-muted-foreground/30 shrink-0 cursor-grab" />
              <span className="text-[10px] text-muted-foreground font-mono w-10 shrink-0">{q.timestamp}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">{q.text}</p>
                <span className="text-[10px] text-muted-foreground capitalize">{q.type === 'mcq' ? 'Multiple Choice' : q.type === 'yesno' ? 'Yes/No' : q.type === 'oneword' ? 'Short Answer' : 'Multi-Select'}</span>
              </div>
              <button
                onClick={() => toggleRequired(q.id)}
                className={cn('text-[10px] px-2 py-1 rounded-md border transition-colors shrink-0',
                  q.required ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-white/[0.06] text-muted-foreground hover:text-foreground'
                )}
              >
                {q.required ? 'Required' : 'Optional'}
              </button>
              <button onClick={() => removeQuestion(q.id)} className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 transition-all shrink-0">
                <Trash2 size={13} className="text-red-400" />
              </button>
            </div>
          ))}
        </div>
      </div>

      
      <div className="rounded-xl border border-red-500/20 bg-red-500/[0.02] p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Delete Campaign</p>
            <p className="text-xs text-muted-foreground mt-0.5">This action cannot be undone. All data will be permanently removed.</p>
          </div>
          <Button variant="outline" className="rounded-lg border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs">
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}
