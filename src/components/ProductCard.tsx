'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/cart-context';
import { Star, Heart, Eye, ShoppingBag, Check, Sparkles } from 'lucide-react';
import { ProductQuickViewModal } from './ProductQuickViewModal';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const isSaved = isInWishlist(product.id);
  const images = Array.isArray(product.images) && product.images.length > 0 ? product.images : ['/images/products/stationery-placeholder.svg'];
  const hasMultipleImages = images.length > 1;
  const currentImage = isHovered && hasMultipleImages ? images[1] : images[0];
  const isOutOfStock = (product.stock ?? 0) <= 0;
  const isLowStock = (product.stock ?? 0) > 0 && (product.stock ?? 0) <= (product.lowStockThreshold ?? 10);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  return (
    <>
      <div
        className="group relative bg-white rounded-2xl border border-slate-100 hover:border-amber-200/60 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Badges container */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start">
          {product.isNew && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-slate-950 uppercase tracking-wider shadow-xs">
              NEW
            </span>
          )}
          {product.discountPercentage > 0 && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500 text-white uppercase tracking-wider shadow-xs">
              {product.discountPercentage}% OFF
            </span>
          )}
          {isLowStock && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 uppercase tracking-wider">
              Only {product.stock} Left
            </span>
          )}
          {product.isEcoFriendly && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
              Eco-Friendly
            </span>
          )}
        </div>

        {/* Action floating buttons: Wishlist & Quick View */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleWishlistClick}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-md ${
              isSaved
                ? 'bg-rose-500 text-white'
                : 'bg-white/90 backdrop-blur-xs text-slate-600 hover:bg-white hover:text-rose-500'
            }`}
            title={isSaved ? 'Remove from Wishlist' : 'Add to Wishlist'}
            aria-label="Wishlist toggle"
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={handleQuickViewClick}
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-slate-600 hover:bg-white hover:text-amber-600 flex items-center justify-center transition-all duration-200 shadow-md translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100"
            title="Quick View"
            aria-label="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Product Image Clickable Link */}
        <Link href={`/product/${product.slug}`} className="block relative aspect-square overflow-hidden bg-slate-50">
          <img
            src={currentImage}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = '/images/products/stationery-placeholder.svg';
            }}
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
              <span className="px-3 py-1 bg-white text-slate-900 font-bold text-xs uppercase tracking-wider rounded-full shadow-lg">
                Out of Stock
              </span>
            </div>
          )}
        </Link>

        {/* Card Body Details */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Brand & Purpose badge */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="font-semibold text-amber-700 tracking-wider uppercase text-[10px]">
              {product.brand}
            </span>
            {product.purposeTags?.[0] && (
              <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px]">
                {product.purposeTags[0]}
              </span>
            )}
          </div>

          {/* Product Name */}
          <Link href={`/product/${product.slug}`} className="block mb-1.5">
            <h3 className="font-semibold text-sm text-slate-900 line-clamp-2 hover:text-amber-600 transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Short description snippet */}
          <p className="text-xs text-slate-500 line-clamp-1 mb-2.5">
            {product.shortDescription || product.description}
          </p>

          {/* Star Rating & Review count */}
          <div className="flex items-center gap-1.5 mb-3 text-xs">
            <div className="flex items-center gap-0.5 text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-bold text-slate-800 text-xs">{product.rating}</span>
            </div>
            <span className="text-slate-400 text-[11px]">({product.reviewCount})</span>
          </div>

          {/* Price & Add to Cart button */}
          <div className="mt-auto pt-2 border-t border-slate-100/80 flex items-center justify-between gap-2">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-bold text-slate-950">₹{product.price}</span>
                {product.mrp > product.price && (
                  <span className="text-xs text-slate-400 line-through">₹{product.mrp}</span>
                )}
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold block">
                Save ₹{product.mrp - product.price}
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`px-3 py-1.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-1.5 shrink-0 shadow-xs ${
                isOutOfStock
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : addedAnimation
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 hover:bg-amber-600 text-white hover:shadow-md'
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {isQuickViewOpen && (
        <ProductQuickViewModal
          product={product}
          isOpen={isQuickViewOpen}
          onClose={() => setIsQuickViewOpen(false)}
        />
      )}
    </>
  );
}
