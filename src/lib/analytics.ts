import { supabase } from '@/lib/supabase'

export async function getDashboardStats(userId: string) {
  const { data: campaigns } = await supabase
    .from('campaigns')
    .select('id')
    .eq('user_id', userId)

  if (!campaigns || campaigns.length === 0) {
    return { totalCampaigns: 0, totalSessions: 0, completionRate: 0, avgWatchTime: 0 }
  }

  const campaignIds = campaigns.map(c => c.id)

  const { data: sessions } = await supabase
    .from('viewer_sessions')
    .select('*')
    .in('campaign_id', campaignIds)

  if (!sessions || sessions.length === 0) {
    return { totalCampaigns: campaigns.length, totalSessions: 0, completionRate: 0, avgWatchTime: 0 }
  }

  const totalSessions = sessions.length
  const completed = sessions.filter(s => s.completed).length
  const completionRate = Math.round((completed / totalSessions) * 100)
  const avgWatchTime = Math.round(
    sessions.reduce((acc, s) => acc + (s.watch_time || 0), 0) / totalSessions
  )

  return {
    totalCampaigns: campaigns.length,
    totalSessions,
    completionRate,
    avgWatchTime,
  }
}

export async function getCampaignAnalytics(campaignId: string) {
  const { data: sessions } = await supabase
    .from('viewer_sessions')
    .select('*')
    .eq('campaign_id', campaignId)
    .order('created_at', { ascending: true })

  if (!sessions || sessions.length === 0) return null
  const totalSessions = sessions.length
  const completed = sessions.filter(s => s.completed).length
  const completionRate = Math.round((completed / totalSessions) * 100)
  const avgWatchTime = Math.round(
    sessions.reduce((acc, s) => acc + (s.watch_time || 0), 0) / totalSessions
  )
  const regionMap: Record<string, number> = {}
  sessions.forEach(s => {
    const region = s.region || 'Unknown'
    regionMap[region] = (regionMap[region] || 0) + 1
  })
  const regions = Object.entries(regionMap)
    .map(([region, count]) => ({ region, viewers: count }))
    .sort((a, b) => b.viewers - a.viewers)
  const deviceMap: Record<string, number> = {}
  sessions.forEach(s => {
    const device = s.device || 'unknown'
    deviceMap[device] = (deviceMap[device] || 0) + 1
  })
  const devices = Object.entries(deviceMap)
    .map(([device, count]) => ({ device, count }))
    .sort((a, b) => b.count - a.count)
  const now = new Date()
  const dailyViews: { day: string; views: number; completed: number }[] = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const dayStr = date.toISOString().split('T')[0]
    const dayLabel = date.toLocaleDateString('en', { weekday: 'short' })

    const daySessions = sessions.filter(s => s.created_at?.startsWith(dayStr))
    dailyViews.push({
      day: dayLabel,
      views: daySessions.length,
      completed: daySessions.filter(s => s.completed).length,
    })
  }
  const hourlyMap: Record<number, number> = {}
  sessions.forEach(s => {
    const hour = new Date(s.created_at).getHours()
    hourlyMap[hour] = (hourlyMap[hour] || 0) + 1
  })
  const hourly = Array.from({ length: 24 }, (_, h) => ({
    hour: `${h}:00`,
    sessions: hourlyMap[h] || 0,
  }))
  const bestHour = Object.entries(hourlyMap).sort(([, a], [, b]) => b - a)[0]

  return {
    totalSessions,
    completed,
    completionRate,
    avgWatchTime,
    regions,
    devices,
    dailyViews,
    hourly,
    bestHour: bestHour ? `${bestHour[0]}:00` : 'N/A',
    topRegion: regions[0]?.region || 'N/A',
  }
}

export async function getQuestionPerformance(campaignId: string) {
  const { data: questions } = await supabase
    .from('campaign_questions')
    .select('*')
    .eq('campaign_id', campaignId)
    .order('order', { ascending: true })

  if (!questions || questions.length === 0) return []

  const questionIds = questions.map(q => q.id)

  const { data: responses } = await supabase
    .from('viewer_responses')
    .select('*')
    .in('question_id', questionIds)

  return questions.map(q => {
    const qResponses = (responses || []).filter(r => r.question_id === q.id)
    const total = qResponses.length
    const correct = qResponses.filter(r => r.correct).length
    const incorrect = total - correct

    return {
      id: q.id,
      text: q.text,
      type: q.type,
      timestamp: q.timestamp_sec,
      totalResponses: total,
      correct,
      incorrect,
      correctRate: total > 0 ? Math.round((correct / total) * 100) : 0,
    }
  })
}

export async function getCompletionFunnel(campaignId: string) {
  const { data: questions } = await supabase
    .from('campaign_questions')
    .select('id, timestamp_sec, order')
    .eq('campaign_id', campaignId)
    .order('order', { ascending: true })

  const { data: sessions } = await supabase
    .from('viewer_sessions')
    .select('id')
    .eq('campaign_id', campaignId)

  if (!questions || !sessions || sessions.length === 0) return []

  const totalStarted = sessions.length
  const sessionIds = sessions.map(s => s.id)

  const { data: responses } = await supabase
    .from('viewer_responses')
    .select('session_id, question_id')
    .in('session_id', sessionIds)
  const funnel = [{ stage: 'Started', value: totalStarted }]

  for (const q of questions) {
    const answeredSessions = new Set(
      (responses || [])
        .filter(r => r.question_id === q.id)
        .map(r => r.session_id)
    )
    funnel.push({
      stage: `Q${q.order + 1} Answered`,
      value: answeredSessions.size,
    })
  }
  const { data: completedSessions } = await supabase
    .from('viewer_sessions')
    .select('id')
    .eq('campaign_id', campaignId)
    .eq('completed', true)

  funnel.push({ stage: 'Completed', value: completedSessions?.length || 0 })

  return funnel
}

export async function getRecentResponses(campaignId: string, limit: number = 20) {
  const { data: sessions } = await supabase
    .from('viewer_sessions')
    .select('id, viewer_email, watch_time, completed, created_at')
    .eq('campaign_id', campaignId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (!sessions || sessions.length === 0) return []

  const sessionIds = sessions.map(s => s.id)

  const { data: responses } = await supabase
    .from('viewer_responses')
    .select('session_id, correct')
    .in('session_id', sessionIds)

  return sessions.map(s => {
    const sessionResponses = (responses || []).filter(r => r.session_id === s.id)
    const totalAnswered = sessionResponses.length
    const correctCount = sessionResponses.filter(r => r.correct).length

    return {
      sessionId: s.id,
      email: s.viewer_email || 'Anonymous',
      watchTime: s.watch_time || 0,
      completed: s.completed,
      score: totalAnswered > 0 ? `${correctCount}/${totalAnswered}` : '—',
      date: s.created_at,
    }
  })
}
