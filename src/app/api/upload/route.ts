import { NextRequest, NextResponse } from 'next/server'
import { getUploadUrl, generateVideoKey, getVideoUrl } from '@/lib/s3'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fileName, contentType, userId } = body

    if (!fileName || !contentType || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: fileName, contentType, userId' },
        { status: 400 }
      )
    }

    // Validate content type
    const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm']
    if (!allowedTypes.includes(contentType)) {
      return NextResponse.json(
        { error: 'Unsupported video format. Use MP4, MOV, AVI, or WebM.' },
        { status: 400 }
      )
    }

    // Generate S3 key and presigned URL
    const key = generateVideoKey(userId, fileName)
    const uploadUrl = await getUploadUrl(key, contentType)
    const videoUrl = getVideoUrl(key)

    return NextResponse.json({
      uploadUrl,
      videoUrl,
      key,
    })
  } catch (error: any) {
    console.error('Upload URL generation failed:', error)
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    )
  }
}
