'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { Heart, Trash2, ShoppingBag, ArrowRight, Sparkles, Flame } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="bg-[#FAF8F5] min-h-[70vh] flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200/80 shadow-xs">
          <div className="w-20 h-20 rounded-3xl bg-rose-50 text-rose-500 flex items-center justify-center text-3xl mx-auto mb-4">
            ❤️
          </div>
          <h2 className="text-2xl font-black text-[#1D3557] mb-2">
            Nothing saved yet.
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mb-8 leading-relaxed">
            Keep track of stationery you love by clicking the heart icon on any notebook, pen, or art supply.
          </p>
          <Link
            href="/shop"
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-slate-900 hover:bg-amber-600 text-white font-bold rounded-2xl text-xs uppercase tracking-wider transition-colors shadow-md"
          >
            <span>Explore Stationery Shop</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-[#1D3557] tracking-tight">
              My Saved Wishlist
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              You have <strong className="text-slate-800">{wishlist.length} stationery items</strong> saved.
            </p>
          </div>

          <Link
            href="/shop"
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
          >
            <span>Continue Browsing</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => {
            const isOutOfStock = product.stock <= 0;
            return (
              <div
                key={product.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-xs hover:shadow-lg transition-all flex flex-col relative"
              >
                {/* Price drop badge simulation */}
                <div className="absolute top-6 left-6 z-10">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500 text-white uppercase tracking-wider flex items-center gap-1 shadow-xs">
                    <Flame className="w-3 h-3 fill-current" />
                    Price Drop!
                  </span>
                </div>

                <button
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-6 right-6 z-10 w-8 h-8 rounded-full bg-white/90 text-rose-500 shadow-md flex items-center justify-center hover:bg-rose-50 transition-colors"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <Link href={`/product/${product.slug}`} className="block aspect-square rounded-2xl overflow-hidden bg-slate-50 mb-4">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = '/images/products/stationery-placeholder.svg';
                    }}
                  />
                </Link>

                <div className="flex-1 flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 mb-1">
                    {product.brand}
                  </span>
                  <Link href={`/product/${product.slug}`}>
                    <h3 className="font-bold text-sm text-slate-900 hover:text-amber-600 line-clamp-2 mb-2">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-base font-black text-slate-950 block">₹{product.price}</span>
                      {product.mrp > product.price && (
                        <span className="text-xs text-slate-400 line-through">₹{product.mrp}</span>
                      )}
                    </div>

                    <button
                      onClick={() => addToCart(product)}
                      disabled={isOutOfStock}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                        isOutOfStock
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-slate-900 hover:bg-amber-600 text-white shadow-xs'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{isOutOfStock ? 'Sold Out' : 'Move to Bag'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
