import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'
import type { TranscriptSegment } from './transcribe'

const bedrock = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

// Using Claude Haiku for speed + cost efficiency
const MODEL_ID = 'anthropic.claude-3-haiku-20240307-v1:0'

export interface GeneratedQuestion {
  timestamp_sec: number
  text: string
  type: 'mcq' | 'yesno' | 'oneword' | 'multi'
  options: string[]
  correct_answer: string
  required: boolean
}

/**
 * Generate MCQ questions from transcript segments using Bedrock Claude
 */
export async function generateQuestions(
  segments: TranscriptSegment[],
  options: {
    questionTypes: string[]
    questionCount?: number
    difficulty?: 'easy' | 'medium' | 'hard'
    language?: string
  }
): Promise<GeneratedQuestion[]> {
  const { questionTypes, questionCount = 6, difficulty = 'medium', language = 'English' } = options

  const transcriptText = segments
    .map(s => `[${formatTime(s.startTime)} - ${formatTime(s.endTime)}]: ${s.text}`)
    .join('\n')

  const typeInstruction = questionTypes.map(t => {
    switch (t) {
      case 'mcq': return 'Multiple Choice (4 options, 1 correct)'
      case 'yesno': return 'Yes/No (2 options)'
      case 'oneword': return 'One Word Answer (no options, open text)'
      case 'multi': return 'Multi-Select (4 options, multiple can be correct)'
      default: return ''
    }
  }).filter(Boolean).join(', ')

  const prompt = `You are an AI that creates contextual quiz questions from video transcripts.

Given the following timestamped transcript, generate exactly ${questionCount} questions.

TRANSCRIPT:
${transcriptText}

REQUIREMENTS:
- Question types to use: ${typeInstruction}
- Difficulty: ${difficulty}
- Language: ${language}
- Each question MUST have a timestamp_sec that places it at the most relevant moment in the video
- Questions should test comprehension of the content discussed at or near that timestamp
- Distribute questions evenly across the video duration
- Make questions engaging and contextually relevant

RESPOND WITH ONLY a JSON array in this exact format:
[
  {
    "timestamp_sec": <number>,
    "text": "<question text>",
    "type": "<mcq|yesno|oneword|multi>",
    "options": ["<option1>", "<option2>", ...],
    "correct_answer": "<the correct answer>",
    "required": true
  }
]

For "oneword" type, options should be an empty array [].
For "yesno" type, options should be ["Yes", "No"].
For "mcq" type, provide exactly 4 options.
For "multi" type, provide 4 options (correct_answer can list multiple separated by comma).

IMPORTANT: Return ONLY the JSON array, no other text.`

  const command = new InvokeModelCommand({
    modelId: MODEL_ID,
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify({
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 4096,
      temperature: 0.7,
      messages: [
        { role: 'user', content: prompt }
      ],
    }),
  })

  const response = await bedrock.send(command)
  const responseBody = JSON.parse(new TextDecoder().decode(response.body))
  const content = responseBody.content?.[0]?.text || '[]'

  // Parse JSON from response (handle potential markdown wrapping)
  let jsonStr = content.trim()
  if (jsonStr.startsWith('```')) {
    jsonStr = jsonStr.replace(/```json?\n?/g, '').replace(/```$/g, '').trim()
  }

  const questions: GeneratedQuestion[] = JSON.parse(jsonStr)
  return questions
}

/**
 * Generate AI summary of campaign analytics
 */
export async function generateInsightsSummary(analyticsData: {
  totalSessions: number
  completionRate: number
  avgWatchTime: number
  topRegion: string
  questionPerformance: { question: string; correctRate: number }[]
}): Promise<string> {
  const prompt = `Analyze these video campaign analytics and provide a brief, actionable 3-4 sentence summary:

Total viewer sessions: ${analyticsData.totalSessions}
Completion rate: ${analyticsData.completionRate}%
Average watch time: ${analyticsData.avgWatchTime} seconds
Top region: ${analyticsData.topRegion}
Question performance:
${analyticsData.questionPerformance.map(q => `- "${q.question}" — ${q.correctRate}% correct`).join('\n')}

Provide insights on engagement quality, areas of concern, and one actionable recommendation. Be concise and data-driven.`

  const command = new InvokeModelCommand({
    modelId: MODEL_ID,
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify({
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 512,
      temperature: 0.5,
      messages: [
        { role: 'user', content: prompt }
      ],
    }),
  })

  const response = await bedrock.send(command)
  const responseBody = JSON.parse(new TextDecoder().decode(response.body))
  return responseBody.content?.[0]?.text || 'Unable to generate insights.'
}

/**
 * Translate questions to another language
 */
export async function translateQuestions(
  questions: GeneratedQuestion[],
  targetLanguage: string
): Promise<GeneratedQuestion[]> {
  const prompt = `Translate the following quiz questions and their options to ${targetLanguage}. Keep the JSON structure exactly the same, only translate the text content.

${JSON.stringify(questions, null, 2)}

Return ONLY the translated JSON array, no other text.`

  const command = new InvokeModelCommand({
    modelId: MODEL_ID,
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify({
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 4096,
      temperature: 0.3,
      messages: [
        { role: 'user', content: prompt }
      ],
    }),
  })

  const response = await bedrock.send(command)
  const responseBody = JSON.parse(new TextDecoder().decode(response.body))
  const content = responseBody.content?.[0]?.text || '[]'

  let jsonStr = content.trim()
  if (jsonStr.startsWith('```')) {
    jsonStr = jsonStr.replace(/```json?\n?/g, '').replace(/```$/g, '').trim()
  }

  return JSON.parse(jsonStr)
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}
