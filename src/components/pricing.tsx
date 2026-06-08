import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Check, Sparkles, Building2, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const plans = [
  {
    name: 'Free Trial',
    price: '$0',
    period: '',
    description: 'Perfect for testing interactive video experiences.',
    features: [
      '1 interactive video campaign',
      '100 viewer sessions',
      'AI-generated MCQs',
      'Smart timestamp embedding',
      'Interactive video player',
      'Basic analytics',
      'Shareable campaign link',
      'Video embedding',
    ],
    cta: 'Start Free',
    highlighted: false,
  },
  {
    name: 'Starter',
    price: '$29',
    period: '/month',
    description: 'For creators, startups, educators, and small teams.',
    features: [
      '3 interactive video campaigns',
      '1,000 viewer sessions/month',
      'AI translation support',
      'Multi-language subtitles',
      'Region-based localization',
      'Campaign analytics',
      'Completion rate tracking',
      'Most engaging moments',
      'Embed anywhere',
      'Mobile optimized',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$249',
    period: '/month',
    description: 'For agencies, businesses, and scaling organizations.',
    features: [
      '20 interactive video campaigns',
      '8,000 viewer sessions/month',
      'Everything in Starter',
      'Advanced AI analytics',
      'AI audience insights',
      'Engagement heatmaps',
      'AI campaign summaries',
      'Viewer behavior intelligence',
      'Advanced response CRM',
      'Team collaboration',
      'Brand customization',
      'Priority AI processing',
      'Custom CTA buttons',
      'Drop-off analytics',
      'Audience retention analytics',
    ],
    cta: 'Start Free Trial',
    highlighted: true,
  },
]

const enterprise = {
  name: 'Enterprise',
  description: 'For large organizations training or engaging thousands of users globally.',
  features: [
    ['Infrastructure', ['Custom viewer session limits', 'Unlimited campaigns', 'Dedicated infrastructure', 'White-label platform', 'Custom domains & subdomains']],
    ['AI & LMS', ['AI-powered LMS generation', 'Employee & student dashboards', 'Admin analytics portal', 'Custom AI workflows', 'SCORM/xAPI support']],
    ['Security & Compliance', ['SSO authentication', 'API access', 'Audit logs', 'Compliance reporting', 'Advanced security controls']],
    ['Intelligence', ['Workforce analytics', 'Team completion tracking', 'Department performance', 'Regional learning analytics', 'Organization-wide insights']],
  ] as [string, string[]][],
  addons: ['AI Voice Dubbing', 'Custom Branding Studio', 'Dedicated CDN', 'Advanced API Access', 'Custom Integrations', 'On-premise deployment'],
}

export default function Pricing() {
  return (
    <section id="pricing" className="bg-background py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl">Simple, transparent pricing</h2>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto">Start free. Scale as you grow. No hidden fees.</p>
        </div>

        
        <div className="grid gap-4 md:grid-cols-3 items-end">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                'relative flex flex-col rounded-2xl border p-6 transition-all',
                plan.highlighted
                  ? 'border-primary/40 bg-primary/[0.03] shadow-lg shadow-primary/5 ring-1 ring-primary/20 md:-mt-4 md:pb-8'
                  : 'border-border bg-card'
              )}>
              {plan.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    <Sparkles className="size-3" />
                    Most Popular
                  </span>
                </div>
              )}

              <div>
                <h3 className="font-semibold text-foreground">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mt-1">{plan.description}</p>
              </div>

              <div className="mt-5 mb-6">
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground text-sm">{plan.period}</span>}
              </div>

              <ul className="flex-1 space-y-2.5 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <Check className="size-4 text-primary mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                variant={plan.highlighted ? 'default' : 'outline'}
                className="w-full rounded-xl h-11">
                <Link href="/signup">{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>

        
        <div className="mt-12 rounded-2xl border border-border bg-card p-8 md:p-10">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <Building2 className="size-5 text-primary" />
                <h3 className="text-xl font-semibold text-foreground">{enterprise.name}</h3>
              </div>
              <p className="text-muted-foreground text-sm max-w-md">{enterprise.description}</p>
            </div>
            <div className="shrink-0">
              <div className="mb-2">
                <span className="text-3xl font-bold text-foreground">Custom</span>
                <span className="text-muted-foreground text-sm ml-1">pricing</span>
              </div>
              <Button asChild className="rounded-xl h-11 px-6">
                <Link href="mailto:hello@luma.online" className="inline-flex items-center gap-2">
                  Contact Sales
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>

          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {enterprise.features.map(([category, items]) => (
              <div key={category}>
                <h4 className="text-sm font-semibold text-foreground mb-3">{category}</h4>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="size-3.5 text-primary mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          
          <div className="mt-8 pt-6 border-t border-border">
            <h4 className="text-sm font-semibold text-foreground mb-3">Optional Add-ons</h4>
            <div className="flex flex-wrap gap-2">
              {enterprise.addons.map((addon) => (
                <span key={addon} className="inline-flex items-center rounded-lg border border-border bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground">
                  {addon}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
