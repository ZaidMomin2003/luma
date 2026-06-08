import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature, mapProductToPlan } from '@/lib/payments'
import { createServiceClient } from '@/lib/supabase'


export async function POST(request: NextRequest) {
  try {
    const payload = await request.text()
    const signature = request.headers.get('x-dodo-signature') || ''
    if (process.env.DODO_WEBHOOK_SECRET && !verifyWebhookSignature(payload, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const event = JSON.parse(payload)
    const supabase = createServiceClient()

    switch (event.type) {
      case 'subscription.active':
      case 'subscription.created': {
        const email = event.data.customer?.email
        const productId = event.data.product_id
        const subscriptionId = event.data.id

        if (!email) break

        const plan = mapProductToPlan(productId)

        await supabase
          .from('users')
          .update({
            plan,
            updated_at: new Date().toISOString(),
          })
          .eq('email', email)

        console.log(`[Webhook] Upgraded ${email} to ${plan} (sub: ${subscriptionId})`)
        break
      }

      case 'subscription.cancelled':
      case 'subscription.expired': {
        const email = event.data.customer?.email
        if (!email) break

        await supabase
          .from('users')
          .update({
            plan: 'free',
            updated_at: new Date().toISOString(),
          })
          .eq('email', email)

        console.log(`[Webhook] Downgraded ${email} to free`)
        break
      }

      case 'subscription.past_due': {
        const email = event.data.customer?.email
        console.log(`[Webhook] Payment past due for ${email}`)
        break
      }

      default:
        console.log(`[Webhook] Unhandled event: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook processing failed:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
