import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/database.types'

type Campaign = Database['public']['Tables']['campaigns']['Row']
type CampaignInsert = Database['public']['Tables']['campaigns']['Insert']
type CampaignUpdate = Database['public']['Tables']['campaigns']['Update']
type Question = Database['public']['Tables']['campaign_questions']['Row']
type QuestionInsert = Database['public']['Tables']['campaign_questions']['Insert']
type ViewerSession = Database['public']['Tables']['viewer_sessions']['Row']
type ViewerResponse = Database['public']['Tables']['viewer_responses']['Insert']

// ─── Campaigns ───────────────────────────────────────────────────────────────

export async function getCampaigns(userId: string) {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Campaign[]
}

export async function getCampaign(id: string) {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Campaign
}

export async function createCampaign(campaign: CampaignInsert) {
  const { data, error } = await supabase
    .from('campaigns')
    .insert(campaign)
    .select()
    .single()

  if (error) throw error
  return data as Campaign
}

export async function updateCampaign(id: string, updates: CampaignUpdate) {
  const { data, error } = await supabase
    .from('campaigns')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Campaign
}

export async function deleteCampaign(id: string) {
  const { error } = await supabase
    .from('campaigns')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ─── Questions ───────────────────────────────────────────────────────────────

export async function getQuestions(campaignId: string) {
  const { data, error } = await supabase
    .from('campaign_questions')
    .select('*')
    .eq('campaign_id', campaignId)
    .order('order', { ascending: true })

  if (error) throw error
  return data as Question[]
}

export async function createQuestions(questions: QuestionInsert[]) {
  const { data, error } = await supabase
    .from('campaign_questions')
    .insert(questions)
    .select()

  if (error) throw error
  return data as Question[]
}

export async function deleteQuestion(id: string) {
  const { error } = await supabase
    .from('campaign_questions')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ─── Viewer Sessions ─────────────────────────────────────────────────────────

export async function createSession(campaignId: string, viewerEmail?: string) {
  const { data, error } = await supabase
    .from('viewer_sessions')
    .insert({
      campaign_id: campaignId,
      viewer_email: viewerEmail || null,
      region: null, // Will be filled by edge function later
      device: typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 50) : null,
    })
    .select()
    .single()

  if (error) throw error
  return data as ViewerSession
}

export async function completeSession(sessionId: string, watchTime: number) {
  const { error } = await supabase
    .from('viewer_sessions')
    .update({
      completed: true,
      completed_at: new Date().toISOString(),
      watch_time: watchTime,
    })
    .eq('id', sessionId)

  if (error) throw error
}

// ─── Viewer Responses ────────────────────────────────────────────────────────

export async function recordResponse(response: ViewerResponse) {
  const { data, error } = await supabase
    .from('viewer_responses')
    .insert(response)
    .select()
    .single()

  if (error) throw error
  return data
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export async function getCampaignStats(campaignId: string) {
  const { data: sessions } = await supabase
    .from('viewer_sessions')
    .select('*')
    .eq('campaign_id', campaignId)

  if (!sessions) return null

  const total = sessions.length
  const completed = sessions.filter(s => s.completed).length
  const avgWatchTime = sessions.reduce((acc, s) => acc + (s.watch_time || 0), 0) / (total || 1)
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

  return {
    totalSessions: total,
    completedSessions: completed,
    completionRate,
    avgWatchTime: Math.round(avgWatchTime),
  }
}

export async function getCampaignResponses(campaignId: string) {
  const { data, error } = await supabase
    .from('viewer_sessions')
    .select(`
      *,
      viewer_responses (*)
    `)
    .eq('campaign_id', campaignId)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) throw error
  return data
}
