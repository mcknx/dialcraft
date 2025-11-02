// lib/database.ts
// Mock database layer - In production, this would connect to MongoDB or PostgreSQL
import { User, Subscription, Usage, Invoice } from '@/types';

// In-memory storage (simulating a database)
let users: User[] = [];
let subscriptions: Subscription[] = [];
let usageRecords: Usage[] = [];
let invoices: Invoice[] = [];

// Seed initial data
function seedDatabase() {
  // Create demo user
  const demoUser: User = {
    id: 'user-1',
    email: 'demo@example.com',
    name: 'Demo User',
    createdAt: new Date('2024-01-01'),
  };

  // Create active subscription
  const demoSubscription: Subscription = {
    id: 'sub-1',
    userId: 'user-1',
    plan: 'pro',
    status: 'active',
    startDate: new Date('2024-01-01'),
    currentPeriodEnd: new Date('2025-11-30'),
    monthlyFee: 29.99,
  };

  // Create usage records for the past 6 months
  const usageData: Usage[] = [
    {
      id: 'usage-1',
      userId: 'user-1',
      month: '2024-06',
      callMinutes: 450,
      smsCount: 1200,
      apiCalls: 5600,
      recordedAt: new Date('2024-06-30'),
    },
    {
      id: 'usage-2',
      userId: 'user-1',
      month: '2024-07',
      callMinutes: 520,
      smsCount: 1350,
      apiCalls: 6200,
      recordedAt: new Date('2024-07-31'),
    },
    {
      id: 'usage-3',
      userId: 'user-1',
      month: '2024-08',
      callMinutes: 380,
      smsCount: 980,
      apiCalls: 4800,
      recordedAt: new Date('2024-08-31'),
    },
    {
      id: 'usage-4',
      userId: 'user-1',
      month: '2024-09',
      callMinutes: 610,
      smsCount: 1450,
      apiCalls: 7100,
      recordedAt: new Date('2024-09-30'),
    },
    {
      id: 'usage-5',
      userId: 'user-1',
      month: '2024-10',
      callMinutes: 495,
      smsCount: 1280,
      apiCalls: 6300,
      recordedAt: new Date('2024-10-31'),
    },
    {
      id: 'usage-6',
      userId: 'user-1',
      month: '2024-11',
      callMinutes: 425,
      smsCount: 1150,
      apiCalls: 5900,
      recordedAt: new Date('2024-11-01'),
    },
  ];

  // Create invoice history
  const invoiceData: Invoice[] = [
    {
      id: 'inv-1',
      userId: 'user-1',
      invoiceNumber: 'INV-2024-08-001',
      status: 'paid',
      amount: 59.94,
      subscriptionFee: 29.99,
      usageFee: 29.95,
      breakdown: {
        callMinutes: 380,
        smsCount: 980,
        apiCalls: 4800,
      },
      periodStart: new Date('2024-08-01'),
      periodEnd: new Date('2024-08-31'),
      dueDate: new Date('2024-09-07'),
      paidAt: new Date('2024-09-05'),
      createdAt: new Date('2024-09-01'),
    },
    {
      id: 'inv-2',
      userId: 'user-1',
      invoiceNumber: 'INV-2024-09-001',
      status: 'paid',
      amount: 74.49,
      subscriptionFee: 29.99,
      usageFee: 44.50,
      breakdown: {
        callMinutes: 610,
        smsCount: 1450,
        apiCalls: 7100,
      },
      periodStart: new Date('2024-09-01'),
      periodEnd: new Date('2024-09-30'),
      dueDate: new Date('2024-10-07'),
      paidAt: new Date('2024-10-03'),
      createdAt: new Date('2024-10-01'),
    },
    {
      id: 'inv-3',
      userId: 'user-1',
      invoiceNumber: 'INV-2024-10-001',
      status: 'paid',
      amount: 64.94,
      subscriptionFee: 29.99,
      usageFee: 34.95,
      breakdown: {
        callMinutes: 495,
        smsCount: 1280,
        apiCalls: 6300,
      },
      periodStart: new Date('2024-10-01'),
      periodEnd: new Date('2024-10-31'),
      dueDate: new Date('2024-11-07'),
      paidAt: new Date('2024-11-04'),
      createdAt: new Date('2024-11-01'),
    },
    {
      id: 'inv-4',
      userId: 'user-1',
      invoiceNumber: 'INV-2024-11-001',
      status: 'pending',
      amount: 59.74,
      subscriptionFee: 29.99,
      usageFee: 29.75,
      breakdown: {
        callMinutes: 425,
        smsCount: 1150,
        apiCalls: 5900,
      },
      periodStart: new Date('2024-11-01'),
      periodEnd: new Date('2024-11-30'),
      dueDate: new Date('2024-12-07'),
      createdAt: new Date('2024-12-01'),
    },
  ];

  users = [demoUser];
  subscriptions = [demoSubscription];
  usageRecords = usageData;
  invoices = invoiceData;
}

// Initialize database
seedDatabase();

// Database operations
export const db = {
  // Users
  getUser: (id: string): User | undefined => {
    return users.find(u => u.id === id);
  },

  // Subscriptions
  getSubscription: (userId: string): Subscription | undefined => {
    return subscriptions.find(s => s.userId === userId);
  },

  updateSubscription: (id: string, updates: Partial<Subscription>): Subscription | undefined => {
    const index = subscriptions.findIndex(s => s.id === id);
    if (index !== -1) {
      subscriptions[index] = { ...subscriptions[index], ...updates };
      return subscriptions[index];
    }
    return undefined;
  },

  // Usage
  getUsageByMonth: (userId: string, month: string): Usage | undefined => {
    return usageRecords.find(u => u.userId === userId && u.month === month);
  },

  getUserUsageHistory: (userId: string, limit?: number): Usage[] => {
    const usage = usageRecords
      .filter(u => u.userId === userId)
      .sort((a, b) => b.recordedAt.getTime() - a.recordedAt.getTime());
    return limit ? usage.slice(0, limit) : usage;
  },

  recordUsage: (usage: Usage): Usage => {
    // Check if usage for this month already exists
    const existingIndex = usageRecords.findIndex(
      u => u.userId === usage.userId && u.month === usage.month
    );

    if (existingIndex !== -1) {
      // Update existing usage
      usageRecords[existingIndex] = {
        ...usageRecords[existingIndex],
        callMinutes: usageRecords[existingIndex].callMinutes + usage.callMinutes,
        smsCount: usageRecords[existingIndex].smsCount + usage.smsCount,
        apiCalls: usageRecords[existingIndex].apiCalls + usage.apiCalls,
        recordedAt: new Date(),
      };
      return usageRecords[existingIndex];
    } else {
      // Create new usage record
      usageRecords.push(usage);
      return usage;
    }
  },

  // Invoices
  getInvoice: (id: string): Invoice | undefined => {
    return invoices.find(i => i.id === id);
  },

  getUserInvoices: (userId: string): Invoice[] => {
    return invoices
      .filter(i => i.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  createInvoice: (invoice: Invoice): Invoice => {
    invoices.push(invoice);
    return invoice;
  },

  updateInvoice: (id: string, updates: Partial<Invoice>): Invoice | undefined => {
    const index = invoices.findIndex(i => i.id === id);
    if (index !== -1) {
      invoices[index] = { ...invoices[index], ...updates };
      return invoices[index];
    }
    return undefined;
  },

  // Reset database (useful for testing)
  reset: () => {
    seedDatabase();
  },
};

