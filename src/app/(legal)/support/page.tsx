import { Metadata } from 'next'
import { Mail, Clock, MessageCircle, BookOpen, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Support — Luma' }

export default function SupportPage() {
  return (
    <div>
      <div className="mb-12">
        <p className="text-sm font-medium text-primary mb-2">Help Center</p>
        <h1 className="text-4xl font-bold tracking-tight">Support</h1>
        <p className="mt-3 text-muted-foreground">We&apos;re here to help you get the most out of Luma.</p>
      </div>

      {/* Contact Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="group rounded-xl border p-6 transition-colors hover:border-primary/30 hover:bg-muted/30">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <Mail className="size-5 text-primary" />
          </div>
          <h3 className="mt-4 font-semibold text-foreground">Email Support</h3>
          <p className="mt-2 text-sm text-muted-foreground">Reach out for any questions, issues, or feedback. We typically respond within 24 hours.</p>
          <a href="mailto:hello@luma.online" className="mt-4 inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline">
            hello@luma.online
            <ArrowRight className="size-3.5" />
          </a>
        </div>

        <div className="group rounded-xl border p-6 transition-colors hover:border-primary/30 hover:bg-muted/30">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <Clock className="size-5 text-primary" />
          </div>
          <h3 className="mt-4 font-semibold text-foreground">Response Times</h3>
          <p className="mt-2 text-sm text-muted-foreground">We prioritize based on your plan tier.</p>
          <div className="mt-4 space-y-1.5 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Starter</span><span className="text-foreground">48 hours</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Pro</span><span className="text-foreground">24 hours</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Enterprise</span><span className="text-foreground">4 hours</span></div>
          </div>
        </div>

        <div className="group rounded-xl border p-6 transition-colors hover:border-primary/30 hover:bg-muted/30">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <MessageCircle className="size-5 text-primary" />
          </div>
          <h3 className="mt-4 font-semibold text-foreground">Feature Requests</h3>
          <p className="mt-2 text-sm text-muted-foreground">Have an idea for Luma? We love hearing from our users. Send feature requests to our email and we&apos;ll review them.</p>
        </div>

        <div className="group rounded-xl border p-6 transition-colors hover:border-primary/30 hover:bg-muted/30">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <BookOpen className="size-5 text-primary" />
          </div>
          <h3 className="mt-4 font-semibold text-foreground">Documentation</h3>
          <p className="mt-2 text-sm text-muted-foreground">Guides, API reference, and tutorials to help you integrate and use Luma effectively.</p>
          <span className="mt-4 inline-block text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">Coming soon</span>
        </div>
      </div>

      {/* Common Topics */}
      <div className="mt-16">
        <h2 className="text-xl font-semibold text-foreground mb-6">Common Topics</h2>
        <div className="space-y-0 divide-y divide-border rounded-xl border overflow-hidden">
          {[
            { title: 'Account & Billing', desc: 'Subscription management, plan upgrades, cancellations, and billing inquiries.' },
            { title: 'Video Upload Issues', desc: 'Supported formats (MP4, MOV, AVI, WebM), file size limits, and upload troubleshooting.' },
            { title: 'AI Processing', desc: 'Question generation accuracy, transcript quality, timestamp placement, and language support.' },
            { title: 'Embedding & Sharing', desc: 'Embed codes, custom domains, sharing links, and viewer access controls.' },
            { title: 'Enterprise & API', desc: 'SSO setup, API integration, white-labeling, and custom deployment options.' },
          ].map((item) => (
            <div key={item.title} className="px-5 py-4 hover:bg-muted/30 transition-colors">
              <h4 className="font-medium text-foreground text-sm">{item.title}</h4>
              <p className="text-sm text-muted-foreground mt-0.5">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-16 text-center rounded-xl border bg-muted/20 p-10">
        <p className="text-lg font-medium text-foreground">Can&apos;t find what you need?</p>
        <p className="text-muted-foreground mt-1 text-sm">Our team is ready to help.</p>
        <a href="mailto:hello@luma.online" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Mail className="size-4" />
          Email us
        </a>
      </div>
    </div>
  )
}
