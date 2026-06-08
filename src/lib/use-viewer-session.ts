'use client'
import { useRef, useCallback, useState } from 'react'
import { supabase } from '@/lib/supabase'


export function useViewerSession(campaignId: string) {
  const sessionId = useRef<string | null>(null)
  const startTime = useRef<number>(Date.now())
  const [isTracking, setIsTracking] = useState(false)

  const startSession = useCallback(async (viewerEmail?: string) => {
    try {
      const { data, error } = await supabase
        .from('viewer_sessions')
        .insert({
          campaign_id: campaignId,
          viewer_email: viewerEmail || null,
          device: getDeviceType(),
          region: null, // Could use IP geolocation service
        })
        .select()
        .single()

      if (data && !error) {
        sessionId.current = data.id
        startTime.current = Date.now()
        setIsTracking(true)
      }
    } catch (err) {
      console.error('Failed to start session:', err)
    }
  }, [campaignId])

  const recordResponse = useCallback(async (questionId: string, answer: string, correct?: boolean) => {
    if (!sessionId.current) return

    try {
      await supabase.from('viewer_responses').insert({
        session_id: sessionId.current,
        question_id: questionId,
        answer,
        correct: correct ?? null,
      })
    } catch (err) {
      console.error('Failed to record response:', err)
    }
  }, [])

  const endSession = useCallback(async (completed: boolean) => {
    if (!sessionId.current) return

    const watchTime = Math.round((Date.now() - startTime.current) / 1000)

    try {
      await supabase
        .from('viewer_sessions')
        .update({
          completed,
          completed_at: completed ? new Date().toISOString() : null,
          watch_time: watchTime,
        })
        .eq('id', sessionId.current)

      setIsTracking(false)
    } catch (err) {
      console.error('Failed to end session:', err)
    }
  }, [])

  const trackSeek = useCallback(async (fromTime: number, toTime: number) => {
    if (!sessionId.current) return
  }, [])

  return {
    sessionId: sessionId.current,
    isTracking,
    startSession,
    recordResponse,
    endSession,
    trackSeek,
  }
}

function getDeviceType(): string {
  if (typeof navigator === 'undefined') return 'unknown'
  const ua = navigator.userAgent
  if (/mobile/i.test(ua)) return 'mobile'
  if (/tablet|ipad/i.test(ua)) return 'tablet'
  return 'desktop'
}
