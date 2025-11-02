// app/api/invoices/route.ts
// API endpoint for invoice management
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { generateInvoice } from '@/lib/billing';

/**
 * GET /api/invoices - Retrieve invoices for a user
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || 'user-1'; // Default to demo user

    const invoices = db.getUserInvoices(userId);

    return NextResponse.json({
      success: true,
      data: invoices,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/invoices - Generate a new invoice from usage data
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

    // Get usage data for the month
    const usage = db.getUsageByMonth(body.userId, body.month);
    if (!usage) {
      return NextResponse.json(
        { success: false, error: 'No usage data found for the specified month' },
        { status: 404 }
      );
    }

    // Get subscription
    const subscription = db.getSubscription(body.userId);
    if (!subscription) {
      return NextResponse.json(
        { success: false, error: 'No active subscription found' },
        { status: 404 }
      );
    }

    // Generate invoice
    const invoice = generateInvoice(usage, subscription, body.userId);
    
    // Save invoice
    const savedInvoice = db.createInvoice(invoice);

    return NextResponse.json({
      success: true,
      data: savedInvoice,
      message: 'Invoice generated successfully',
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to generate invoice' },
      { status: 500 }
    );
  }
}

