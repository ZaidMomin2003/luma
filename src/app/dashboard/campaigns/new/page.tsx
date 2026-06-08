'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  ArrowRight, X, Check, Upload, Loader2, Plus, Trash2,
  ClipboardList, Package, GraduationCap, MessageCircle, GitBranch, Layers, Search, Beaker,
  Video, Sparkles, Play, Copy, ExternalLink,
  Clock, Brain, Wand2, Languages, BarChart3, Shield,
  CheckCircle2, CircleDot, TextCursorInput, ToggleLeft,
  Settings, ListChecks, Eye, Rocket
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const steps = [
  { num: 1, icon: Layers },
  { num: 2, icon: Upload },
  { num: 3, icon: Settings },
  { num: 4, icon: Brain },
  { num: 5, icon: ListChecks },
  { num: 6, icon: Rocket },
]

const useCases = [
  { icon: Package, label: 'Product Validation', desc: 'Test concepts with real viewers' },
  { icon: ClipboardList, label: 'Interactive Survey', desc: 'Collect feedback in-video' },
  { icon: GraduationCap, label: 'Employee Training', desc: 'Verify learning outcomes' },
  { icon: MessageCircle, label: 'Customer Feedback', desc: 'Understand your audience' },
  { icon: Beaker, label: 'Education & Learning', desc: 'Interactive course content' },
  { icon: GitBranch, label: 'Decision Making', desc: 'Help teams align faster' },
  { icon: Search, label: 'Market Research', desc: 'Validate with real data' },
  { icon: Layers, label: 'Other', desc: 'Custom use case' },
]

const questionTypes = [
  { id: 'mcq', icon: CheckCircle2, label: 'Multiple Choice', desc: 'Pick one from several options' },
  { id: 'yesno', icon: ToggleLeft, label: 'Yes / No', desc: 'Simple binary questions' },
  { id: 'oneword', icon: TextCursorInput, label: 'One Word Answer', desc: 'Short text response' },
  { id: 'multi', icon: CircleDot, label: 'Multi-Select', desc: 'Pick multiple correct answers' },
]

const processingStages = [
  { label: 'Transcript', icon: Brain },
  { label: 'Context', icon: Wand2 },
  { label: 'Questions', icon: Sparkles },
  { label: 'Timestamps', icon: Clock },
  { label: 'Translation', icon: Languages },
  { label: 'Analytics', icon: BarChart3 },
  { label: 'Finalizing', icon: Shield },
]

const defaultQuestions = [
  { id: 1, text: 'What is the primary benefit discussed in this segment?', type: 'mcq', timestamp: '0:45', required: true },
  { id: 2, text: 'Did the speaker mention integration support?', type: 'yesno', timestamp: '1:22', required: true },
  { id: 3, text: 'Which features were highlighted as new?', type: 'multi', timestamp: '2:08', required: false },
  { id: 4, text: 'What is the name of the new product?', type: 'oneword', timestamp: '2:55', required: true },
  { id: 5, text: 'Would you recommend this to a colleague?', type: 'yesno', timestamp: '3:30', required: false },
  { id: 6, text: 'What was the main takeaway from the demo?', type: 'mcq', timestamp: '4:10', required: true },
]

