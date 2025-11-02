// app/page.tsx
'use client';

import Layout from '@/components/Layout';
import DashboardStats from '@/components/DashboardStats';
import UsageChart from '@/components/UsageChart';
import SubscriptionStatus from '@/components/SubscriptionStatus';
import InvoiceHistory from '@/components/InvoiceHistory';

// Main component that renders different views based on active tab
function MainContent({ activeTab }: { activeTab?: string }) {
  if (activeTab === 'subscription') {
    return (
      <div>
        <SubscriptionStatus />
      </div>
    );
  }

  if (activeTab === 'usage') {
    return (
      <div>
        <UsageChart />
      </div>
    );
  }

  if (activeTab === 'invoices') {
    return (
      <div>
        <InvoiceHistory />
      </div>
    );
  }

  // Default: Dashboard view
  return (
    <div className="space-y-6">
      <DashboardStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage Chart */}
        <UsageChart />

        {/* Subscription Info */}
        <SubscriptionStatus />
      </div>

      {/* Recent Invoices */}
      <InvoiceHistory />
    </div>
  );
}

// This is the homepage of our app
export default function HomePage() {
  return (
    <Layout>
      <MainContent />
    </Layout>
  );
}