import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Privacy Policy — Luma' }

export default function PrivacyPolicy() {
  return (
    <div>
      <div className="mb-12">
        <p className="text-sm font-medium text-primary mb-2">Legal</p>
        <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-3 text-muted-foreground">Last updated: May 23, 2026</p>
      </div>

      <div className="space-y-10 text-[15px] leading-relaxed text-muted-foreground">
        <Section title="1. Introduction">
          <p>Luma (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered interactive video platform.</p>
        </Section>

        <Section title="2. Information We Collect">
          <p className="font-medium text-foreground mb-2">Account Information</p>
          <p>When you create an account, we collect your name, email address, company name, and payment information.</p>
          <p className="font-medium text-foreground mb-2 mt-4">Video Content</p>
          <p>We process videos you upload to generate transcripts, questions, and analytics. Video content is stored securely and only accessible to you and your authorized team members.</p>
          <p className="font-medium text-foreground mb-2 mt-4">Viewer Data</p>
          <p>When viewers interact with your campaigns, we collect response data, watch time, engagement metrics, and general location data (country/region level) for analytics purposes.</p>
          <p className="font-medium text-foreground mb-2 mt-4">Usage Data</p>
          <p>We automatically collect information about how you interact with our platform, including pages visited, features used, and performance data.</p>
        </Section>

        <Section title="3. How We Use Your Information">
          <ul className="list-disc pl-5 space-y-2">
            <li>To provide and maintain our service</li>
            <li>To process AI transcription and question generation</li>
            <li>To generate analytics and insights for your campaigns</li>
            <li>To provide multilingual translation services</li>
            <li>To communicate with you about your account and updates</li>
            <li>To improve our AI models and platform features</li>
            <li>To process payments and manage subscriptions</li>
          </ul>
        </Section>

        <Section title="4. Data Sharing">
          <p>We do not sell your personal information. We may share data with:</p>
          <ul className="list-disc pl-5 space-y-2 mt-3">
            <li>Service providers who assist in operating our platform (cloud hosting, payment processing)</li>
            <li>AI processing partners for transcription and translation (data is anonymized)</li>
            <li>Law enforcement when required by law</li>
          </ul>
        </Section>

        <Section title="5. Data Security">
          <p>We implement industry-standard security measures including encryption at rest and in transit, access controls, and regular security audits. Video content is encrypted using AES-256 encryption.</p>
        </Section>

        <Section title="6. Data Retention">
          <p>We retain your data for as long as your account is active. Upon account deletion, we remove your data within 30 days, except where retention is required by law.</p>
        </Section>

        <Section title="7. Your Rights">
          <p>You have the right to access, correct, delete, or export your data at any time. You can manage these settings in your account profile or contact us directly.</p>
        </Section>

        <Section title="8. Contact Us">
          <p>For any privacy-related questions or requests, contact us at:</p>
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
