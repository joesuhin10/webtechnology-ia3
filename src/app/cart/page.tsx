'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import {
  ShoppingBag,
  Trash2,
  Heart,
  ArrowRight,
  Sparkles,
  Truck,
  Tag,
  ShieldCheck,
  CheckCircle2,
  X,
} from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    cartCount,
    cartSubtotal,
    totalSavings,
    freeShippingThreshold,
    shippingFee,
    amountNeededForFreeShipping,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    pointsToRedeem,
    setPointsToRedeem,
    pointsDiscount,
    finalTotal,
    toggleWishlist,
    user,
    addToast,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [pointsInput, setPointsInput] = useState(0);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    await applyCoupon(couponInput.trim());
    setCouponLoading(false);
  };

  const handlePointsApply = () => {
    const maxUsable = user ? Math.min(user.rewardPoints, cartSubtotal) : 0;
    const clamped = Math.min(Math.max(0, pointsInput), maxUsable);
    setPointsToRedeem(clamped);
    if (clamped > 0) {
      addToast('SmartPoints Applied!', `Redeemed ${clamped} points to save ₹${clamped}.`, 'success');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="bg-[#FAF8F5] min-h-[70vh] flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200/80 shadow-xs">
          <div className="w-20 h-20 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center text-3xl mx-auto mb-4">
            🛒
          </div>
          <h2 className="text-2xl font-black text-[#1D3557] mb-2">
            Your desk is looking a little empty.
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mb-8 leading-relaxed">
            Fill your bag with notebooks, highlighters, geometric instruments and study essentials.
          </p>
          <Link
            href="/shop"
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-slate-900 hover:bg-amber-600 text-white font-bold rounded-2xl text-xs uppercase tracking-wider transition-colors shadow-md"
          >
            <span>Start Shopping Stationery</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // Free shipping progress percentage
  const freeShippingPercent = Math.min(
    100,
    Math.round((cartSubtotal / freeShippingThreshold) * 100)
  );

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-[#1D3557] mb-2 tracking-tight">
          Your Stationery Bag
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mb-8">
          You have <strong className="text-slate-800">{cartCount} items</strong> ready to write and organize.
        </p>

        {/* 23. SMART CART: Free Delivery Progress Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200/60 shadow-xs mb-8">
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="flex items-center gap-1.5 text-slate-800">
              <Truck className="w-4 h-4 text-amber-600" />
              {amountNeededForFreeShipping === 0 ? (
                <span className="text-emerald-700 font-extrabold">
                  🎉 Congratulations! You unlocked FREE Standard Delivery!
                </span>
              ) : (
                <span>
                  Add <b className="text-amber-700">₹{amountNeededForFreeShipping}</b> more to unlock{' '}
                  <span className="text-emerald-700">FREE DELIVERY</span>
                </span>
              )}
            </span>
            <span className="text-slate-400 font-mono">{freeShippingPercent}%</span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${freeShippingPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Cart Items (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  {/* Thumbnail & Title */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-2xl border border-slate-100 shrink-0"
                      onError={(e) => {
                        e.currentTarget.src = '/images/products/stationery-placeholder.svg';
                      }}
                    />

                    <div className="min-w-0">
                      <span className="text-[10px] uppercase font-bold text-amber-700">
                        {item.brand}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900 truncate">{item.name}</h3>
                      {item.variantName && (
                        <p className="text-xs text-slate-500 mt-0.5 font-medium">
                          Option: {item.variantName}
                        </p>
                      )}
                      <div className="flex items-baseline gap-1.5 mt-1">
                        <span className="text-base font-black text-slate-950">₹{item.price}</span>
                        {item.mrp > item.price && (
                          <span className="text-xs text-slate-400 line-through">₹{item.mrp}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quantity Stepper & Subtotal */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-slate-200 rounded-xl p-0.5 bg-slate-50">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-lg bg-white hover:bg-slate-100 font-bold text-xs flex items-center justify-center text-slate-700 shadow-2xs"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-black text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg bg-white hover:bg-slate-100 font-bold text-xs flex items-center justify-center text-slate-700 shadow-2xs"
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right min-w-[70px]">
                      <span className="text-base font-black text-slate-950 block">
                        ₹{item.price * item.quantity}
                      </span>
                      {item.mrp > item.price && (
                        <span className="text-[10px] text-emerald-600 font-semibold block">
                          Saved ₹{(item.mrp - item.price) * item.quantity}
                        </span>
                      )}
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping button */}
            <div className="flex justify-between items-center pt-2">
              <Link
                href="/shop"
                className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1.5"
              >
                <span>← Continue Shopping Stationery</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Order Summary & Coupon (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Coupon Code Input Box */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
                <Tag className="w-3.5 h-3.5 text-amber-600" />
                <span>Apply Promo Coupon</span>
              </div>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-2xl">
                  <div>
                    <span className="font-mono font-bold text-xs text-emerald-900 block">
                      {appliedCoupon.coupon.code}
                    </span>
                    <span className="text-[11px] text-emerald-700">
                      Savings: ₹{appliedCoupon.discount}
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="p-1 text-slate-400 hover:text-rose-600"
                    title="Remove coupon"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="e.g. STUDENT15 or WELCOME10"
                    className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl uppercase font-mono focus:outline-hidden focus:border-amber-500 font-bold"
                  />
                  <button
                    type="submit"
                    disabled={couponLoading}
                    className="px-4 py-2 bg-slate-900 hover:bg-amber-600 text-white font-bold rounded-xl text-xs transition-colors shrink-0"
                  >
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </form>
              )}

              {/* Quick Coupon suggestions */}
              {!appliedCoupon && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {['STUDENT15', 'SAVE50', 'WELCOME10'].map((code) => (
                    <button
                      key={code}
                      onClick={() => setCouponInput(code)}
                      className="px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-50 text-amber-900 rounded border border-amber-200 hover:bg-amber-100 transition-colors"
                    >
                      {code}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* SmartPoints Redemption */}
            {user && user.rewardPoints > 0 && (
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Redeem SmartPoints</span>
                  </span>
                  <span className="text-amber-700">{user.rewardPoints} Pts Avail</span>
                </div>
                <p className="text-[11px] text-slate-500 mb-3">
                  1 SmartPoint = ₹1 discount on your stationery.
                </p>

                <div className="flex gap-2">
                  <input
                    type="number"
                    max={Math.min(user.rewardPoints, cartSubtotal)}
                    value={pointsInput || ''}
                    onChange={(e) => setPointsInput(Number(e.target.value))}
                    placeholder={`Max ${Math.min(user.rewardPoints, cartSubtotal)}`}
                    className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                  <button
                    onClick={handlePointsApply}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs"
                  >
                    Redeem
                  </button>
                </div>
              </div>
            )}

            {/* Order Price Breakdown Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-100">
                Order Summary
              </h3>

              <div className="flex justify-between text-xs text-slate-600">
                <span>Subtotal ({cartCount} items):</span>
                <span className="font-bold text-slate-900">₹{cartSubtotal}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-xs text-emerald-600 font-semibold">
                  <span>Coupon ({appliedCoupon.coupon.code}):</span>
                  <span>- ₹{appliedCoupon.discount}</span>
                </div>
              )}

              {pointsDiscount > 0 && (
                <div className="flex justify-between text-xs text-emerald-600 font-semibold">
                  <span>SmartPoints Discount:</span>
                  <span>- ₹{pointsDiscount}</span>
                </div>
              )}

              <div className="flex justify-between text-xs text-slate-600">
                <span>Shipping Fee:</span>
                <span className={shippingFee === 0 ? 'text-emerald-600 font-bold' : 'font-bold'}>
                  {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                </span>
              </div>

              <div className="flex justify-between text-xs text-slate-500">
                <span>Estimated Taxes:</span>
                <span className="font-medium text-slate-700">Included in prices</span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900">Total Payable:</span>
                <span className="text-2xl font-black text-slate-950">₹{finalTotal}</span>
              </div>

              {totalSavings > 0 && (
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-[11px] font-bold text-center border border-emerald-200">
                  🎉 You are saving ₹{totalSavings + (appliedCoupon?.discount || 0) + pointsDiscount} on this purchase!
                </div>
              )}

              <button
                onClick={() => router.push('/checkout')}
                className="w-full py-4 px-6 bg-slate-900 hover:bg-amber-600 text-white font-black rounded-2xl text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mt-4"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Encrypted 256-Bit SSL Checkout Protection</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
