import crypto from 'crypto'

/**
 * Dodo Payments integration
 * Handles subscription creation, webhook processing, and plan management
 */

const DODO_API_URL = process.env.DODO_API_URL || 'https://api.dodopayments.com'
const DODO_API_KEY = process.env.DODO_API_KEY || ''

interface CreateSubscriptionParams {
  customerEmail: string
  customerName: string
  planId: string // Dodo product/plan ID
  successUrl: string
  cancelUrl: string
}

interface DodoSubscription {
  id: string
  status: 'active' | 'cancelled' | 'past_due' | 'trialing'
  plan_id: string
  current_period_end: string
}

/**
 * Create a checkout session for a subscription
 */
export async function createCheckoutSession(params: CreateSubscriptionParams) {
  const response = await fetch(`${DODO_API_URL}/subscriptions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${DODO_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      customer: {
        email: params.customerEmail,
        name: params.customerName,
      },
      product_id: params.planId,
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      payment_link: true,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Dodo payment failed: ${err}`)
  }

  return response.json()
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(subscriptionId: string) {
  const response = await fetch(`${DODO_API_URL}/subscriptions/${subscriptionId}/cancel`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${DODO_API_KEY}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) throw new Error('Failed to cancel subscription')
  return response.json()
}

/**
 * Get subscription details
 */
export async function getSubscription(subscriptionId: string): Promise<DodoSubscription> {
  const response = await fetch(`${DODO_API_URL}/subscriptions/${subscriptionId}`, {
    headers: { 'Authorization': `Bearer ${DODO_API_KEY}` },
  })

  if (!response.ok) throw new Error('Failed to fetch subscription')
  return response.json()
}

/**
 * Verify webhook signature from Dodo
 */
export function verifyWebhookSignature(payload: string, signature: string): boolean {
  const webhookSecret = process.env.DODO_WEBHOOK_SECRET || ''
  const computed = crypto
    .createHmac('sha256', webhookSecret)
    .update(payload)
    .digest('hex')
  return computed === signature
}

/**
 * Map Dodo product IDs to Luma plan IDs
 */
export function mapProductToPlan(productId: string): 'free' | 'starter' | 'pro' | 'enterprise' {
  const mapping: Record<string, 'starter' | 'pro' | 'enterprise'> = {
    [process.env.DODO_STARTER_PRODUCT_ID || '']: 'starter',
    [process.env.DODO_PRO_PRODUCT_ID || '']: 'pro',
    [process.env.DODO_ENTERPRISE_PRODUCT_ID || '']: 'enterprise',
  }
  return mapping[productId] || 'free'
}
