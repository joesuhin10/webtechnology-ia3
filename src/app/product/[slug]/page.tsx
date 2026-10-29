'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Product, ProductVariant, Review } from '@/lib/types';
import { useCart } from '@/lib/cart-context';
import { ProductCard } from '@/components/ProductCard';
import {
  Star,
  Heart,
  ShoppingBag,
  Zap,
  Truck,
  Check,
  ShieldCheck,
  Share2,
  SlidersHorizontal,
  MapPin,
  Clock,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowRight,
  MessageSquare,
  ThumbsUp,
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();

  const { addToCart, toggleWishlist, isInWishlist, addToCompare, addToast, user } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(true);

  // Delivery Pincode Checker State
  const [pincode, setPincode] = useState('');
  const [deliveryResult, setDeliveryResult] = useState<{
    checked: boolean;
    available: boolean;
    date?: string;
    cod: boolean;
    fee: string;
  } | null>(null);

  // Write Review State
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (!res.ok) throw new Error('Not found');
        const prodData: Product = await res.json();
        setProduct(prodData);
        setSelectedImage(prodData.images?.[0] || '/images/products/stationery-placeholder.svg');
        setSelectedVariant(prodData.variants?.[0]);

        // Fetch related products from same category
        const relRes = await fetch(`/api/products?category=${encodeURIComponent(prodData.categoryId)}&limit=4`);
        const relData = await relRes.json();
        setRelatedProducts((relData.products || []).filter((p: Product) => p.id !== prodData.id));

        // Fetch reviews
        const revRes = await fetch(`/api/reviews?productId=${prodData.id}`);
        const revData = await revRes.json();
        setReviews(revData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square bg-slate-200 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-6 bg-slate-200 rounded w-1/4" />
            <div className="h-10 bg-slate-200 rounded w-3/4" />
            <div className="h-8 bg-slate-200 rounded w-1/3" />
            <div className="h-24 bg-slate-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-3xl mx-auto mb-4">
          📝
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Oops! This page wandered off the desk.</h2>
        <p className="text-sm text-slate-500 mb-6">The product you are looking for is no longer available or was moved.</p>
        <Link href="/shop" className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl text-xs uppercase tracking-wider">
          Return to Stationery Shop
        </Link>
      </div>
    );
  }

  const isSaved = isInWishlist(product.id);
  const activePrice = selectedVariant ? selectedVariant.price : product.price;
  const activeMrp = selectedVariant ? selectedVariant.mrp : product.mrp;
  const activeStock = selectedVariant ? selectedVariant.stock : product.stock;
  const activeSku = selectedVariant ? selectedVariant.sku : product.sku;
  const isOutOfStock = activeStock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedVariant, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedVariant, quantity);
    router.push('/checkout');
  };

  const checkPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6) {
      // Realistic simulation: metro pincodes fast, tier 2 standard
      const isMetro = ['560', '110', '400', '600', '700', '500'].some((prefix) =>
        pincode.startsWith(prefix)
      );
      setDeliveryResult({
        checked: true,
        available: true,
        date: isMetro ? 'Tomorrow, by 8 PM' : 'In 2-3 business days',
        cod: true,
        fee: activePrice >= 499 ? 'FREE Delivery' : '₹40 (Free above ₹499)',
      });
    } else {
      setDeliveryResult({
        checked: true,
        available: false,
        cod: false,
        fee: '',
      });
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          userId: user?.id || 'guest-user',
          userName: user?.name || 'Verified Customer',
          rating: newRating,
          title: newTitle || 'Great stationery product',
          comment: newComment,
          verifiedPurchase: true,
        }),
      });

      if (res.ok) {
        const savedReview = await res.json();
        setReviews((prev) => [savedReview, ...prev]);
        setNewComment('');
        setNewTitle('');
        addToast('Review Submitted! 🌟', 'Thank you for your valuable product feedback.', 'success');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="text-xs text-slate-500 mb-6 flex items-center gap-1.5 font-medium flex-wrap">
          <Link href="/" className="hover:text-amber-600">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-amber-600">
            Shop
          </Link>
          <span>/</span>
          <Link href={`/shop?category=${product.categoryId}`} className="hover:text-amber-600">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-bold truncate max-w-[200px] sm:max-w-xs">
            {product.name}
          </span>
        </nav>

        {/* Main Product Card: Left Gallery & Right Info */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Image Gallery (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center group">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.src = '/images/products/stationery-placeholder.svg';
                  }}
                />
                {product.discountPercentage > 0 && (
                  <span className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-black px-2.5 py-1 rounded-md uppercase tracking-wider shadow-md">
                    {product.discountPercentage}% OFF
                  </span>
                )}
              </div>

              {/* Multi-angle Thumbnails */}
              {(product.images?.length ?? 0) > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {product.images?.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(img)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                        selectedImage === img
                          ? 'border-amber-600 shadow-md ring-2 ring-amber-500/20'
                          : 'border-slate-100 opacity-70 hover:opacity-100'
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

            {/* Right Product Buy Section (7 cols) */}
            <div className="lg:col-span-7 flex flex-col">
              {/* Brand, Purpose & Actions */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md">
                  {product.brand}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => addToCompare(product)}
                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                    title="Add to Compare"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`p-2 rounded-xl transition-colors ${
                      isSaved ? 'text-rose-600 bg-rose-50' : 'text-slate-500 hover:text-rose-600 hover:bg-slate-50'
                    }`}
                    title="Save to Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Title & SKU */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight mb-2">
                {product.name}
              </h1>
              <p className="text-xs text-slate-400 font-mono mb-3">
                SKU: {activeSku} · Barcode: {product.barcode}
              </p>

              {/* Rating & Review summary */}
              <div className="flex items-center gap-3 mb-4 text-xs">
                <div className="flex items-center gap-1 bg-amber-50 text-amber-900 px-2.5 py-1 rounded-lg border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                  <span className="font-bold">{product.rating}</span>
                </div>
                <span className="text-slate-500 font-medium">
                  {product.reviewCount} Verified Ratings & Reviews
                </span>
              </div>

              {/* Price & Savings Box */}
              <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 mb-6 flex items-baseline justify-between">
                <div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-3xl font-black text-slate-950">₹{activePrice}</span>
                    {activeMrp > activePrice && (
                      <span className="text-base text-slate-400 line-through">₹{activeMrp}</span>
                    )}
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                      Save ₹{activeMrp - activePrice}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Inclusive of all taxes ({product.taxPercentage}% GST)
                  </span>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                      isOutOfStock
                        ? 'bg-rose-100 text-rose-800'
                        : activeStock <= 10
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {isOutOfStock ? 'Out of Stock' : `In Stock (${activeStock} units)`}
                  </span>
                </div>
              </div>

              {/* Product Variants (e.g. Blue/Black or Pack sizes) */}
              {product.variants && product.variants.length > 1 && (
                <div className="mb-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                    Available Options:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`px-3.5 py-2 text-xs rounded-xl font-bold border transition-all ${
                          selectedVariant?.id === v.id
                            ? 'border-amber-600 bg-amber-500 text-slate-950 shadow-sm'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {v.name} — ₹{v.price}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Stepper & Add to Cart / Buy Now */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
                {!isOutOfStock && (
                  <div className="flex items-center justify-between border border-slate-200 rounded-2xl p-1 bg-slate-50 shrink-0">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-9 h-9 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold flex items-center justify-center text-sm shadow-xs"
                    >
                      -
                    </button>
                    <span className="w-12 text-center text-sm font-black text-slate-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(activeStock, q + 1))}
                      className="w-9 h-9 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold flex items-center justify-center text-sm shadow-xs"
                    >
                      +
                    </button>
                  </div>
                )}

                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md ${
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
                      <span>Added to Stationery Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="py-3.5 px-6 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-2xl text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Buy Now</span>
                </button>
              </div>

              {/* 18. Pincode Delivery Availability Checker */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 mb-6">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-2">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  <span>Check Delivery Availability & Pincode</span>
                </div>

                <form onSubmit={checkPincode} className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit Pincode (e.g. 560102)"
                    className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-colors shrink-0"
                  >
                    Check
                  </button>
                </form>

                {deliveryResult && (
                  <div className="mt-3 text-xs pt-2 border-t border-slate-200/60">
                    {deliveryResult.available ? (
                      <div className="space-y-1 text-slate-700">
                        <p className="font-semibold text-emerald-700 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Delivery Available to {pincode}</span>
                        </p>
                        <p className="text-slate-600">
                          Estimated Date: <b>{deliveryResult.date}</b>
                        </p>
                        <p className="text-slate-600">
                          Shipping Fee: <b>{deliveryResult.fee}</b> · Cash on Delivery: <b>Available</b>
                        </p>
                      </div>
                    ) : (
                      <p className="text-rose-600 font-semibold">
                        Please enter a valid 6-digit Indian pincode.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-slate-500 pt-4 border-t border-slate-100">
                <div className="flex flex-col items-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 mb-1" />
                  <span>100% Genuine</span>
                </div>
                <div className="flex flex-col items-center">
                  <Truck className="w-4 h-4 text-blue-600 mb-1" />
                  <span>Dispatched in 24h</span>
                </div>
                <div className="flex flex-col items-center">
                  <RotateCcw className="w-4 h-4 text-amber-600 mb-1" />
                  <span>7-Day Return</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 17. Structured Specifications Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs mb-12">
          <h2 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-2">
            <span>Product Specifications</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-xs">
            {product.specifications.paperSize && (
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Paper Size</span>
                <span className="font-bold text-slate-900">{product.specifications.paperSize}</span>
              </div>
            )}
            {product.specifications.pages && (
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Page Count</span>
                <span className="font-bold text-slate-900">{product.specifications.pages} Pages</span>
              </div>
            )}
            {product.specifications.paperGsm && (
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Paper Density (GSM)</span>
                <span className="font-bold text-slate-900">{product.specifications.paperGsm} GSM</span>
              </div>
            )}
            {product.specifications.ruling && (
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Ruling</span>
                <span className="font-bold text-slate-900">{product.specifications.ruling}</span>
              </div>
            )}
            {product.specifications.binding && (
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Binding Type</span>
                <span className="font-bold text-slate-900">{product.specifications.binding}</span>
              </div>
            )}
            {product.specifications.writingType && (
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Ink / Writing Type</span>
                <span className="font-bold text-slate-900">{product.specifications.writingType}</span>
              </div>
            )}
            {product.specifications.tipSize && (
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Tip Size</span>
                <span className="font-bold text-slate-900">{product.specifications.tipSize}</span>
              </div>
            )}
            {product.specifications.inkColor && (
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Ink Colour</span>
                <span className="font-bold text-slate-900">{product.specifications.inkColor}</span>
              </div>
            )}
            {product.specifications.material && (
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Material</span>
                <span className="font-bold text-slate-900">{product.specifications.material}</span>
              </div>
            )}
            {product.specifications.countryOfOrigin && (
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Country of Origin</span>
                <span className="font-bold text-slate-900">{product.specifications.countryOfOrigin}</span>
              </div>
            )}
          </div>
        </div>

        {/* 19. Ratings & Customer Reviews Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Customer Reviews & Ratings
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Verified feedback from real students and customers
              </p>
            </div>

            {/* Overall Rating Score */}
            <div className="flex items-center gap-4 bg-amber-50/60 p-4 rounded-2xl border border-amber-100">
              <div className="text-center">
                <span className="text-3xl font-black text-slate-900">{product.rating}</span>
                <span className="text-xs text-slate-400 block">out of 5</span>
              </div>
              <div className="h-10 w-px bg-amber-200" />
              <div>
                <div className="flex text-amber-500 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.round(product.rating) ? 'fill-current' : 'text-slate-200'}`}
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-600 font-semibold">
                  {reviews.length} total reviews
                </span>
              </div>
            </div>
          </div>

          {/* Review List */}
          <div className="space-y-6 mb-10">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-2xl bg-slate-50/60 border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{rev.userName}</span>
                    {rev.verifiedPurchase && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {rev.createdAt.split('T')[0]}
                  </span>
                </div>

                <div className="flex text-amber-500 mb-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-slate-200'}`}
                    />
                  ))}
                </div>

                <h4 className="text-xs font-bold text-slate-900 mb-1">{rev.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>

          {/* Write a Review Form */}
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-amber-600" />
              <span>Write a Customer Review</span>
            </h3>

            <form onSubmit={handleReviewSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-600 mb-1">Your Rating:</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setNewRating(num)}
                      className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition-all ${
                        newRating === num
                          ? 'border-amber-600 bg-amber-500 text-slate-950'
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{num} Star{num > 1 ? 's' : ''}</span>
                    </button>
                  ))}
                </div>
              </div>

              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Review Headline (e.g. Great smooth flow, sturdy binding)"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-amber-500"
              />

              <textarea
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
                placeholder="Write your detailed review about paper quality, ink smoothness, durability..."
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-amber-500"
              />

              <button
                type="submit"
                disabled={isSubmittingReview}
                className="px-5 py-2.5 bg-slate-900 hover:bg-amber-600 text-white font-bold rounded-xl text-xs transition-colors"
              >
                {isSubmittingReview ? 'Submitting...' : 'Post Review'}
              </button>
            </form>
          </div>
        </div>

        {/* 20. Related Products / You May Also Like */}
        {relatedProducts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-extrabold text-[#1D3557] mb-6">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
