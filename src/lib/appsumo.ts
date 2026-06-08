/**
 * AppSumo license redemption and management
 */

import { createServiceClient } from '@/lib/supabase'
import type { PlanId } from '@/lib/plans'

/**
 * Map AppSumo tier codes to Luma plans
 * Tier 1 = 1 code = Starter (lifetime)
 * Tier 2 = 2 codes = Pro (lifetime)
 * Tier 3 = 3 codes = Enterprise (lifetime)
 */
export function mapAppSumoTier(tier: number): PlanId {
  switch (tier) {
    case 1: return 'starter'
    case 2: return 'pro'
    case 3: return 'enterprise'
    default: return 'starter'
  }
}

/**
 * AppSumo lifetime deal limits (more generous than monthly plans)
 */
export const APPSUMO_LIMITS: Record<number, { campaigns: number; sessions: number; aiMinutes: number }> = {
  1: { campaigns: 5, sessions: 2000, aiMinutes: 50 },
  2: { campaigns: 25, sessions: 10000, aiMinutes: 200 },
  3: { campaigns: 100, sessions: 50000, aiMinutes: 500 },
}

/**
 * Validate an AppSumo license code
 * In production, this would call AppSumo's API
 */
export async function validateLicense(code: string): Promise<{ valid: boolean; tier: number; email?: string }> {
  // TODO: Replace with actual AppSumo API call
  // For now, accept any code format: LUMA-XXXXX-XXXXX
  const isValidFormat = /^LUMA-[A-Z0-9]{5}-[A-Z0-9]{5}$/.test(code.toUpperCase())

  if (!isValidFormat) {
    return { valid: false, tier: 0 }
  }

  // In production: call AppSumo's partner API to validate
  // const response = await fetch('https://appsumo.com/openapi/v1/licenses/validate', { ... })

  return { valid: true, tier: 1 } // Default to tier 1 for now
}

/**
 * Redeem an AppSumo license for a user
 */
export async function redeemLicense(userId: string, code: string, tier: number): Promise<{ success: boolean; error?: string }> {
  const supabase = createServiceClient()

  // Check if code is already redeemed (store redeemed codes in a separate table or as user metadata)
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('id', userId)
    .single()

  if (!existingUser) {
    return { success: false, error: 'User not found' }
  }

  // Upgrade user plan
  const plan = mapAppSumoTier(tier)
  const { error } = await supabase
    .from('users')
    .update({
      plan,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)

  if (error) {
    return { success: false, error: 'Failed to upgrade plan' }
  }

  return { success: true }
}
