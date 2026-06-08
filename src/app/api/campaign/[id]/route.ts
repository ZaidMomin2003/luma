import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

/**
 * GET /api/campaign/[id]
 * Public endpoint — returns campaign data + questions for the player
 * No auth required (viewers access this)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createServiceClient()

    // Fetch campaign
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', id)
      .eq('status', 'active')
      .single()

    if (campaignError || !campaign) {
      return NextResponse.json({ error: 'Campaign not found or not active' }, { status: 404 })
    }

    // Fetch questions
    const { data: questions } = await supabase
      .from('campaign_questions')
      .select('id, timestamp_sec, text, type, options, required, order')
      .eq('campaign_id', id)
      .order('order', { ascending: true })

    return NextResponse.json({
      campaign: {
        id: campaign.id,
        name: campaign.name,
        description: campaign.description,
        video_url: campaign.video_url,
        video_duration: campaign.video_duration,
        language: campaign.language,
        settings: campaign.settings,
        thumbnail_url: campaign.thumbnail_url,
      },
      questions: questions || [],
    })
  } catch (error: any) {
    console.error('Campaign fetch failed:', error)
    return NextResponse.json({ error: 'Failed to load campaign' }, { status: 500 })
  }
}
