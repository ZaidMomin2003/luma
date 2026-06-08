import {
  TranscribeClient,
  StartTranscriptionJobCommand,
  GetTranscriptionJobCommand,
} from '@aws-sdk/client-transcribe'

const transcribe = new TranscribeClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

const BUCKET = process.env.AWS_S3_BUCKET!

/**
 * Start a transcription job for a video in S3
 */
export async function startTranscription(videoKey: string, jobName: string, language: string = 'en-US') {
  const command = new StartTranscriptionJobCommand({
    TranscriptionJobName: jobName,
    LanguageCode: language as any,
    MediaFormat: videoKey.endsWith('.mp4') ? 'mp4' : 'mp4',
    Media: {
      MediaFileUri: `s3://${BUCKET}/${videoKey}`,
    },
    OutputBucketName: BUCKET,
    OutputKey: `transcripts/${jobName}.json`,
    Settings: {
      ShowSpeakerLabels: true,
      MaxSpeakerLabels: 5,
    },
  })

  const result = await transcribe.send(command)
  return result.TranscriptionJob
}

/**
 * Poll transcription job status
 */
export async function getTranscriptionStatus(jobName: string) {
  const command = new GetTranscriptionJobCommand({
    TranscriptionJobName: jobName,
  })

  const result = await transcribe.send(command)
  return result.TranscriptionJob
}

/**
 * Parse AWS Transcribe output into structured segments with timestamps
 */
export function parseTranscript(transcriptJson: any): TranscriptSegment[] {
  const items = transcriptJson.results?.items || []
  const segments: TranscriptSegment[] = []
  let currentSegment: TranscriptSegment = { startTime: 0, endTime: 0, text: '' }
  let wordCount = 0

  for (const item of items) {
    if (item.type === 'pronunciation') {
      const word = item.alternatives?.[0]?.content || ''
      const startTime = parseFloat(item.start_time || '0')
      const endTime = parseFloat(item.end_time || '0')

      if (wordCount === 0) {
        currentSegment.startTime = startTime
      }

      currentSegment.text += (currentSegment.text ? ' ' : '') + word
      currentSegment.endTime = endTime
      wordCount++

      // Create segments of ~30 words (roughly 15-20 seconds of speech)
      if (wordCount >= 30) {
        segments.push({ ...currentSegment })
        currentSegment = { startTime: 0, endTime: 0, text: '' }
        wordCount = 0
      }
    } else if (item.type === 'punctuation') {
      currentSegment.text += item.alternatives?.[0]?.content || ''
    }
  }

  // Push remaining segment
  if (currentSegment.text.trim()) {
    segments.push(currentSegment)
  }

  return segments
}

export interface TranscriptSegment {
  startTime: number
  endTime: number
  text: string
}
