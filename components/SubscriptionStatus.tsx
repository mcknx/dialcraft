// components/SubscriptionStatus.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Subscription } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';

export default function SubscriptionStatus() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubscription() {
      try {
        const response = await fetch('/api/subscription');
        const result = await response.json();
        if (result.success) {
          setSubscription(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch subscription:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSubscription();
  }, []);

  if (loading) {
    return (
      <Card>
        <div className="animate-pulse p-6">
          <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No active subscription found.</p>
        </CardContent>
      </Card>
    );
  }

  const statusVariants = {
    active: 'default',
    cancelled: 'destructive',
    past_due: 'secondary',
  } as const;

  const planNames = {
    basic: 'Basic Plan',
    pro: 'Pro Plan',
    enterprise: 'Enterprise Plan',
  };

  const periodEnd = new Date(subscription.currentPeriodEnd);
  const daysRemaining = Math.ceil((periodEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Subscription Status</CardTitle>
        <Badge variant={statusVariants[subscription.status]}>
          {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Plan Details */}
        <div className="border-b pb-4">
          <h3 className="text-2xl font-bold text-primary">{planNames[subscription.plan]}</h3>
          <p className="text-3xl font-bold mt-2">
            ${subscription.monthlyFee}
            <span className="text-lg font-normal text-muted-foreground">/month</span>
          </p>
        </div>

        {/* Billing Period */}
        <div>
          <p className="text-sm text-muted-foreground">Current Billing Period</p>
          <p className="text-lg font-semibold">
            {new Date(subscription.startDate).toLocaleDateString()} - {periodEnd.toLocaleDateString()}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {daysRemaining > 0 
              ? `${daysRemaining} days remaining` 
              : 'Period ended'}
          </p>
        </div>

        {/* Plan Features */}
        <div className="pt-4 border-t">
          <h4 className="font-semibold mb-3">Plan Includes:</h4>
          <ul className="space-y-2">
            <li className="flex items-center">
              <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
              Unlimited API calls
            </li>
            <li className="flex items-center">
              <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
              Pay-as-you-go usage billing
            </li>
            <li className="flex items-center">
              <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
              Priority support
            </li>
            <li className="flex items-center">
              <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
              Advanced analytics
            </li>
          </ul>
        </div>

        {/* Pricing Info */}
        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-semibold mb-2">Usage Pricing</h4>
          <ul className="text-sm space-y-1">
            <li>• Call Minutes: $0.05/minute</li>
            <li>• SMS Messages: $0.01/message</li>
            <li>• API Calls: $0.001/call</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

