import { NextRequest, NextResponse } from 'next/server'
import { generateInsightsSummary } from '@/lib/bedrock'
import { createServiceClient } from '@/lib/supabase'

/**
 * POST /api/insights
 * Generate AI insights for a campaign
 * Body: { campaignId }
 */
export async function POST(request: NextRequest) {
  try {
    const { campaignId } = await request.json()

    if (!campaignId) {
      return NextResponse.json({ error: 'Missing campaignId' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Fetch campaign data
    const { data: sessions } = await supabase
      .from('viewer_sessions')
      .select('*')
      .eq('campaign_id', campaignId)

    const { data: questions } = await supabase
      .from('campaign_questions')
      .select('*')
      .eq('campaign_id', campaignId)

    const { data: responses } = await supabase
      .from('viewer_responses')
      .select('*, campaign_questions!inner(text)')
      .eq('campaign_questions.campaign_id', campaignId)

    if (!sessions || sessions.length === 0) {
      return NextResponse.json({ insight: 'Not enough data yet. Need at least a few viewer sessions to generate insights.' })
    }

    // Calculate analytics
    const totalSessions = sessions.length
    const completed = sessions.filter((s: any) => s.completed).length
    const completionRate = Math.round((completed / totalSessions) * 100)
    const avgWatchTime = Math.round(
      sessions.reduce((acc: number, s: any) => acc + (s.watch_time || 0), 0) / totalSessions
    )

    // Question performance
    const questionPerformance = (questions || []).map((q: any) => {
      const qResponses = (responses || []).filter((r: any) => r.question_id === q.id)
      const correct = qResponses.filter((r: any) => r.correct).length
      const total = qResponses.length
      return {
        question: q.text.slice(0, 60),
        correctRate: total > 0 ? Math.round((correct / total) * 100) : 0,
      }
    })

    // Get top region (most common)
    const regions = sessions.map((s: any) => s.region).filter(Boolean)
    const topRegion = regions.length > 0
      ? regions.sort((a: string, b: string) =>
          regions.filter((r: string) => r === b).length - regions.filter((r: string) => r === a).length
        )[0]
      : 'Unknown'

    // Generate AI summary
    const insight = await generateInsightsSummary({
      totalSessions,
      completionRate,
      avgWatchTime,
      topRegion,
      questionPerformance,
    })

    return NextResponse.json({ insight })
  } catch (error: any) {
    console.error('Insights generation failed:', error)
    return NextResponse.json({ error: error.message || 'Failed to generate insights' }, { status: 500 })
  }
}
