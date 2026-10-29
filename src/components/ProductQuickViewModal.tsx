'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product, ProductVariant } from '@/lib/types';
import { useCart } from '@/lib/cart-context';
import { X, Star, ShoppingBag, Heart, Check, ShieldCheck, Truck, ArrowRight } from 'lucide-react';

interface QuickViewModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductQuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const images = Array.isArray(product.images) && product.images.length > 0 ? product.images : ['/images/products/stationery-placeholder.svg'];
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants?.[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!isOpen) return null;

  const isSaved = isInWishlist(product.id);
  const activePrice = selectedVariant ? selectedVariant.price : product.price;
  const activeMrp = selectedVariant ? selectedVariant.mrp : product.mrp;
  const activeStock = selectedVariant ? selectedVariant.stock : product.stock;
  const isOutOfStock = activeStock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedVariant, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Images */}
        <div className="md:w-1/2 p-6 bg-slate-50 flex flex-col items-center justify-between">
          <div className="w-full aspect-square rounded-2xl overflow-hidden bg-white border border-slate-100 mb-4 flex items-center justify-center">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/images/products/stationery-placeholder.svg';
              }}
            />
          </div>

          {/* Thumbnail row */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto w-full pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImage === img ? 'border-amber-600 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt="thumbnail"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/images/products/stationery-placeholder.svg';
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Details & Actions */}
        <div className="md:w-1/2 p-6 flex flex-col overflow-y-auto">
          {/* Brand */}
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">
            {product.brand}
          </span>

          {/* Title */}
          <h2 className="text-lg font-bold text-slate-900 leading-snug mb-2">{product.name}</h2>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3 text-xs">
            <div className="flex items-center text-amber-500">
              <Star className="w-4 h-4 fill-current" />
              <span className="font-bold text-slate-800 ml-1">{product.rating}</span>
            </div>
            <span className="text-slate-400">·</span>
            <span className="text-slate-500">{product.reviewCount} customer reviews</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-4 p-3 bg-amber-50/50 rounded-2xl border border-amber-100">
            <span className="text-2xl font-black text-slate-900">₹{activePrice}</span>
            {activeMrp > activePrice && (
              <span className="text-sm text-slate-400 line-through">₹{activeMrp}</span>
            )}
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              {product.discountPercentage}% OFF
            </span>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-600 mb-4 leading-relaxed line-clamp-3">
            {product.description}
          </p>

          {/* Variants */}
          {product.variants && product.variants.length > 1 && (
            <div className="mb-4">
              <span className="text-xs font-bold text-slate-700 block mb-1.5">Select Option:</span>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-3 py-1.5 text-xs rounded-xl font-medium border transition-all ${
                      selectedVariant?.id === v.id
                        ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    {v.name} - ₹{v.price}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock & Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs text-slate-500">
              Status:{' '}
              <strong className={isOutOfStock ? 'text-rose-600' : 'text-emerald-600'}>
                {isOutOfStock ? 'Out of Stock' : `In Stock (${activeStock} left)`}
              </strong>
            </span>

            {!isOutOfStock && (
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 font-bold text-xs"
                >
                  -
                </button>
                <span className="px-3 py-1 text-xs font-bold text-slate-800">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(activeStock, q + 1))}
                  className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 font-bold text-xs"
                >
                  +
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-auto flex gap-3 pt-3 border-t border-slate-100">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                isOutOfStock
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : added
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 hover:bg-amber-600 text-white hover:shadow-lg'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Cart</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </>
              )}
            </button>

            <button
              onClick={() => toggleWishlist(product)}
              className={`p-3 rounded-xl border flex items-center justify-center transition-colors ${
                isSaved
                  ? 'border-rose-200 bg-rose-50 text-rose-600'
                  : 'border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-200'
              }`}
              title="Save to Wishlist"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>

          <Link
            href={`/product/${product.slug}`}
            onClick={onClose}
            className="mt-3 text-center text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center justify-center gap-1"
          >
            <span>View Full Specifications & Customer Reviews</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
