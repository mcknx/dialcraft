// components/DashboardStats.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Stats {
  subscription: {
    plan: string;
    status: string;
    monthlyFee: number;
    currentPeriodEnd: Date;
  };
  currentUsage: {
    callMinutes: number;
    smsCount: number;
    apiCalls: number;
    month: string;
  };
  totals: {
    totalSpent: number;
    pendingAmount: number;
    invoiceCount: number;
    callMinutes: number;
    smsCount: number;
    apiCalls: number;
  };
}

export default function DashboardStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/stats');
        const result = await response.json();
        if (result.success) {
          setStats(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return <Card className="text-destructive">Failed to load statistics</Card>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">
            Call Minutes (This Month)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats.currentUsage.callMinutes.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">Minutes used</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">
            SMS Sent (This Month)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats.currentUsage.smsCount.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">Messages sent</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">
            API Calls (This Month)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats.currentUsage.apiCalls.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">API requests</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-primary">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">
            Total Spent
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">${stats.totals.totalSpent.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-1">{stats.totals.invoiceCount} invoices paid</p>
        </CardContent>
      </Card>
    </div>
  );
}