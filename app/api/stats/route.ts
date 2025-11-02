// app/api/stats/route.ts
// API endpoint for dashboard statistics
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { calculateTotalUsage } from '@/lib/billing';

/**
 * GET /api/stats - Get comprehensive dashboard statistics
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || 'user-1'; // Default to demo user

    // Get subscription
    const subscription = db.getSubscription(userId);
    
    // Get usage history
    const usageHistory = db.getUserUsageHistory(userId, 6);
    const currentUsage = usageHistory[0];
    
    // Get invoices
    const invoices = db.getUserInvoices(userId);
    const pendingInvoices = invoices.filter(inv => inv.status === 'pending');
    const paidInvoices = invoices.filter(inv => inv.status === 'paid');
    
    // Calculate totals
    const totalUsage = calculateTotalUsage(usageHistory);
    const totalSpent = paidInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    const pendingAmount = pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0);

    return NextResponse.json({
      success: true,
      data: {
        subscription: {
          plan: subscription?.plan || 'none',
          status: subscription?.status || 'inactive',
          monthlyFee: subscription?.monthlyFee || 0,
          currentPeriodEnd: subscription?.currentPeriodEnd,
        },
        currentUsage: {
          callMinutes: currentUsage?.callMinutes || 0,
          smsCount: currentUsage?.smsCount || 0,
          apiCalls: currentUsage?.apiCalls || 0,
          month: currentUsage?.month || '',
        },
        totals: {
          totalSpent: Number(totalSpent.toFixed(2)),
          pendingAmount: Number(pendingAmount.toFixed(2)),
          invoiceCount: invoices.length,
          ...totalUsage,
        },
        recentInvoices: invoices.slice(0, 3),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}

