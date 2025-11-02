// app/api/subscription/route.ts
// API endpoint for subscription management
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

/**
 * GET /api/subscription - Retrieve subscription for a user
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || 'user-1'; // Default to demo user

    const subscription = db.getSubscription(userId);

    if (!subscription) {
      return NextResponse.json(
        { success: false, error: 'Subscription not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: subscription,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subscription' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/subscription - Update subscription
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.subscriptionId) {
      return NextResponse.json(
        { success: false, error: 'subscriptionId is required' },
        { status: 400 }
      );
    }

    const updatedSubscription = db.updateSubscription(body.subscriptionId, {
      status: body.status,
      plan: body.plan,
    });

    if (!updatedSubscription) {
      return NextResponse.json(
        { success: false, error: 'Subscription not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedSubscription,
      message: 'Subscription updated successfully',
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to update subscription' },
      { status: 500 }
    );
  }
}

