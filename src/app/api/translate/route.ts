import { NextRequest, NextResponse } from 'next/server'
import { translateQuestions } from '@/lib/bedrock'
import { createServiceClient } from '@/lib/supabase'

/**
 * POST /api/translate
 * Translate campaign questions to a target language
 * Body: { campaignId, targetLanguage }
 */
export async function POST(request: NextRequest) {
  try {
    const { campaignId, targetLanguage } = await request.json()

    if (!campaignId || !targetLanguage) {
      return NextResponse.json({ error: 'Missing campaignId or targetLanguage' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Fetch existing questions
    const { data: questions, error } = await supabase
      .from('campaign_questions')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('order', { ascending: true })

    if (error || !questions || questions.length === 0) {
      return NextResponse.json({ error: 'No questions found for this campaign' }, { status: 404 })
    }

    // Translate via Bedrock
    const questionsForTranslation = questions.map((q: any) => ({
      timestamp_sec: q.timestamp_sec,
      text: q.text,
      type: q.type,
      options: q.options,
      correct_answer: '',
      required: q.required,
    }))

    const translated = await translateQuestions(questionsForTranslation, targetLanguage)

    return NextResponse.json({
      original: questions.length,
      translated: translated.length,
      language: targetLanguage,
      questions: translated,
    })
  } catch (error: any) {
    console.error('Translation failed:', error)
    return NextResponse.json({ error: error.message || 'Translation failed' }, { status: 500 })
  }
}
