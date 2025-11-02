// app/api/usage/route.ts
// API endpoint for usage tracking and retrieval
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { Usage } from '@/types';

/**
 * GET /api/usage - Retrieve usage history for a user
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || 'user-1'; // Default to demo user
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    const usageHistory = db.getUserUsageHistory(userId, limit);

    return NextResponse.json({
      success: true,
      data: usageHistory,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch usage data' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/usage - Record new usage data
 * This simulates an external system reporting usage
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    if (!body.userId || !body.month) {
      return NextResponse.json(
        { success: false, error: 'userId and month are required' },
        { status: 400 }
      );
    }

    // Create usage record
    const usage: Usage = {
      id: `usage-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: body.userId,
      month: body.month,
      callMinutes: body.callMinutes || 0,
      smsCount: body.smsCount || 0,
      apiCalls: body.apiCalls || 0,
      recordedAt: new Date(),
    };

    const recordedUsage = db.recordUsage(usage);

    return NextResponse.json({
      success: true,
      data: recordedUsage,
      message: 'Usage recorded successfully',
    }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to record usage' },
      { status: 500 }
    );
  }
}

