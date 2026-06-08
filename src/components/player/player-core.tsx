'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Play, Pause, Volume2, VolumeX, Maximize, Check, ChevronRight, Sparkles } from 'lucide-react'
import { useViewerSession } from '@/lib/use-viewer-session'

interface Question {
  id: string
  timestamp_sec: number
  text: string
  type: 'mcq' | 'yesno' | 'oneword' | 'multi'
  options: string[]
  required: boolean
  order: number
}

interface PlayerCoreProps {
  videoUrl: string
  questions: Question[]
  campaignId: string
  branding?: { accentColor?: string; logoUrl?: string }
  embed?: boolean
}

export default function InteractivePlayerCore({ videoUrl, questions, campaignId, branding, embed }: PlayerCoreProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null)
  const [answeredIds, setAnsweredIds] = useState<Set<string>>(new Set())
  const [videoReady, setVideoReady] = useState(false)
  const triggeredRef = useRef<Set<string>>(new Set())
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { startSession, recordResponse, endSession } = useViewerSession(campaignId)

  const accentColor = branding?.accentColor || '#34d399'

  // ─── Controls ──────────────────────────────────────────────────────────

  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video || activeQuestion) return
    if (video.paused) {
      video.play()
      setIsPlaying(true)
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }, [activeQuestion])

  const handleFirstPlay = useCallback(async () => {
    await startSession()
  }, [startSession])

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setIsMuted(!isMuted)
  }

  const goFullscreen = () => {
    const el = document.querySelector('[data-player-root]')
    if (!el) return
    if (document.fullscreenElement) document.exitFullscreen()
    else el.requestFullscreen()
  }

  const seekTo = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current
    if (!video || !progressRef.current || activeQuestion) return
    const rect = progressRef.current.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    video.currentTime = pct * duration
  }

  // ─── Time Update ───────────────────────────────────────────────────────

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let hasStarted = false

    const onPlay = () => {
      if (!hasStarted) {
        hasStarted = true
        handleFirstPlay()
      }
    }

    const onTime = () => {
      const t = video.currentTime
      setCurrentTime(t)

      for (const q of questions) {
        if (!triggeredRef.current.has(q.id) && !activeQuestion && t >= q.timestamp_sec && t < q.timestamp_sec + 1) {
          triggeredRef.current.add(q.id)
          video.pause()
          setIsPlaying(false)
          setActiveQuestion(q)
          break
        }
      }
    }

    const onMeta = () => { setDuration(video.duration); setVideoReady(true) }

    const onEnded = () => {
      setIsPlaying(false)
      endSession(answeredIds.size === questions.length)
    }

    video.addEventListener('play', onPlay)
    video.addEventListener('timeupdate', onTime)
    video.addEventListener('loadedmetadata', onMeta)
    video.addEventListener('canplay', onMeta)
    video.addEventListener('ended', onEnded)

    return () => {
      video.removeEventListener('play', onPlay)
      video.removeEventListener('timeupdate', onTime)
      video.removeEventListener('loadedmetadata', onMeta)
      video.removeEventListener('canplay', onMeta)
      video.removeEventListener('ended', onEnded)
    }
  }, [activeQuestion, questions, handleFirstPlay, endSession, answeredIds])

  // ─── Controls Visibility ───────────────────────────────────────────────

  const flashControls = () => {
    setShowControls(true)
    if (hideTimer.current) clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => {
      if (isPlaying && !activeQuestion) setShowControls(false)
    }, 3000)
  }

  // ─── Answer ────────────────────────────────────────────────────────────

  const handleAnswer = async (answer: string | string[]) => {
    if (!activeQuestion) return
    const answerStr = Array.isArray(answer) ? answer.join(', ') : answer
    await recordResponse(activeQuestion.id, answerStr, undefined)
    setAnsweredIds(prev => new Set([...prev, activeQuestion.id]))
    setActiveQuestion(null)
    setTimeout(() => { videoRef.current?.play(); setIsPlaying(true) }, 400)
  }

  const handleSkip = () => {
    if (!activeQuestion || activeQuestion.required) return
    setAnsweredIds(prev => new Set([...prev, activeQuestion.id]))
    setActiveQuestion(null)
    setTimeout(() => { videoRef.current?.play(); setIsPlaying(true) }, 400)
  }

  const fmt = (s: number) => `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`

  // ─── Render ────────────────────────────────────────────────────────────

  return (
    <div data-player-root className="relative w-full h-full bg-black" onMouseMove={flashControls}>
      <video
        ref={videoRef}
        src={videoUrl}
        className={cn('absolute inset-0 w-full h-full object-contain transition-all duration-700 ease-out', activeQuestion ? 'blur-xl scale-[1.03] brightness-50' : '')}
        playsInline
        preload="auto"
        onClick={togglePlay}
      />

      {/* Question Overlay */}
      <AnimatePresence>
        {activeQuestion && (
          <QuestionModal
            question={activeQuestion}
            num={questions.findIndex(q => q.id === activeQuestion.id) + 1}
            total={questions.length}
            onAnswer={handleAnswer}
            onSkip={handleSkip}
            accentColor={accentColor}
          />
        )}
      </AnimatePresence>

      {/* Center play */}
      {!isPlaying && !activeQuestion && videoReady && (
        <div className="absolute inset-0 flex items-center justify-center cursor-pointer z-10" onClick={togglePlay}>
          <div className="size-20 rounded-full bg-emerald-500/20 backdrop-blur-md flex items-center justify-center border border-emerald-400/30 shadow-[0_0_40px_rgba(52,211,153,0.15)]">
            <Play size={28} className="text-emerald-300 ml-1" />
          </div>
        </div>
      )}

      {/* Controls */}
      <div
        className={cn('absolute inset-x-0 bottom-0 z-10 transition-all duration-300', (showControls || !isPlaying) && !activeQuestion ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2')}
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-20 pb-5 px-5">
          <div ref={progressRef} className="relative h-1 bg-white/15 rounded-full cursor-pointer mb-4 group hover:h-1.5 transition-all" onClick={seekTo}>
            <div className="absolute inset-y-0 left-0 bg-emerald-400 rounded-full" style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }} />
            {questions.map(q => (
              <div key={q.id} className={cn('absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-3 rounded-full border-2 transition-all', answeredIds.has(q.id) ? 'bg-emerald-400 border-emerald-300 shadow-[0_0_6px_rgba(52,211,153,0.5)]' : 'bg-white border-white/80')} style={{ left: `${duration ? (q.timestamp_sec / duration) * 100 : 0}%` }} />
            ))}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={togglePlay} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                {isPlaying ? <Pause size={18} className="text-white" /> : <Play size={18} className="text-white" />}
              </button>
              <button onClick={toggleMute} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                {isMuted ? <VolumeX size={16} className="text-white/70" /> : <Volume2 size={16} className="text-white/70" />}
              </button>
              <span className="text-[11px] text-white/50 font-mono">{fmt(currentTime)} / {fmt(duration)}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-[10px] text-white/40 bg-white/5 px-2.5 py-1 rounded-full border border-white/[0.06]">
                <Sparkles size={10} className="text-emerald-400" />
                {answeredIds.size}/{questions.length}
              </div>
              <button onClick={goFullscreen} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                <Maximize size={16} className="text-white/70" />
              </button>
            </div>
          </div>
        </div>
        {/* Powered by badge (only in embed mode) */}
        {embed && (
          <div className="absolute top-4 right-4 text-[9px] text-white/30 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded">
            Powered by Luma
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Question Modal ──────────────────────────────────────────────────────────

function QuestionModal({ question, num, total, onAnswer, onSkip, accentColor }: {
  question: Question; num: number; total: number; onAnswer: (a: string | string[]) => void; onSkip: () => void; accentColor: string
}) {
  const [selected, setSelected] = useState<string | null>(null)
  const [multiSelected, setMultiSelected] = useState<string[]>([])
  const [textAnswer, setTextAnswer] = useState('')

  const submit = () => {
    if (question.type === 'multi') onAnswer(multiSelected)
    else if (question.type === 'oneword') onAnswer(textAnswer)
    else if (selected) onAnswer(selected)
  }

  const toggleMulti = (opt: string) => setMultiSelected(prev => prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt])

  const canSubmit = question.type === 'oneword' ? textAnswer.trim().length > 0 : question.type === 'multi' ? multiSelected.length > 0 : selected !== null

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="absolute inset-0 z-30 flex items-center justify-center p-4 sm:p-8" onClick={e => e.stopPropagation()}>
      <motion.div initial={{ opacity: 0, scale: 0.88, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.88, y: 30 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="relative w-full max-w-lg">
        <div className="absolute -inset-4 bg-emerald-500/[0.04] rounded-3xl blur-2xl" />
        <div className="relative bg-[#0c0c0e]/95 backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-7 sm:p-8 shadow-[0_0_80px_rgba(0,0,0,0.8)]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="size-6 rounded-md bg-emerald-500/15 flex items-center justify-center"><Sparkles size={11} className="text-emerald-400" /></span>
              <span className="text-[11px] uppercase tracking-wider text-emerald-400/80 font-medium">
                {question.type === 'mcq' ? 'Multiple Choice' : question.type === 'yesno' ? 'Yes / No' : question.type === 'oneword' ? 'Short Answer' : 'Select All'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/30">{num}/{total}</span>
              {!question.required && <button onClick={onSkip} className="text-[11px] text-white/30 hover:text-white/60 transition-colors px-2 py-0.5 rounded border border-white/[0.06]">Skip</button>}
            </div>
          </div>

          <h3 className="text-xl sm:text-2xl font-medium text-white leading-snug mb-8">{question.text}</h3>

          {(question.type === 'mcq' || question.type === 'yesno') && (
            <div className="space-y-2.5">
              {question.options.map((opt, i) => (
                <button key={i} onClick={() => setSelected(opt)} className={cn('w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 text-sm', selected === opt ? 'border-emerald-500/50 bg-emerald-500/[0.08] text-white' : 'border-white/[0.06] bg-white/[0.02] text-white/60 hover:text-white hover:bg-white/[0.04]')}>
                  <div className="flex items-center gap-3">
                    <span className={cn('size-5 rounded-full border flex items-center justify-center', selected === opt ? 'border-emerald-400 bg-emerald-500/20' : 'border-white/20')}>
                      {selected === opt && <Check size={10} className="text-emerald-400" />}
                    </span>
                    <span>{opt}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {question.type === 'multi' && (
            <div className="space-y-2.5">
              {question.options.map((opt, i) => (
                <button key={i} onClick={() => toggleMulti(opt)} className={cn('w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 text-sm', multiSelected.includes(opt) ? 'border-emerald-500/50 bg-emerald-500/[0.08] text-white' : 'border-white/[0.06] bg-white/[0.02] text-white/60 hover:text-white hover:bg-white/[0.04]')}>
                  <div className="flex items-center gap-3">
                    <span className={cn('size-5 rounded border flex items-center justify-center', multiSelected.includes(opt) ? 'border-emerald-400 bg-emerald-500/20' : 'border-white/20')}>
                      {multiSelected.includes(opt) && <Check size={10} className="text-emerald-400" />}
                    </span>
                    <span>{opt}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {question.type === 'oneword' && (
            <input type="text" value={textAnswer} onChange={e => setTextAnswer(e.target.value)} placeholder="Type your answer..." autoFocus className="w-full h-14 rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 text-base text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/30 transition-all" onKeyDown={e => e.key === 'Enter' && canSubmit && submit()} />
          )}

          <motion.button onClick={submit} disabled={!canSubmit} whileHover={canSubmit ? { scale: 1.01 } : {}} whileTap={canSubmit ? { scale: 0.98 } : {}} className={cn('mt-8 w-full py-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2', canSubmit ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_30px_rgba(52,211,153,0.2)]' : 'bg-white/[0.04] text-white/20 cursor-not-allowed border border-white/[0.06]')}>
            Submit Answer <ChevronRight size={14} />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}
