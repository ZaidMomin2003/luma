'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Check, Sparkles, Building2, ArrowRight, ArrowLeft } from 'lucide-react'
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
    cta: 'Current Plan',
    highlighted: false,
    current: true,
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
    cta: 'Upgrade',
    highlighted: false,
    current: false,
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
    cta: 'Upgrade to Pro',
    highlighted: true,
    current: false,
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

export default function DashboardPricingPage() {
  return (
    <div className="space-y-8 relative">
      
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2000&auto=format&fit=crop"
          alt=""
          className="size-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/80 to-transparent" />
      </div>
      
      <div className="relative z-10 flex items-start gap-4">
        <Link href="/dashboard" className="p-2 rounded-lg hover:bg-white/[0.04] transition-colors mt-0.5">
          <ArrowLeft size={18} className="text-muted-foreground" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Upgrade your plan</h1>
          <p className="text-sm text-muted-foreground mt-1">Choose the plan that fits your needs. Scale anytime.</p>
        </div>
      </div>

      
      <div className="relative z-10 grid gap-4 md:grid-cols-3 items-end">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              'relative flex flex-col rounded-2xl border p-6 transition-all',
              plan.highlighted
                ? 'border-emerald-500/30 bg-emerald-500/[0.03] shadow-lg shadow-emerald-500/5 ring-1 ring-emerald-500/20 md:-mt-4 md:pb-8'
                : 'border-white/[0.06] bg-white/[0.02]',
              plan.current && 'opacity-60'
            )}>
            {plan.highlighted && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-xs font-medium text-white">
                  <Sparkles className="size-3" />
                  Recommended
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
                  <Check className="size-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              variant={plan.highlighted ? 'default' : 'outline'}
              className={cn('w-full rounded-xl h-11', !plan.highlighted && 'border-white/[0.08]')}
              disabled={plan.current}
            >
              {plan.cta}
            </Button>
          </div>
        ))}
      </div>

      
      <div className="relative z-10 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 md:p-10">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <Building2 className="size-5 text-emerald-400" />
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
                    <Check className="size-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        
        <div className="mt-8 pt-6 border-t border-white/[0.06]">
          <h4 className="text-sm font-semibold text-foreground mb-3">Optional Add-ons</h4>
          <div className="flex flex-wrap gap-2">
            {enterprise.addons.map((addon) => (
              <span key={addon} className="inline-flex items-center rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-xs text-muted-foreground">
                {addon}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
