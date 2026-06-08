import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Interactive Video — Luma',
  description: 'Watch and engage with this interactive video experience powered by Luma.',
}

export default function PlayLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