export default function NewCampaignPage() {
  const [step, setStep] = useState(1)
  const [selectedUseCase, setSelectedUseCase] = useState<string | null>(null)
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['mcq'])
  const [processingStage, setProcessingStage] = useState(0)
  const [questions, setQuestions] = useState(defaultQuestions)

  const toggleType = (id: string) => {
    setSelectedTypes(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id])
  }

  const toggleRequired = (id: number) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, required: !q.required } : q))
  }

  const removeQuestion = (id: number) => {
    setQuestions(prev => prev.filter(q => q.id !== id))
  }

  const next = () => {
    if (step === 3) {
      setStep(4)
      let stage = 0
      const interval = setInterval(() => {
        stage++
        setProcessingStage(stage)
        if (stage >= processingStages.length) {
          clearInterval(interval)
          setTimeout(() => setStep(5), 500)
        }
      }, 600)
      return
    }
    setStep(s => Math.min(s + 1, 6))
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#09090b] flex">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-emerald-500/[0.02] blur-[120px]" />
      </div>

      
      <div className="hidden md:flex w-16 shrink-0 flex-col items-center justify-center border-r border-white/[0.04] relative z-10">
        <Link href="/dashboard/campaigns" className="absolute top-4 left-1/2 -translate-x-1/2 p-2 rounded-lg hover:bg-white/[0.04] transition-colors">
          <X size={14} className="text-muted-foreground" />
        </Link>

        <div className="flex flex-col items-center gap-0">
          {steps.map((s, i) => (
            <div key={s.num} className="flex flex-col items-center">
              <motion.div
                animate={{
                  scale: step === s.num ? 1.15 : 1,
                }}
                className={cn(
                  'size-9 rounded-xl flex items-center justify-center transition-all duration-300',
                  step > s.num ? 'bg-emerald-500/15 border border-emerald-500/20' :
                  step === s.num ? 'bg-emerald-500/15 border border-emerald-500/30 shadow-[0_0_12px_rgba(139,92,246,0.15)]' :
                  'bg-white/[0.02] border border-white/[0.06]'
                )}
              >
                {step > s.num ? (
                  <Check size={13} className="text-emerald-400" />
                ) : (
                  <s.icon size={14} className={cn(step === s.num ? 'text-emerald-400' : 'text-muted-foreground/40')} />
                )}
              </motion.div>
              {i < steps.length - 1 && (
                <div className={cn('w-px h-6 transition-colors duration-300', step > s.num ? 'bg-emerald-500/25' : 'bg-white/[0.04]')} />
              )}
            </div>
          ))}
        </div>
      </div>

      
      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="md:hidden absolute top-4 right-4 z-20">
          <Link href="/dashboard/campaigns" className="p-2 rounded-lg hover:bg-white/[0.04] transition-colors">
            <X size={16} className="text-muted-foreground" />
          </Link>
        </div>

        <div className="min-h-full flex flex-col justify-center px-6 py-16 lg:px-16">
          <AnimatePresence mode="wait">
            {step === 1 && <Step key="1" onNext={next} disabled={!selectedUseCase}><StepUseCase selected={selectedUseCase} onSelect={setSelectedUseCase} /></Step>}
            {step === 2 && <Step key="2" onNext={next}><StepUpload /></Step>}
            {step === 3 && <Step key="3" onNext={next} disabled={selectedTypes.length === 0} label="Start AI Processing"><StepSettings selectedTypes={selectedTypes} toggleType={toggleType} /></Step>}
            {step === 4 && <Step key="4" hideButton><StepProcessing stage={processingStage} /></Step>}
            {step === 5 && <Step key="5" onNext={next} label="Publish Campaign"><StepReview questions={questions} toggleRequired={toggleRequired} removeQuestion={removeQuestion} /></Step>}
            {step === 6 && <Step key="6" hideButton><StepSuccess /></Step>}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function Step({ children, onNext, disabled, hideButton, label }: { children: React.ReactNode; onNext?: () => void; disabled?: boolean; hideButton?: boolean; label?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-3xl w-full mx-auto"
    >
      {children}
      {!hideButton && onNext && (
        <div className="mt-10">
          <Button onClick={onNext} disabled={disabled} className="rounded-xl h-11 px-6 gap-2">
            {label || 'Continue'} <ArrowRight size={14} />
          </Button>
        </div>
      )}
    </motion.div>
  )
}

function StepUseCase({ selected, onSelect }: { selected: string | null; onSelect: (v: string) => void }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-foreground mb-2">What are you creating?</h2>
      <p className="text-sm text-muted-foreground mb-8">Choose the type of interactive video experience.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {useCases.map(uc => (
          <button
            key={uc.label}
            onClick={() => onSelect(uc.label)}
            className={cn(
              'group relative p-5 rounded-xl border text-left transition-all duration-200',
              selected === uc.label
                ? 'border-emerald-500/40 bg-emerald-500/[0.06] ring-1 ring-emerald-500/20'
                : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1]'
            )}
          >
            <uc.icon size={20} className={cn('mb-3', selected === uc.label ? 'text-emerald-400' : 'text-muted-foreground')} />
            <p className="text-sm font-medium text-foreground">{uc.label}</p>
            <p className="text-xs text-muted-foreground mt-1">{uc.desc}</p>
            {selected === uc.label && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-3 right-3 size-5 rounded-full bg-emerald-500 flex items-center justify-center">
                <Check size={10} className="text-white" />
              </motion.div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

function StepUpload() {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-foreground mb-2">Upload your video</h2>
      <p className="text-sm text-muted-foreground mb-8">Drag and drop or browse. MP4, MOV, AVI up to 2GB.</p>
      <div className="border-2 border-dashed border-white/[0.08] rounded-2xl p-14 text-center hover:border-emerald-500/30 hover:bg-emerald-500/[0.02] transition-all duration-300 cursor-pointer group">
        <div className="size-14 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-500/10 transition-colors">
          <Upload size={22} className="text-muted-foreground group-hover:text-emerald-400 transition-colors" />
        </div>
        <p className="text-sm font-medium text-foreground mb-1">Drop your video here</p>
        <p className="text-xs text-muted-foreground">or click to browse files</p>
      </div>
      <div className="mt-5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 flex items-center gap-4">
        <div className="size-11 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
          <Video size={16} className="text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">product-onboarding-v2.mp4</p>
          <p className="text-xs text-muted-foreground">148 MB · 4:32 · 1080p</p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 shrink-0">Ready</span>
      </div>
    </div>
  )
}

function StepSettings({ selectedTypes, toggleType }: { selectedTypes: string[]; toggleType: (id: string) => void }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-foreground mb-2">Question Types & Settings</h2>
      <p className="text-sm text-muted-foreground mb-8">Select which question formats AI should generate.</p>

      
      <div className="grid sm:grid-cols-2 gap-3 mb-8">
        {questionTypes.map(qt => (
          <button
            key={qt.id}
            onClick={() => toggleType(qt.id)}
            className={cn(
              'flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-200',
              selectedTypes.includes(qt.id)
                ? 'border-emerald-500/40 bg-emerald-500/[0.06] ring-1 ring-emerald-500/20'
                : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1]'
            )}
          >
            <div className={cn('size-10 rounded-lg flex items-center justify-center shrink-0', selectedTypes.includes(qt.id) ? 'bg-emerald-500/15' : 'bg-white/[0.04]')}>
              <qt.icon size={18} className={cn(selectedTypes.includes(qt.id) ? 'text-emerald-400' : 'text-muted-foreground')} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{qt.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{qt.desc}</p>
            </div>
            {selectedTypes.includes(qt.id) && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="size-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                <Check size={10} className="text-white" />
              </motion.div>
            )}
          </button>
        ))}
      </div>

      
      <h3 className="text-sm font-medium text-foreground mb-4">Campaign Settings</h3>
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">Campaign Name</label>
          <input defaultValue="Product Onboarding Q4" className="w-full h-10 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all" />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">Language</label>
          <select className="w-full h-10 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all appearance-none">
            <option>English</option><option>Spanish</option><option>French</option><option>German</option>
          </select>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {[
          { label: 'Auto Localization', on: true },
          { label: 'Completion Required', on: true },
        ].map(t => (
          <div key={t.label} className="flex items-center justify-between p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
            <span className="text-sm text-foreground">{t.label}</span>
            <div className={cn('w-9 h-5 rounded-full relative cursor-pointer', t.on ? 'bg-emerald-500/30 border border-emerald-500/40' : 'bg-white/[0.06] border border-white/[0.08]')}>
              <div className={cn('absolute top-0.5 size-4 rounded-full transition-all', t.on ? 'right-0.5 bg-emerald-400' : 'left-0.5 bg-muted-foreground/60')} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function StepProcessing({ stage }: { stage: number }) {
  return (
    <div className="text-center">
      <div className="relative size-24 mx-auto mb-10">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 rounded-full border border-emerald-500/20 border-t-emerald-500/60" />
        <motion.div animate={{ rotate: -360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} className="absolute inset-2 rounded-full border border-emerald-500/10 border-b-emerald-500/40" />
        <div className="absolute inset-0 flex items-center justify-center"><Brain size={22} className="text-emerald-400" /></div>
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 2.5, repeat: Infinity }} className="absolute inset-0 rounded-full bg-emerald-500/5 blur-2xl" />
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-1">AI is processing your video</h2>
      <p className="text-sm text-muted-foreground mb-8">Usually takes 30–60 seconds</p>
      <div className="max-w-xs mx-auto space-y-2 text-left">
        {processingStages.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, x: -6 }} animate={{ opacity: i <= stage ? 1 : 0.2, x: 0 }} transition={{ delay: i * 0.06 }} className="flex items-center gap-3 py-1">
            <div className={cn('size-6 rounded-full flex items-center justify-center', i < stage ? 'bg-emerald-500/15' : i === stage ? 'bg-emerald-500/15' : 'bg-white/[0.03]')}>
              {i < stage ? <Check size={10} className="text-emerald-400" /> : i === stage ? <Loader2 size={10} className="text-emerald-400 animate-spin" /> : <s.icon size={10} className="text-muted-foreground/40" />}
            </div>
            <span className={cn('text-sm', i <= stage ? 'text-foreground' : 'text-muted-foreground/30')}>{s.label}</span>
          </motion.div>
        ))}
      </div>
      <div className="max-w-xs mx-auto mt-6">
        <div className="h-1 bg-white/[0.04] rounded-full overflow-hidden">
          <motion.div animate={{ width: `${(stage / processingStages.length) * 100}%` }} className="h-full bg-gradient-to-r from-emerald-500 to-emerald-500 rounded-full" />
        </div>
      </div>
    </div>
  )
}

function StepReview({ questions, toggleRequired, removeQuestion }: { questions: typeof defaultQuestions; toggleRequired: (id: number) => void; removeQuestion: (id: number) => void }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-foreground mb-2">Review Questions</h2>
      <p className="text-sm text-muted-foreground mb-8">Edit, remove, or add questions. Toggle required status.</p>

      
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden mb-6">
        <div className="aspect-[21/9] bg-zinc-900 relative flex items-center justify-center">
          <div className="size-12 rounded-full bg-white/10 flex items-center justify-center"><Play size={18} className="text-white ml-0.5" /></div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/[0.06]"><div className="h-full w-[45%] bg-emerald-500 rounded-r-full" /></div>
          <div className="absolute bottom-2 right-3 text-[10px] text-white/50 bg-black/40 px-2 py-0.5 rounded">4:32</div>
        </div>
      </div>

      
      <div className="space-y-2">
        {questions.map((q, i) => (
          <motion.div
            key={q.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-3 p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] group"
          >
            <span className="text-[10px] text-muted-foreground font-mono w-8 shrink-0">{q.timestamp}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground truncate">{q.text}</p>
              <span className="text-[10px] text-muted-foreground capitalize">{q.type === 'mcq' ? 'Multiple Choice' : q.type === 'yesno' ? 'Yes/No' : q.type === 'oneword' ? 'One Word' : 'Multi-Select'}</span>
            </div>
            <button
              onClick={() => toggleRequired(q.id)}
              className={cn('text-[10px] px-2 py-1 rounded-md border transition-colors shrink-0', q.required ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-white/[0.06] text-muted-foreground hover:text-foreground')}
            >
              {q.required ? 'Required' : 'Optional'}
            </button>
            <button onClick={() => removeQuestion(q.id)} className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 transition-all">
              <Trash2 size={13} className="text-red-400" />
            </button>
          </motion.div>
        ))}
      </div>

      
      <button className="mt-3 flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-white/[0.08] hover:border-emerald-500/30 hover:bg-emerald-500/[0.02] text-sm text-muted-foreground hover:text-foreground transition-all w-full justify-center">
        <Plus size={14} /> Add custom question
      </button>
    </div>
  )
}

function StepSuccess() {
  return (
    <div className="text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.4, duration: 0.7 }} className="size-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
        <Check size={28} className="text-emerald-400" />
      </motion.div>
      <h2 className="text-2xl font-semibold text-foreground mb-2">Campaign Published!</h2>
      <p className="text-sm text-muted-foreground mb-8">Your interactive video is live.</p>
      <div className="max-w-md mx-auto space-y-3 text-left">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <label className="text-[11px] font-medium text-muted-foreground block mb-1.5">Share Link</label>
          <div className="flex gap-2">
            <input readOnly value="https://luma.online/v/prod-onboard-q4" className="flex-1 h-9 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 text-xs font-mono" />
            <Button variant="outline" size="sm" className="border-white/[0.08] shrink-0"><Copy size={12} /></Button>
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <label className="text-[11px] font-medium text-muted-foreground block mb-1.5">Embed Code</label>
          <div className="flex gap-2">
            <input readOnly value='<iframe src="https://luma.online/embed/..." />' className="flex-1 h-9 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 text-[10px] font-mono" />
            <Button variant="outline" size="sm" className="border-white/[0.08] shrink-0"><Copy size={12} /></Button>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-3 mt-8">
        <Link href="/dashboard/results"><Button variant="outline" className="rounded-xl border-white/[0.08] gap-2"><BarChart3 size={14} /> Analytics</Button></Link>
        <Link href="/dashboard/campaigns"><Button className="rounded-xl gap-2"><ExternalLink size={14} /> Dashboard</Button></Link>
      </div>
    </div>
  )
}
