import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Refund Policy — Luma' }

export default function RefundPolicy() {
  return (
    <div>
      <div className="mb-12">
        <p className="text-sm font-medium text-primary mb-2">Legal</p>
        <h1 className="text-4xl font-bold tracking-tight">Refund Policy</h1>
        <p className="mt-3 text-muted-foreground">Last updated: May 23, 2026</p>
      </div>

      <div className="space-y-10 text-[15px] leading-relaxed text-muted-foreground">
        <section className="rounded-xl border border-destructive/20 bg-destructive/5 p-6">
          <h2 className="text-lg font-semibold text-foreground mb-2">No Refunds Policy</h2>
          <p>All purchases made on Luma are <strong className="text-foreground">final and non-refundable</strong>. By subscribing to any paid plan, you acknowledge and agree that no refunds will be issued under any circumstances.</p>
        </section>

        <Section title="Why We Don't Offer Refunds">
          <p>Luma provides immediate access to AI-powered services including video transcription, question generation, and analytics processing. Once these computational resources are consumed, they cannot be reversed or recovered.</p>
        </Section>

        <Section title="Free Trial">
          <p>We offer a free Starter plan so you can evaluate our platform before committing to a paid subscription. We strongly encourage you to use the free tier to ensure Luma meets your needs before upgrading.</p>
        </Section>

        <Section title="Subscription Cancellation">
          <p>You may cancel your subscription at any time. Upon cancellation:</p>
          <ul className="list-disc pl-5 space-y-2 mt-3">
            <li>Your plan remains active until the end of the current billing period</li>
            <li>No further charges will be made after cancellation</li>
            <li>You retain access to your data and campaigns until the billing period ends</li>
            <li>After the billing period, your account reverts to the free Starter plan</li>
          </ul>
        </Section>

        <Section title="Billing Disputes">
          <p>If you believe you were charged in error (duplicate charge, unauthorized transaction), please contact us within 7 days. We will investigate and resolve legitimate billing errors.</p>
        </Section>

        <Section title="Contact">
          <p>For billing questions, reach out to:</p>
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
