import { NextRequest, NextResponse } from 'next/server'
import { getDashboardStats } from '@/lib/analytics'


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    const stats = await getDashboardStats(userId)
    return NextResponse.json(stats)
  } catch (error: any) {
    console.error('Dashboard stats failed:', error)
    return NextResponse.json({ error: error.message || 'Failed to fetch stats' }, { status: 500 })
  }
}
