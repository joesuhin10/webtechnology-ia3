'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { SlidersHorizontal, Trash2, ShoppingBag, Star, Check, X, ArrowRight } from 'lucide-react';

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare, addToCart } = useCart();

  if (compareList.length === 0) {
    return (
      <div className="bg-[#FAF8F5] min-h-[70vh] flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200/80 shadow-xs">
          <div className="w-20 h-20 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center text-3xl mx-auto mb-4">
            ⚖️
          </div>
          <h2 className="text-2xl font-black text-[#1D3557] mb-2">
            No stationery to compare yet.
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mb-8 leading-relaxed">
            Click the comparison icon on any notebook, pen, or art product to compare specifications side-by-side.
          </p>
          <Link
            href="/shop"
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-slate-900 hover:bg-amber-600 text-white font-bold rounded-2xl text-xs uppercase tracking-wider transition-colors shadow-md"
          >
            <span>Browse Products to Compare</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-[#1D3557] tracking-tight">
              Product Comparison Matrix
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Comparing <b>{compareList.length} products</b> side by side.
            </p>
          </div>

          <button
            onClick={clearCompare}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Comparison</span>
          </button>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/60">
                <th className="p-4 w-44 font-bold text-slate-400 uppercase tracking-wider text-[11px]">
                  Product
                </th>
                {compareList.map((product) => (
                  <th key={product.id} className="p-4 w-60 align-top">
                    <div className="relative">
                      <button
                        onClick={() => removeFromCompare(product.id)}
                        className="absolute -top-1 -right-1 text-slate-400 hover:text-rose-600"
                        title="Remove from comparison"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <img
                        src={product.images?.[0] || '/images/products/stationery-placeholder.svg'}
                        alt={product.name}
                        className="w-24 h-24 object-cover rounded-xl border border-slate-100 mb-2"
                      />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
                        {product.brand}
                      </span>
                      <h4 className="font-bold text-xs text-slate-900 line-clamp-2">
                        {product.name}
                      </h4>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-4 font-bold text-slate-500">Price</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4">
                    <span className="text-base font-black text-slate-950">₹{p.price}</span>
                    {p.mrp > p.price && (
                      <span className="text-xs text-slate-400 line-through ml-2">₹{p.mrp}</span>
                    )}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-slate-500">Customer Rating</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4">
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="text-slate-800">{p.rating}</span>
                      <span className="text-slate-400 font-normal">({p.reviewCount})</span>
                    </div>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-slate-500">Category</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4 font-medium text-slate-800">
                    {p.category}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-slate-500">Stock Availability</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4">
                    <span
                      className={`font-bold ${p.stock > 0 ? 'text-emerald-700' : 'text-rose-700'}`}
                    >
                      {p.stock > 0 ? `In Stock (${p.stock} units)` : 'Out of Stock'}
                    </span>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-slate-500">Paper GSM</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4 text-slate-700">
                    {p.specifications?.paperGsm ? `${p.specifications.paperGsm} GSM` : 'N/A'}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-slate-500">Writing / Tip Type</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4 text-slate-700">
                    {p.specifications?.writingType
                      ? `${p.specifications.writingType} (${p.specifications.tipSize || 'Standard'})`
                      : 'N/A'}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-slate-500">Eco-Friendly</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4">
                    {p.isEcoFriendly ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <Check className="w-4 h-4" /> Yes
                      </span>
                    ) : (
                      <span className="text-slate-400">Standard</span>
                    )}
                  </td>
                ))}
              </tr>

              <tr className="bg-slate-50/50">
                <td className="p-4 font-bold text-slate-500">Action</td>
                {compareList.map((p) => (
                  <td key={p.id} className="p-4">
                    <button
                      onClick={() => addToCart(p)}
                      disabled={p.stock <= 0}
                      className="px-4 py-2 bg-slate-900 hover:bg-amber-600 disabled:bg-slate-200 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
                    >
                      {p.stock <= 0 ? 'Out of Stock' : 'Add to Bag'}
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
