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


export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { campaignId, videoKey, questionTypes, language = 'en-US' } = body

    if (!campaignId || !videoKey) {
      return NextResponse.json({ error: 'Missing campaignId or videoKey' }, { status: 400 })
    }

    const supabase = createServiceClient()
    const jobName = `luma-${campaignId}-${Date.now()}`
    await supabase
      .from('campaigns')
      .update({ status: 'processing' })
      .eq('id', campaignId)
    await startTranscription(videoKey, jobName, language)
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


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jobName = searchParams.get('jobName')
    const campaignId = searchParams.get('campaignId')
    const questionTypes = searchParams.get('questionTypes')?.split(',') || ['mcq']

    if (!jobName || !campaignId) {
      return NextResponse.json({ error: 'Missing jobName or campaignId' }, { status: 400 })
    }
    const job = await getTranscriptionStatus(jobName)
    const status = job?.TranscriptionJobStatus

    if (status === 'IN_PROGRESS') {
      return NextResponse.json({ status: 'transcribing', progress: 30 })
    }

    if (status === 'FAILED') {
      return NextResponse.json({ status: 'failed', error: job?.FailureReason }, { status: 500 })
    }

    if (status === 'COMPLETED') {
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
      const questions = await generateQuestions(segments, {
        questionTypes,
        questionCount: Math.min(8, Math.max(3, Math.floor(segments.length / 2))),
      })
      const supabase = createServiceClient()
      await supabase.from('campaign_questions').delete().eq('campaign_id', campaignId)
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
