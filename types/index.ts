// types/index.ts
// Core data models for the billing portal

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: 'basic' | 'pro' | 'enterprise';
  status: 'active' | 'cancelled' | 'past_due';
  startDate: Date;
  currentPeriodEnd: Date;
  monthlyFee: number;
}

export interface Usage {
  id: string;
  userId: string;
  month: string; // Format: YYYY-MM
  callMinutes: number;
  smsCount: number;
  apiCalls: number;
  recordedAt: Date;
}

export interface Invoice {
  id: string;
  userId: string;
  invoiceNumber: string;
  status: 'paid' | 'pending' | 'overdue';
  amount: number;
  subscriptionFee: number;
  usageFee: number;
  breakdown: {
    callMinutes: number;
    smsCount: number;
    apiCalls: number;
  };
  periodStart: Date;
  periodEnd: Date;
  dueDate: Date;
  paidAt?: Date;
  createdAt: Date;
}

export interface UsageStats {
  current: Usage;
  history: Usage[];
  total: {
    callMinutes: number;
    smsCount: number;
    apiCalls: number;
  };
}

