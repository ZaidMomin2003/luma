import type { Metadata } from 'next'
import { Inter, Instrument_Serif } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const instrumentSerif = Instrument_Serif({ subsets: ['latin'], variable: '--font-serif', weight: '400', style: ['normal', 'italic'] })

export const metadata: Metadata = {
  title: 'Luma — AI Interactive Video Intelligence Platform',
  description: 'Upload a video. AI generates contextual questions and embeds them at perfect timestamps. Viewers engage, learn, and provide feedback — all within the video.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${instrumentSerif.variable} ${inter.className}`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
