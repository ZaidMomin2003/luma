import { NextRequest, NextResponse } from 'next/server'
import { validateLicense, redeemLicense } from '@/lib/appsumo'


export async function POST(request: NextRequest) {
  try {
    const { userId, code } = await request.json()

    if (!userId || !code) {
      return NextResponse.json({ error: 'Missing userId or code' }, { status: 400 })
    }
    const validation = await validateLicense(code)

    if (!validation.valid) {
      return NextResponse.json({ error: 'Invalid license code. Please check and try again.' }, { status: 400 })
    }
    const result = await redeemLicense(userId, code, validation.tier)

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Redemption failed' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      tier: validation.tier,
      message: `License redeemed! You've been upgraded to Tier ${validation.tier}.`,
    })
  } catch (error: any) {
    console.error('Redeem failed:', error)
    return NextResponse.json({ error: error.message || 'Redemption failed' }, { status: 500 })
  }
}
