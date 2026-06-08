/**
 * Generate shareable URLs and embed codes for campaigns
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://luma.online'

export function getShareUrl(campaignId: string) {
  return `${BASE_URL}/play/${campaignId}`
}

export function getEmbedCode(campaignId: string, options?: { width?: string; height?: string }) {
  const { width = '100%', height = '500' } = options || {}
  const embedUrl = `${BASE_URL}/embed/${campaignId}`
  return `<iframe src="${embedUrl}" width="${width}" height="${height}" frameborder="0" allow="autoplay; fullscreen" allowfullscreen style="border-radius: 12px; overflow: hidden;"></iframe>`
}

export function getEmbedUrl(campaignId: string) {
  return `${BASE_URL}/embed/${campaignId}`
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    const success = document.execCommand('copy')
    document.body.removeChild(textarea)
    return success
  }
}
