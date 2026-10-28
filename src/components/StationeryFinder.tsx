'use client';

import React, { useState } from 'react';
import { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';
import { Sparkles, RefreshCcw, Check, ArrowRight } from 'lucide-react';

interface StationeryFinderProps {
  products: Product[];
}

export function StationeryFinder({ products }: StationeryFinderProps) {
  const [step, setStep] = useState(1);
  const [who, setWho] = useState('Student');
  const [what, setWhat] = useState('Writing');
  const [budget, setBudget] = useState('100-300');
  const [showResults, setShowResults] = useState(false);

  const resetWizard = () => {
    setStep(1);
    setShowResults(false);
  };

  // Recommendations calculation
  const recommendedProducts = products
    .filter((p) => {
      // Budget matching
      if (budget === 'under-100' && p.price > 100) return false;
      if (budget === '100-300' && (p.price < 90 || p.price > 320)) return false;
      if (budget === '300-500' && (p.price < 280 || p.price > 550)) return false;
      if (budget === 'above-500' && p.price < 490) return false;

      // Category / What matching
      if (what === 'Writing' && p.category !== 'Writing Instruments') return false;
      if (what === 'Study' && !['Notebooks & Paper', 'School Essentials'].includes(p.category)) return false;
      if (what === 'Art' && p.category !== 'Art Supplies') return false;
      if (what === 'Planning' && p.category !== 'Planners & Journals') return false;
      if (what === 'Office' && !['Office Supplies', 'Desk Organizers'].includes(p.category)) return false;

      return true;
    })
    .slice(0, 4);

  // Fallback if strict filter yields few items
  const finalResults =
    recommendedProducts.length > 0
      ? recommendedProducts
      : products.slice(0, 4);

  return (
    <section id="stationery-finder" className="py-16 bg-slate-50/70 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Smart Recommendation Engine</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D3557]">
              Stationery Finder Questionnaire
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Answer 3 quick questions and let our stationery engine find the exact tools for you.
            </p>
          </div>

          {!showResults ? (
            <div>
              {/* Question 1: Who is it for? */}
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                  1. Who is it for?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {['Student', 'Professional', 'Artist', 'Child', 'Gift'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setWho(opt)}
                      className={`p-3 rounded-xl text-xs font-bold border transition-all text-center ${
                        who === opt
                          ? 'border-amber-600 bg-amber-500 text-slate-950 shadow-sm'
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2: What do you need? */}
              <div className="mb-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                  2. What do you need most?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'Writing', label: 'Writing Tools' },
                    { id: 'Study', label: 'Notebooks & Study' },
                    { id: 'Art', label: 'Drawing & Art' },
                    { id: 'Planning', label: 'Planners' },
                    { id: 'Office', label: 'Desk Organizers' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setWhat(opt.id)}
                      className={`p-3 rounded-xl text-xs font-bold border transition-all text-center ${
                        what === opt.id
                          ? 'border-amber-600 bg-amber-500 text-slate-950 shadow-sm'
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 3: Budget */}
              <div className="mb-8">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                  3. Approximate Budget?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'under-100', label: 'Under ₹100' },
                    { id: '100-300', label: '₹100 – ₹300' },
                    { id: '300-500', label: '₹300 – ₹500' },
                    { id: 'above-500', label: '₹500+' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setBudget(opt.id)}
                      className={`p-3 rounded-xl text-xs font-bold border transition-all text-center ${
                        budget === opt.id
                          ? 'border-amber-600 bg-amber-500 text-slate-950 shadow-sm'
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Wizard Button */}
              <button
                onClick={() => setShowResults(true)}
                className="w-full py-3.5 px-4 bg-slate-900 hover:bg-amber-600 text-white font-bold rounded-2xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                <span>Find My Perfect Stationery</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                    <span>✨ Your SmartStation Picks</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Showing curated stationery for {who} · {what} · {budget}
                  </p>
                </div>

                <button
                  onClick={resetWizard}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCcw className="w-3.5 h-3.5" />
                  <span>Retake Quiz</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {finalResults.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
