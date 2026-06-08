import { NextRequest, NextResponse } from 'next/server'
import { getCampaignAnalytics, getQuestionPerformance, getCompletionFunnel, getRecentResponses } from '@/lib/analytics'


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ campaignId: string }> }
) {
  try {
    const { campaignId } = await params

    if (!campaignId) {
      return NextResponse.json({ error: 'Missing campaignId' }, { status: 400 })
    }
    const [overview, questions, funnel, responses] = await Promise.all([
      getCampaignAnalytics(campaignId),
      getQuestionPerformance(campaignId),
      getCompletionFunnel(campaignId),
      getRecentResponses(campaignId),
    ])

    return NextResponse.json({
      overview,
      questions,
      funnel,
      responses,
    })
  } catch (error: any) {
    console.error('Analytics fetch failed:', error)
    return NextResponse.json({ error: error.message || 'Failed to fetch analytics' }, { status: 500 })
  }
}
