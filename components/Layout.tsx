// components/Layout.tsx
'use client';

import React, { useState } from 'react';
import { Menu, Home, CheckSquare, BarChart3, FileText, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

// This component will wrap our pages to provide a consistent layout
export default function Layout({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const NavItem = ({ id, icon: Icon, label }: { id: string; icon: any; label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 py-3 px-4 rounded-lg transition-colors ${
        activeTab === id
          ? 'bg-primary/10 text-primary font-medium'
          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
      }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );

  const SidebarContent = () => (
    <>
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Phone className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold">DialCraft</h1>
            <p className="text-xs text-muted-foreground">Billing Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        <NavItem id="dashboard" icon={Home} label="Dashboard" />
        <NavItem id="subscription" icon={CheckSquare} label="Subscription" />
        <NavItem id="usage" icon={BarChart3} label="Usage Analytics" />
        <NavItem id="invoices" icon={FileText} label="Invoices" />
      </nav>

      <div className="p-4 border-t">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold">DU</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Demo User</p>
            <p className="text-xs text-muted-foreground truncate">demo@example.com</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile Menu Trigger */}
      <Sheet>
        <div className="md:hidden fixed top-4 left-4 z-40">
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
        </div>

        {/* Mobile Sidebar */}
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-card border-r shadow-sm flex-col">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-card border-b shadow-sm sticky top-0 z-30">
          <div className="p-4 md:px-8 md:py-6">
            <h1 className="text-2xl md:text-3xl font-bold">
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'subscription' && 'Subscription Management'}
              {activeTab === 'usage' && 'Usage Analytics'}
              {activeTab === 'invoices' && 'Invoice History'}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              {activeTab === 'dashboard' && 'Overview of your account and recent activity'}
              {activeTab === 'subscription' && 'Manage your subscription plan and billing'}
              {activeTab === 'usage' && 'Track your usage metrics over time'}
              {activeTab === 'invoices' && 'View and manage your billing invoices'}
            </p>
          </div>
        </header>
        <div className="p-4 md:p-8">
          {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, { activeTab } as any);
            }
            return child;
          })}
        </div>
      </main>
    </div>
  );
}