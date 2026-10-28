'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';
import Link from 'next/link';
import { Flame, Clock, ArrowRight, Zap, Tag } from 'lucide-react';

interface FlashDealsProps {
  products: Product[];
}

export function FlashDealsCountdown({ products }: FlashDealsProps) {
  // Live ticking countdown timer: 04 : 12 : 38
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 12, seconds: 38 });
  const [activeDealFilter, setActiveDealFilter] = useState<'all' | 'under50' | 'under100' | 'combos' | 'student'>('all');

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 4, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const dealProducts = products
    .filter((p) => {
      if (activeDealFilter === 'under50') return p.price <= 50;
      if (activeDealFilter === 'under100') return p.price <= 100;
      if (activeDealFilter === 'combos') return p.category === 'Gift Sets & Combos' || p.name.includes('Pack') || p.name.includes('Combo');
      if (activeDealFilter === 'student') return Boolean(p.purposeTags?.includes('College') || p.purposeTags?.includes('School'));
      return p.discountPercentage >= 15;
    })
    .slice(0, 4);

  return (
    <section className="py-16 bg-gradient-to-r from-amber-500/10 via-rose-500/5 to-amber-500/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner with Countdown */}
        <div className="bg-gradient-to-r from-[#1D3557] to-[#2B3A67] text-white p-6 sm:p-8 rounded-3xl shadow-xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-rose-500 text-white font-black px-2 py-0.5 rounded text-[11px] uppercase tracking-wider flex items-center gap-1 animate-pulse">
                <Flame className="w-3.5 h-3.5 fill-current" />
                FLASH SALE
              </span>
              <span className="text-amber-300 text-xs font-semibold">Special Hourly Discounts</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Exclusive Stationery Deals Up to 30% Off
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Stock up your exam kit, lecture notebooks, and fine writing instruments before prices reset.
            </p>
          </div>

          {/* Countdown Clock Box */}
          <div className="bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-wider mb-2 justify-center">
              <Clock className="w-3.5 h-3.5" />
              <span>Ends In</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-center">
                <span className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-xl font-black text-white font-mono border border-white/10">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-slate-400 mt-1 uppercase">Hours</span>
              </div>
              <span className="text-xl font-bold text-amber-400">:</span>
              <div className="flex flex-col items-center">
                <span className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-xl font-black text-white font-mono border border-white/10">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-slate-400 mt-1 uppercase">Mins</span>
              </div>
              <span className="text-xl font-bold text-amber-400">:</span>
              <div className="flex flex-col items-center">
                <span className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-xl font-black text-white font-mono border border-white/10">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-slate-400 mt-1 uppercase">Secs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Deal Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {[
            { id: 'all', label: '🔥 All Deals' },
            { id: 'under50', label: 'Under ₹50' },
            { id: 'under100', label: 'Under ₹100' },
            { id: 'combos', label: 'Combo & Pack Deals' },
            { id: 'student', label: 'Student Specials' },
          ].map((deal) => {
            const isActive = activeDealFilter === deal.id;
            return (
              <button
                key={deal.id}
                onClick={() => setActiveDealFilter(deal.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {deal.label}
              </button>
            );
          })}
        </div>

        {/* Deals Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dealProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
