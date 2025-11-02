// lib/billing.ts
// Billing logic to calculate costs and generate invoices
import { Usage, Invoice, Subscription } from '@/types';

// Pricing constants (per unit)
export const PRICING = {
  callMinutesRate: 0.05, // $0.05 per minute
  smsRate: 0.01, // $0.01 per SMS
  apiCallRate: 0.001, // $0.001 per API call
};

/**
 * Calculate usage fee based on usage metrics
 */
export function calculateUsageFee(usage: Usage): number {
  const callMinutesCost = usage.callMinutes * PRICING.callMinutesRate;
  const smsCost = usage.smsCount * PRICING.smsRate;
  const apiCallsCost = usage.apiCalls * PRICING.apiCallRate;

  return Number((callMinutesCost + smsCost + apiCallsCost).toFixed(2));
}

/**
 * Generate an invoice from usage data and subscription
 */
export function generateInvoice(
  usage: Usage,
  subscription: Subscription,
  userId: string
): Invoice {
  const usageFee = calculateUsageFee(usage);
  const totalAmount = Number((subscription.monthlyFee + usageFee).toFixed(2));

  // Parse month to get period dates
  const [year, month] = usage.month.split('-');
  const periodStart = new Date(parseInt(year), parseInt(month) - 1, 1);
  const periodEnd = new Date(parseInt(year), parseInt(month), 0); // Last day of month

  // Due date is 7 days after period end
  const dueDate = new Date(periodEnd);
  dueDate.setDate(dueDate.getDate() + 7);

  // Generate invoice number
  const invoiceNumber = `INV-${year}-${month}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

  const invoice: Invoice = {
    id: `inv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    invoiceNumber,
    status: 'pending',
    amount: totalAmount,
    subscriptionFee: subscription.monthlyFee,
    usageFee,
    breakdown: {
      callMinutes: usage.callMinutes,
      smsCount: usage.smsCount,
      apiCalls: usage.apiCalls,
    },
    periodStart,
    periodEnd,
    dueDate,
    createdAt: new Date(),
  };

  return invoice;
}

/**
 * Calculate total usage across all metrics
 */
export function calculateTotalUsage(usageHistory: Usage[]): {
  callMinutes: number;
  smsCount: number;
  apiCalls: number;
} {
  return usageHistory.reduce(
    (total, usage) => ({
      callMinutes: total.callMinutes + usage.callMinutes,
      smsCount: total.smsCount + usage.smsCount,
      apiCalls: total.apiCalls + usage.apiCalls,
    }),
    { callMinutes: 0, smsCount: 0, apiCalls: 0 }
  );
}

/**
 * Get usage cost breakdown
 */
export function getUsageCostBreakdown(usage: Usage) {
  return {
    callMinutes: {
      quantity: usage.callMinutes,
      rate: PRICING.callMinutesRate,
      cost: Number((usage.callMinutes * PRICING.callMinutesRate).toFixed(2)),
    },
    sms: {
      quantity: usage.smsCount,
      rate: PRICING.smsRate,
      cost: Number((usage.smsCount * PRICING.smsRate).toFixed(2)),
    },
    apiCalls: {
      quantity: usage.apiCalls,
      rate: PRICING.apiCallRate,
      cost: Number((usage.apiCalls * PRICING.apiCallRate).toFixed(2)),
    },
  };
}

