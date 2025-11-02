// components/InvoiceHistory.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Invoice } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';

export default function InvoiceHistory() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    async function fetchInvoices() {
      try {
        const response = await fetch('/api/invoices');
        const result = await response.json();
        if (result.success) {
          setInvoices(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch invoices:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchInvoices();
  }, []);

  if (loading) {
    return (
      <Card>
        <div className="animate-pulse p-6">
          <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  const statusVariants = {
    paid: 'default',
    pending: 'secondary',
    overdue: 'destructive',
  } as const;

  const StatusIconComponent = {
    paid: CheckCircle2,
    pending: Clock,
    overdue: XCircle,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice History</CardTitle>
      </CardHeader>
      <CardContent>
        {invoices.length === 0 ? (
          <p className="text-muted-foreground">No invoices found.</p>
        ) : (
          <div className="space-y-3">
            {invoices.map((invoice) => {
              const StatusIcon = StatusIconComponent[invoice.status];
              return (
                <div
                  key={invoice.id}
                  className="border rounded-lg p-4 hover:bg-accent transition-colors cursor-pointer"
                  onClick={() => setSelectedInvoice(invoice)}
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-semibold">{invoice.invoiceNumber}</h3>
                        <Badge variant={statusVariants[invoice.status]} className="flex items-center gap-1">
                          <StatusIcon className="w-3 h-3" />
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(invoice.periodStart).toLocaleDateString()} - {new Date(invoice.periodEnd).toLocaleDateString()}
                      </p>
                      {invoice.status === 'pending' && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Due: {new Date(invoice.dueDate).toLocaleDateString()}
                        </p>
                      )}
                      {invoice.status === 'paid' && invoice.paidAt && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Paid: {new Date(invoice.paidAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-2xl font-bold">${invoice.amount.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground mt-1">Click for details</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      {/* Invoice Detail Dialog */}
      <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
        {selectedInvoice && (
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedInvoice.invoiceNumber}</DialogTitle>
              <p className="text-muted-foreground">Invoice Details</p>
            </DialogHeader>

            <div className="space-y-6">
              {/* Status */}
              <div className="flex items-center gap-3">
                <Badge variant={statusVariants[selectedInvoice.status]} className="flex items-center gap-2">
                  {React.createElement(StatusIconComponent[selectedInvoice.status], { className: "w-4 h-4" })}
                  {selectedInvoice.status.charAt(0).toUpperCase() + selectedInvoice.status.slice(1)}
                </Badge>
              </div>

              {/* Period */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Billing Period</h3>
                <p className="text-muted-foreground">
                  {new Date(selectedInvoice.periodStart).toLocaleDateString()} - {new Date(selectedInvoice.periodEnd).toLocaleDateString()}
                </p>
              </div>

              {/* Charges Breakdown */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Charges</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subscription Fee</span>
                    <span className="font-medium">${selectedInvoice.subscriptionFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Usage Charges</span>
                      <span className="font-medium">${selectedInvoice.usageFee.toFixed(2)}</span>
                    </div>
                    <div className="ml-4 space-y-1 text-sm">
                      <div className="flex justify-between text-muted-foreground">
                        <span>• Call Minutes ({selectedInvoice.breakdown.callMinutes} × $0.05)</span>
                        <span>${(selectedInvoice.breakdown.callMinutes * 0.05).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>• SMS Messages ({selectedInvoice.breakdown.smsCount} × $0.01)</span>
                        <span>${(selectedInvoice.breakdown.smsCount * 0.01).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>• API Calls ({selectedInvoice.breakdown.apiCalls} × $0.001)</span>
                        <span>${(selectedInvoice.breakdown.apiCalls * 0.001).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-semibold">Total Amount</span>
                  <span className="text-3xl font-bold text-primary">${selectedInvoice.amount.toFixed(2)}</span>
                </div>
              </div>

              {/* Dates */}
              <div className="border-t pt-4 text-sm text-muted-foreground space-y-1">
                <p>Invoice Date: {new Date(selectedInvoice.createdAt).toLocaleDateString()}</p>
                <p>Due Date: {new Date(selectedInvoice.dueDate).toLocaleDateString()}</p>
                {selectedInvoice.paidAt && (
                  <p>Paid Date: {new Date(selectedInvoice.paidAt).toLocaleDateString()}</p>
                )}
              </div>

              {/* Action Button */}
              {selectedInvoice.status === 'pending' && (
                <div className="border-t pt-4">
                  <Button className="w-full">Pay Invoice</Button>
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </Card>
  );
}

