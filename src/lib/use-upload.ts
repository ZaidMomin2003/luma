'use client'
import { useState, useCallback } from 'react'

interface UploadState {
  status: 'idle' | 'preparing' | 'uploading' | 'complete' | 'error'
  progress: number
  videoUrl: string | null
  error: string | null
  fileName: string | null
  fileSize: number | null
  duration: number | null
}

interface UseUploadOptions {
  userId: string
  onComplete?: (videoUrl: string, metadata: { fileName: string; fileSize: number; duration: number | null }) => void
}

export function useUpload({ userId, onComplete }: UseUploadOptions) {
  const [state, setState] = useState<UploadState>({
    status: 'idle',
    progress: 0,
    videoUrl: null,
    error: null,
    fileName: null,
    fileSize: null,
    duration: null,
  })

  const getVideoDuration = (file: File): Promise<number | null> => {
    return new Promise((resolve) => {
      const video = document.createElement('video')
      video.preload = 'metadata'
      video.onloadedmetadata = () => {
        resolve(Math.round(video.duration))
        URL.revokeObjectURL(video.src)
      }
      video.onerror = () => resolve(null)
      video.src = URL.createObjectURL(file)
    })
  }

  const upload = useCallback(async (file: File) => {
    try {
      setState(s => ({ ...s, status: 'preparing', fileName: file.name, fileSize: file.size, error: null }))
      const duration = await getVideoDuration(file)
      setState(s => ({ ...s, duration }))
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          userId,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to get upload URL')
      }

      const { uploadUrl, videoUrl } = await res.json()
      setState(s => ({ ...s, status: 'uploading' }))

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100)
            setState(s => ({ ...s, progress }))
          }
        })

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve()
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`))
          }
        })

        xhr.addEventListener('error', () => reject(new Error('Upload failed')))
        xhr.addEventListener('abort', () => reject(new Error('Upload cancelled')))

        xhr.open('PUT', uploadUrl)
        xhr.setRequestHeader('Content-Type', file.type)
        xhr.send(file)
      })

      setState(s => ({ ...s, status: 'complete', progress: 100, videoUrl }))

      if (onComplete) {
        onComplete(videoUrl, { fileName: file.name, fileSize: file.size, duration })
      }
    } catch (error: any) {
      setState(s => ({
        ...s,
        status: 'error',
        error: error.message || 'Upload failed',
      }))
    }
  }, [userId, onComplete])

  const reset = useCallback(() => {
    setState({
      status: 'idle',
      progress: 0,
      videoUrl: null,
      error: null,
      fileName: null,
      fileSize: null,
      duration: null,
    })
  }, [])

  return { ...state, upload, reset }
}
