import { NextRequest, NextResponse } from 'next/server'
import { cancelSubscription } from '@/lib/payments'

/**
 * POST /api/payments/cancel
 * Cancel user's subscription
 * Body: { subscriptionId }
 */
export async function POST(request: NextRequest) {
  try {
    const { subscriptionId } = await request.json()

    if (!subscriptionId) {
      return NextResponse.json({ error: 'Missing subscriptionId' }, { status: 400 })
    }

    await cancelSubscription(subscriptionId)

    return NextResponse.json({ success: true, message: 'Subscription will end at current billing period' })
  } catch (error: any) {
    console.error('Cancel failed:', error)
    return NextResponse.json({ error: error.message || 'Cancellation failed' }, { status: 500 })
  }
}
