'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { Home, LayoutGrid, Heart, ShoppingBag, User } from 'lucide-react';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { cartCount, wishlist } = useCart();

  // Hide on admin routes to prevent clutter
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Shop', href: '/shop', icon: LayoutGrid },
    {
      label: 'Wishlist',
      href: '/wishlist',
      icon: Heart,
      badge: wishlist.length > 0 ? wishlist.length : undefined,
    },
    {
      label: 'Cart',
      href: '/cart',
      icon: ShoppingBag,
      badge: cartCount > 0 ? cartCount : undefined,
    },
    { label: 'Account', href: '/account', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 z-40 px-2 py-1 shadow-lg">
      <div className="grid grid-cols-5 items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1.5 transition-colors relative ${
                isActive ? 'text-amber-600 font-semibold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 bg-amber-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
