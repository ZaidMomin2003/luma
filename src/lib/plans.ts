/**
 * Plan definitions and limits for Luma
 */

export type PlanId = 'free' | 'starter' | 'pro' | 'enterprise'

export interface PlanLimits {
  campaigns: number
  sessionsPerMonth: number
  aiMinutes: number
  languages: number
  branding: boolean
  analytics: 'basic' | 'advanced' | 'full'
  teamMembers: number
  apiAccess: boolean
}

export const PLANS: Record<PlanId, { name: string; price: number; limits: PlanLimits }> = {
  free: {
    name: 'Free Trial',
    price: 0,
    limits: {
      campaigns: 1,
      sessionsPerMonth: 100,
      aiMinutes: 10,
      languages: 1,
      branding: false,
      analytics: 'basic',
      teamMembers: 1,
      apiAccess: false,
    },
  },
  starter: {
    name: 'Starter',
    price: 29,
    limits: {
      campaigns: 3,
      sessionsPerMonth: 1000,
      aiMinutes: 30,
      languages: 5,
      branding: false,
      analytics: 'advanced',
      teamMembers: 2,
      apiAccess: false,
    },
  },
  pro: {
    name: 'Pro',
    price: 249,
    limits: {
      campaigns: 20,
      sessionsPerMonth: 8000,
      aiMinutes: 100,
      languages: 50,
      branding: true,
      analytics: 'full',
      teamMembers: 10,
      apiAccess: true,
    },
  },
  enterprise: {
    name: 'Enterprise',
    price: 0, // Custom pricing
    limits: {
      campaigns: 999,
      sessionsPerMonth: 999999,
      aiMinutes: 999,
      languages: 50,
      branding: true,
      analytics: 'full',
      teamMembers: 999,
      apiAccess: true,
    },
  },
}

/**
 * Check if a user has exceeded their plan limits
 */
export function checkLimit(plan: PlanId, metric: keyof PlanLimits, currentValue: number): { allowed: boolean; limit: number; remaining: number } {
  const limit = PLANS[plan].limits[metric] as number
  return {
    allowed: currentValue < limit,
    limit,
    remaining: Math.max(0, limit - currentValue),
  }
}
