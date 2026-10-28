'use client';

import React, { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { CartProvider } from '@/lib/cart-context';
import { ToastContainer } from '@/components/Toast';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { MobileBottomNav } from '@/components/MobileBottomNav';

function AppLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdmin && <Navbar />}
      <main className={`flex-1 ${!isAdmin ? 'pb-16 lg:pb-0' : ''}`}>
        {children}
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && <MobileBottomNav />}
      <ToastContainer />
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400">Loading SmartStation...</div>}>
        <AppLayoutInner>{children}</AppLayoutInner>
      </Suspense>
    </CartProvider>
  );
}
