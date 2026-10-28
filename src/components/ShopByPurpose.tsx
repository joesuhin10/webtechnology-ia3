'use client';

import React, { useState } from 'react';
import { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';
import Link from 'next/link';
import { ArrowRight, Compass } from 'lucide-react';

interface ShopByPurposeProps {
  products: Product[];
}

const PURPOSES = [
  { id: 'College', label: 'College & University', icon: '🎓', count: 18 },
  { id: 'Exam', label: 'Exam Hall Prep', icon: '📝', count: 12 },
  { id: 'School', label: 'School Classroom', icon: '🎒', count: 15 },
  { id: 'Office', label: 'Office & Work', icon: '💼', count: 14 },
  { id: 'Drawing', label: 'Drawing & Art', icon: '🎨', count: 11 },
  { id: 'Journaling', label: 'Journaling & Diary', icon: '📔', count: 9 },
  { id: 'Study Desk', label: 'Study Desk Setup', icon: '🖥️', count: 10 },
  { id: 'Gift', label: 'Gift Sets & Combos', icon: '🎁', count: 7 },
];

export function ShopByPurpose({ products }: ShopByPurposeProps) {
  const [activePurpose, setActivePurpose] = useState('College');

  const filteredProducts = products
    .filter((p) => p.purposeTags?.includes(activePurpose))
    .slice(0, 4);

  return (
    <section className="py-16 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <Compass className="w-3.5 h-3.5 text-amber-600" />
              <span>Tailored Discovery</span>
            </div>
            <h2 className="text-3xl font-extrabold text-[#1D3557] tracking-tight">
              Shop by Purpose
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              I need stationery for...
            </p>
          </div>

          <Link
            href={`/shop?purpose=${activePurpose}`}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1.5 group shrink-0"
          >
            <span>View all {activePurpose} items</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Purpose pills carousel */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {PURPOSES.map((purpose) => {
            const isActive = activePurpose === purpose.id;
            return (
              <button
                key={purpose.id}
                onClick={() => setActivePurpose(purpose.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#1D3557] text-white shadow-md shadow-[#1D3557]/15 scale-102'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60'
                }`}
              >
                <span>{purpose.icon}</span>
                <span>{purpose.label}</span>
              </button>
            );
          })}
        </div>

        {/* Product Cards for Active Purpose */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
