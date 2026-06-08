import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession } from '@/lib/payments'

/**
 * POST /api/payments/checkout
 * Creates a Dodo Payments checkout session
 * Body: { email, name, planId }
 */
export async function POST(request: NextRequest) {
  try {
    const { email, name, planId } = await request.json()

    if (!email || !planId) {
      return NextResponse.json({ error: 'Missing email or planId' }, { status: 400 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const session = await createCheckoutSession({
      customerEmail: email,
      customerName: name || email,
      planId,
      successUrl: `${baseUrl}/dashboard?payment=success`,
      cancelUrl: `${baseUrl}/dashboard/pricing?payment=cancelled`,
    })

    return NextResponse.json({ url: session.payment_link || session.url })
  } catch (error: any) {
    console.error('Checkout failed:', error)
    return NextResponse.json({ error: error.message || 'Checkout failed' }, { status: 500 })
  }
}
