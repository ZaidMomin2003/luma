import { NextRequest, NextResponse } from 'next/server'
import { startTranscription, getTranscriptionStatus, parseTranscript } from '@/lib/transcribe'
import { generateQuestions, type GeneratedQuestion } from '@/lib/bedrock'
import { createServiceClient } from '@/lib/supabase'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

/**
 * POST /api/process
 * Starts the AI processing pipeline for a campaign
 * Body: { campaignId, videoKey, questionTypes, language }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { campaignId, videoKey, questionTypes, language = 'en-US' } = body

    if (!campaignId || !videoKey) {
      return NextResponse.json({ error: 'Missing campaignId or videoKey' }, { status: 400 })
    }

    const supabase = createServiceClient()
    const jobName = `luma-${campaignId}-${Date.now()}`

    // Update campaign status to processing
    await supabase
      .from('campaigns')
      .update({ status: 'processing' })
      .eq('id', campaignId)

    // Step 1: Start transcription
    await startTranscription(videoKey, jobName, language)

    // Return immediately — client will poll for status
    return NextResponse.json({
      jobName,
      status: 'transcribing',
      message: 'AI processing started. Poll /api/process/status for updates.',
    })
  } catch (error: any) {
    console.error('Process start failed:', error)
    return NextResponse.json({ error: error.message || 'Processing failed' }, { status: 500 })
  }
}

/**
 * GET /api/process?jobName=xxx&campaignId=xxx&questionTypes=mcq,yesno
 * Polls transcription status and triggers question generation when ready
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jobName = searchParams.get('jobName')
    const campaignId = searchParams.get('campaignId')
    const questionTypes = searchParams.get('questionTypes')?.split(',') || ['mcq']

    if (!jobName || !campaignId) {
      return NextResponse.json({ error: 'Missing jobName or campaignId' }, { status: 400 })
    }

    // Check transcription status
    const job = await getTranscriptionStatus(jobName)
    const status = job?.TranscriptionJobStatus

    if (status === 'IN_PROGRESS') {
      return NextResponse.json({ status: 'transcribing', progress: 30 })
    }

    if (status === 'FAILED') {
      return NextResponse.json({ status: 'failed', error: job?.FailureReason }, { status: 500 })
    }

    if (status === 'COMPLETED') {
      // Fetch transcript from S3
      const transcriptKey = `transcripts/${jobName}.json`
      const getCmd = new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: transcriptKey,
      })

      const s3Response = await s3.send(getCmd)
      const transcriptRaw = await s3Response.Body?.transformToString()
      if (!transcriptRaw) {
        return NextResponse.json({ status: 'failed', error: 'Empty transcript' }, { status: 500 })
      }

      const transcriptJson = JSON.parse(transcriptRaw)
      const segments = parseTranscript(transcriptJson)

      // Step 2: Generate questions via Bedrock
      const questions = await generateQuestions(segments, {
        questionTypes,
        questionCount: Math.min(8, Math.max(3, Math.floor(segments.length / 2))),
      })

      // Step 3: Save questions to Supabase
      const supabase = createServiceClient()

      // Delete existing questions for this campaign (regeneration case)
      await supabase.from('campaign_questions').delete().eq('campaign_id', campaignId)

      // Insert new questions
      const questionsToInsert = questions.map((q: GeneratedQuestion, i: number) => ({
        campaign_id: campaignId,
        timestamp_sec: q.timestamp_sec,
        text: q.text,
        type: q.type,
        options: q.options,
        required: q.required,
        order: i,
      }))

      await supabase.from('campaign_questions').insert(questionsToInsert)

      // Update campaign status to active
      await supabase
        .from('campaigns')
        .update({ status: 'active' })
        .eq('id', campaignId)

      return NextResponse.json({
        status: 'complete',
        progress: 100,
        questions: questions.length,
        segments: segments.length,
      })
    }

    return NextResponse.json({ status: 'unknown' })
  } catch (error: any) {
    console.error('Process status check failed:', error)
    return NextResponse.json({ error: error.message || 'Status check failed' }, { status: 500 })
  }
}
