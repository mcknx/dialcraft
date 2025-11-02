// components/UsageChart.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Usage } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function UsageChart() {
  const [usageHistory, setUsageHistory] = useState<Usage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsage() {
      try {
        const response = await fetch('/api/usage?limit=6');
        const result = await response.json();
        if (result.success) {
          setUsageHistory(result.data.reverse()); // Oldest first for chart
        }
      } catch (error) {
        console.error('Failed to fetch usage:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsage();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="animate-pulse h-6 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </CardHeader>
      </Card>
    );
  }

  // Find max values for scaling
  const maxCallMinutes = Math.max(...usageHistory.map(u => u.callMinutes), 1);
  const maxSms = Math.max(...usageHistory.map(u => u.smsCount), 1);
  const maxApiCalls = Math.max(...usageHistory.map(u => u.apiCalls), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage History (Last 6 Months)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Call Minutes Chart */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Call Minutes</h3>
            <div className="flex items-end gap-1 sm:gap-2 h-32">
              {usageHistory.map((usage, index) => {
                const height = (usage.callMinutes / maxCallMinutes) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-blue-100 rounded-t relative group cursor-pointer hover:bg-blue-200 transition-colors">
                      <div 
                        className="bg-blue-500 rounded-t transition-all"
                        style={{ height: `${height}%`, minHeight: '4px' }}
                      ></div>
                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-2 hidden group-hover:block bg-primary-foreground text-primary text-xs rounded py-1 px-2 whitespace-nowrap left-1/2 transform -translate-x-1/2 z-10">
                        {usage.callMinutes} min
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground mt-2">{usage.month.split('-')[1]}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SMS Chart */}
          <div>
            <h3 className="text-sm font-semibold mb-3">SMS Sent</h3>
            <div className="flex items-end gap-1 sm:gap-2 h-32">
              {usageHistory.map((usage, index) => {
                const height = (usage.smsCount / maxSms) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-green-100 rounded-t relative group cursor-pointer hover:bg-green-200 transition-colors">
                      <div 
                        className="bg-green-500 rounded-t transition-all"
                        style={{ height: `${height}%`, minHeight: '4px' }}
                      ></div>
                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-2 hidden group-hover:block bg-primary-foreground text-primary text-xs rounded py-1 px-2 whitespace-nowrap left-1/2 transform -translate-x-1/2 z-10">
                        {usage.smsCount} SMS
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground mt-2">{usage.month.split('-')[1]}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* API Calls Chart */}
          <div>
            <h3 className="text-sm font-semibold mb-3">API Calls</h3>
            <div className="flex items-end gap-1 sm:gap-2 h-32">
              {usageHistory.map((usage, index) => {
                const height = (usage.apiCalls / maxApiCalls) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-purple-100 rounded-t relative group cursor-pointer hover:bg-purple-200 transition-colors">
                      <div 
                        className="bg-purple-500 rounded-t transition-all"
                        style={{ height: `${height}%`, minHeight: '4px' }}
                      ></div>
                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-2 hidden group-hover:block bg-primary-foreground text-primary text-xs rounded py-1 px-2 whitespace-nowrap left-1/2 transform -translate-x-1/2 z-10">
                        {usage.apiCalls} calls
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground mt-2">{usage.month.split('-')[1]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

