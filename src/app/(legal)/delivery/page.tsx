import { Metadata } from 'next'
import { Clock, Globe, Zap, Server } from 'lucide-react'

export const metadata: Metadata = { title: 'Delivery Policy — Luma' }

export default function DeliveryPolicy() {
  return (
    <div>
      <div className="mb-12">
        <p className="text-sm font-medium text-primary mb-2">Legal</p>
        <h1 className="text-4xl font-bold tracking-tight">Delivery Policy</h1>
        <p className="mt-3 text-muted-foreground">Last updated: May 23, 2026</p>
      </div>

      <div className="space-y-10 text-[15px] leading-relaxed text-muted-foreground">
        <Section title="Digital Service Delivery">
          <p>Luma is a digital SaaS platform. All services are delivered electronically and instantly upon account creation or subscription activation. There are no physical goods involved.</p>
        </Section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Service Activation</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border p-4">
              <Zap className="size-5 text-primary mb-2" />
              <p className="font-medium text-foreground text-sm">Starter</p>
              <p className="text-xs mt-1">Immediate access upon email verification</p>
            </div>
            <div className="rounded-xl border p-4">
              <Clock className="size-5 text-primary mb-2" />
              <p className="font-medium text-foreground text-sm">Pro</p>
              <p className="text-xs mt-1">Immediate access upon successful payment</p>
            </div>
            <div className="rounded-xl border p-4">
              <Server className="size-5 text-primary mb-2" />
              <p className="font-medium text-foreground text-sm">Enterprise</p>
              <p className="text-xs mt-1">24-48 hours after contract signing</p>
            </div>
          </div>
        </section>

        <Section title="AI Processing Times">
          <p>After uploading a video, AI processing times vary based on video length:</p>
          <div className="mt-4 rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left px-4 py-3 font-medium text-foreground">Video Length</th>
                  <th className="text-left px-4 py-3 font-medium text-foreground">Processing Time</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="px-4 py-3">Under 5 minutes</td><td className="px-4 py-3">1-2 minutes</td></tr>
                <tr className="border-b"><td className="px-4 py-3">5-30 minutes</td><td className="px-4 py-3">3-8 minutes</td></tr>
                <tr><td className="px-4 py-3">30-120 minutes</td><td className="px-4 py-3">10-20 minutes</td></tr>
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="Multilingual Translation">
          <div className="flex items-start gap-3">
            <Globe className="size-5 text-primary mt-0.5 shrink-0" />
            <p>Translation of transcripts and questions into additional languages typically completes within 2-5 minutes per language, regardless of video length.</p>
          </div>
        </Section>

        <Section title="Service Availability">
          <p>Luma maintains <strong className="text-foreground">99.99% uptime</strong>. In the event of scheduled maintenance, we provide 48 hours advance notice via email.</p>
        </Section>

        <Section title="Contact">
          <p>For delivery-related questions, contact:</p>
          <a href="mailto:hello@luma.online" className="text-primary hover:underline font-medium">hello@luma.online</a>
        </Section>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-foreground mb-3">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  )
}
