'use client';

import React, { useState, useMemo } from 'react';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/cart-context';
import { Sparkles, Check, Plus, Package, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

interface BuildKitProps {
  products: Product[];
}

const PURPOSES = [
  { id: 'College', label: 'College & University', icon: '🎓', desc: 'Lecture notes, high-speed pens & study planners' },
  { id: 'School', label: 'School Essentials', icon: '🎒', desc: 'Geometry box, sharpeners, erasers & notebooks' },
  { id: 'Exam', label: 'Exam Ready Hall Kit', icon: '📝', desc: 'Transparent pouch, black/blue pens & drafting tools' },
  { id: 'Office', label: 'Professional Office', icon: '💼', desc: 'Staplers, sticky notes, premium rollerballs & organizers' },
  { id: 'Art', label: 'Creative Art & Sketch', icon: '🎨', desc: 'Watercolours, graphite pencils, fineliners & sketchbooks' },
  { id: 'Journaling', label: 'Aesthetic Journaling', icon: '📔', desc: 'Ivory journals, pastel highlighters & brush pens' },
];

export function BuildStationeryKit({ products }: BuildKitProps) {
  const { addToCart, addToast } = useCart();
  const [selectedPurpose, setSelectedPurpose] = useState('College');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([
    'prod-001', // Classmate Pulse Notebook
    'prod-004', // Pentel EnerGel Pens
    'prod-006', // Flair Pastel Highlighters
  ]);

  // Filter products relevant to the chosen purpose
  const relevantProducts = useMemo(() => {
    return products.filter((p) => p.purposeTags?.includes(selectedPurpose));
  }, [products, selectedPurpose]);

  const toggleProduct = (productId: string) => {
    setSelectedProductIds((prev) => {
      if (prev.includes(productId)) {
        if (prev.length <= 1) {
          addToast('Minimum 1 Item', 'A stationery kit requires at least 1 item.', 'warning');
          return prev;
        }
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  // Calculate pricing
  const kitItems = useMemo(() => {
    return products.filter((p) => selectedProductIds.includes(p.id));
  }, [products, selectedProductIds]);

  const individualTotal = kitItems.reduce((sum, item) => sum + item.price, 0);
  const bundleDiscountPercent = kitItems.length >= 4 ? 20 : kitItems.length >= 3 ? 15 : 10;
  const bundleDiscountAmount = Math.round((individualTotal * bundleDiscountPercent) / 100);
  const finalKitPrice = individualTotal - bundleDiscountAmount;

  const handleAddKitToCart = () => {
    if (kitItems.length === 0) return;
    kitItems.forEach((item) => {
      addToCart(item, undefined, 1);
    });
    addToast(
      'Custom Stationery Kit Added! 🎉',
      `Added ${kitItems.length} items with ${bundleDiscountPercent}% kit savings to your cart!`,
      'success'
    );
  };

  return (
    <section id="kit-builder" className="py-16 bg-gradient-to-b from-[#FAF8F5] to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Interactive Custom Builder</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1D3557] tracking-tight">
            Build Your Own Stationery Kit
          </h2>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Customize your dream setup. Handpick what you need for your exams, semester, or study desk and unlock up to <b>20% instant bundle savings</b>.
          </p>
        </div>

        {/* Step 1: Choose Purpose Buttons */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
              1
            </span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Select Your Requirement
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {PURPOSES.map((purpose) => {
              const isSelected = selectedPurpose === purpose.id;
              return (
                <button
                  key={purpose.id}
                  onClick={() => setSelectedPurpose(purpose.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'border-amber-600 bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20 scale-[1.02]'
                      : 'border-slate-200 bg-white hover:border-amber-300 text-slate-700'
                  }`}
                >
                  <span className="text-2xl block mb-1">{purpose.icon}</span>
                  <p className="text-xs font-bold leading-tight">{purpose.label}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2 & 3: Product Selector (Left) + Dynamic Bundle Calculator (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Product Grid Checklist */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                  Pick Items for your {selectedPurpose} Kit
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {selectedProductIds.length} items chosen
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
              {relevantProducts.map((p) => {
                const isChecked = selectedProductIds.includes(p.id);
                return (
                  <div
                    key={p.id}
                    onClick={() => toggleProduct(p.id)}
                    className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                      isChecked
                        ? 'border-amber-600 bg-amber-50/40 shadow-xs'
                        : 'border-slate-100 hover:border-slate-200 bg-white opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                        isChecked
                          ? 'border-amber-600 bg-amber-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>

                    <img
                      src={p.images?.[0] || '/images/products/stationery-placeholder.svg'}
                      alt={p.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-100 shrink-0"
                      onError={(e) => {
                        e.currentTarget.src = '/images/products/stationery-placeholder.svg';
                      }}
                    />

                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase font-bold text-amber-700">{p.brand}</p>
                      <p className="text-xs font-semibold text-slate-900 truncate">{p.name}</p>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-xs font-bold text-slate-900">₹{p.price}</span>
                        {p.mrp > p.price && (
                          <span className="text-[10px] text-slate-400 line-through">₹{p.mrp}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bundle Summary Card */}
          <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col sticky top-24">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 text-xs font-bold flex items-center justify-center">
                3
              </span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                Your Custom Kit Summary
              </h3>
            </div>

            {/* Selected Items Checklist */}
            <div className="space-y-2 mb-6 max-h-48 overflow-y-auto pr-1">
              {kitItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-800">
                  <span className="truncate max-w-[180px] text-slate-300 font-medium">
                    {item.name}
                  </span>
                  <span className="text-white font-bold shrink-0">₹{item.price}</span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2 text-xs border-t border-slate-800 pt-4 mb-6">
              <div className="flex justify-between text-slate-400">
                <span>Individual Total:</span>
                <span className="line-through">₹{individualTotal}</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-medium">
                <span>Bundle Discount ({bundleDiscountPercent}%):</span>
                <span>- ₹{bundleDiscountAmount}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Shipping:</span>
                <span className={finalKitPrice >= 499 ? 'text-emerald-400 font-semibold' : ''}>
                  {finalKitPrice >= 499 ? 'FREE' : '₹40'}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-white pt-2 border-t border-slate-800">
                <span>Final Kit Price:</span>
                <span className="text-amber-400 text-xl font-black">₹{finalKitPrice}</span>
              </div>
            </div>

            {/* Add to Cart button */}
            <button
              onClick={handleAddKitToCart}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 active:scale-98"
            >
              <Package className="w-4 h-4" />
              <span>Add Custom Kit to Cart</span>
            </button>

            <p className="text-[11px] text-slate-400 text-center mt-3 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% genuine products bundled in one box</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
