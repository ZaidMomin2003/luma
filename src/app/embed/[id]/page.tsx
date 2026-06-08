'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import InteractivePlayerCore from '@/components/player/player-core'


export default function EmbedPage() {
  const params = useParams()
  const campaignId = params.id as string
  const [campaign, setCampaign] = useState<any>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/campaign/${campaignId}`)
        if (!res.ok) throw new Error('Campaign not found')
        const data = await res.json()
        setCampaign(data.campaign)
        setQuestions(data.questions)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    if (campaignId) load()
  }, [campaignId])

  if (loading) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center">
        <div className="size-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !campaign) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center">
        <p className="text-white/50 text-sm">{error || 'Campaign not found'}</p>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen bg-black overflow-hidden">
      <InteractivePlayerCore
        videoUrl={campaign.video_url}
        questions={questions}
        campaignId={campaignId}
        branding={campaign.settings?.branding}
        embed
      />
    </div>
  )
}
