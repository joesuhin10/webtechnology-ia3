'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { UserAddress } from '@/lib/types';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  QrCode,
  Banknote,
  Check,
  Building,
  ArrowRight,
  MapPin,
  Lock,
  Sparkles,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    cartCount,
    cartSubtotal,
    shippingFee,
    appliedCoupon,
    pointsDiscount,
    pointsToRedeem,
    finalTotal,
    clearCart,
    user,
    addToast,
  } = useCart();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);

  // Step 1: Address selection or form
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    user?.addresses?.[0]?.id || 'new'
  );

  const [addressForm, setAddressForm] = useState<UserAddress>({
    id: 'addr-default',
    fullName: user?.name || 'Joe Student',
    phone: user?.phone || '+91 98111 22334',
    email: user?.email || 'customer@smartstation.com',
    addressLine: user?.addresses?.[0]?.addressLine || 'Flat 402, Lotus Pride Apartments, 12th Main Road, HSR Layout Sector 2',
    city: user?.addresses?.[0]?.city || 'Bengaluru',
    state: user?.addresses?.[0]?.state || 'Karnataka',
    pincode: user?.addresses?.[0]?.pincode || '560102',
    landmark: user?.addresses?.[0]?.landmark || 'Opposite BDA Complex',
    type: 'Home',
    isDefault: true,
  });

  // Step 2: Shipping Option
  const [deliveryOption, setDeliveryOption] = useState<'standard' | 'express'>('standard');
  const expressFee = deliveryOption === 'express' ? 99 : 0;
  const currentTotal = finalTotal + expressFee;

  // Step 3: Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking' | 'COD'>('UPI');
  const [upiId, setUpiId] = useState('student@oksbi');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '•••• •••• •••• 4242',
    expiry: '12/28',
    cvv: '•••',
    nameOnCard: user?.name || 'Joe Student',
  });

  if (cart.length === 0) {
    return (
      <div className="bg-[#FAF8F5] min-h-[70vh] flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center border border-slate-200/80 shadow-xs">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Your Bag is Empty</h2>
          <p className="text-xs text-slate-500 mb-6">Add stationery items before proceeding to checkout.</p>
          <button
            onClick={() => router.push('/shop')}
            className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl text-xs uppercase"
          >
            Go to Shop
          </button>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const activeAddress = addressForm;
      const orderPayload = {
        customerId: user?.id || 'guest-user',
        customerName: activeAddress.fullName,
        customerEmail: activeAddress.email,
        customerPhone: activeAddress.phone,
        shippingAddress: activeAddress,
        items: cart.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          name: item.name,
          brand: item.brand,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          sku: item.sku,
          variantName: item.variantName,
        })),
        subtotal: cartSubtotal,
        discount: (appliedCoupon?.discount || 0) + pointsDiscount,
        couponCode: appliedCoupon?.coupon.code,
        couponDiscount: appliedCoupon?.discount || 0,
        pointsRedeemed: pointsToRedeem,
        pointsDiscount,
        shippingFee: shippingFee + expressFee,
        tax: Math.round(cartSubtotal * 0.12),
        totalAmount: currentTotal,
        paymentMethod,
        paymentStatus: paymentMethod === 'COD' ? 'pending' : 'paid',
        orderStatus: paymentMethod === 'COD' ? 'pending' : 'confirmed',
        estimatedDeliveryDate:
          deliveryOption === 'express' ? 'Tomorrow, by 8 PM' : 'In 2-3 business days',
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        throw new Error('Failed to create order');
      }

      const createdOrder = await res.json();
      clearCart();
      addToast('Order Placed! 🎉', `Order ${createdOrder.orderNumber} confirmed.`, 'success');
      router.push(`/order-success/${createdOrder.id}`);
    } catch (err: any) {
      console.error(err);
      addToast('Order Failed', err.message || 'Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Steps Indicator */}
        <div className="max-w-3xl mx-auto mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1D3557] mb-4 tracking-tight">
            Secure Stationery Checkout
          </h1>

          <div className="flex items-center justify-center gap-2 sm:gap-4 text-xs font-bold">
            <button
              onClick={() => setStep(1)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                step >= 1 ? 'bg-[#1D3557] text-white shadow-xs' : 'bg-slate-200 text-slate-500'
              }`}
            >
              <span>1. Shipping Address</span>
            </button>
            <span className="text-slate-300">──</span>
            <button
              onClick={() => setStep(2)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                step >= 2 ? 'bg-[#1D3557] text-white shadow-xs' : 'bg-slate-200 text-slate-500'
              }`}
            >
              <span>2. Delivery Speed</span>
            </button>
            <span className="text-slate-300">──</span>
            <button
              onClick={() => setStep(3)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                step === 3 ? 'bg-[#1D3557] text-white shadow-xs' : 'bg-slate-200 text-slate-500'
              }`}
            >
              <span>3. Payment</span>
            </button>
          </div>
        </div>

        {/* 2 Column Layout: Steps vs Order Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Side: Step Content (8 cols) */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
            {/* STEP 1: Address */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-amber-600" />
                    <span>Shipping Destination</span>
                  </h2>
                  <span className="text-xs text-slate-400">Step 1 of 3</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={addressForm.fullName}
                      onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                      required
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Phone Number</label>
                    <input
                      type="text"
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                      required
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-amber-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Street Address / Hostel / Flat</label>
                    <input
                      type="text"
                      value={addressForm.addressLine}
                      onChange={(e) => setAddressForm({ ...addressForm, addressLine: e.target.value })}
                      required
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      required
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">State</label>
                    <input
                      type="text"
                      value={addressForm.state}
                      onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                      required
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">6-Digit Pincode</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={addressForm.pincode}
                      onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                      required
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Landmark (Optional)</label>
                    <input
                      type="text"
                      value={addressForm.landmark || ''}
                      onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-3 bg-slate-900 hover:bg-amber-600 text-white font-bold rounded-2xl text-xs uppercase tracking-wider flex items-center gap-2 transition-colors shadow-md"
                  >
                    <span>Proceed to Delivery Options</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Delivery Speed */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-amber-600" />
                    <span>Choose Delivery Speed</span>
                  </h2>
                  <span className="text-xs text-slate-400">Step 2 of 3</span>
                </div>

                <div className="space-y-3">
                  <div
                    onClick={() => setDeliveryOption('standard')}
                    className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                      deliveryOption === 'standard'
                        ? 'border-amber-600 bg-amber-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          deliveryOption === 'standard'
                            ? 'border-amber-600 bg-amber-600 text-white'
                            : 'border-slate-300'
                        }`}
                      >
                        {deliveryOption === 'standard' && <Check className="w-3 h-3" />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Standard Surface Delivery</p>
                        <p className="text-[11px] text-slate-500">Delivered in 2-3 business days via BlueDart</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-900">
                      {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                    </span>
                  </div>

                  <div
                    onClick={() => setDeliveryOption('express')}
                    className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                      deliveryOption === 'express'
                        ? 'border-amber-600 bg-amber-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          deliveryOption === 'express'
                            ? 'border-amber-600 bg-amber-600 text-white'
                            : 'border-slate-300'
                        }`}
                      >
                        {deliveryOption === 'express' && <Check className="w-3 h-3" />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">⚡ Next-Day Priority Exam Express</p>
                        <p className="text-[11px] text-slate-500">Guaranteed delivery tomorrow by 8:00 PM</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-900">₹99</span>
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-center">
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs font-bold text-slate-600 hover:underline"
                  >
                    ← Back to Address
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="px-6 py-3 bg-slate-900 hover:bg-amber-600 text-white font-bold rounded-2xl text-xs uppercase tracking-wider flex items-center gap-2 transition-colors shadow-md"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Payment Method */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-emerald-600" />
                    <span>Select Payment Method</span>
                  </h2>
                  <span className="text-xs text-slate-400">Step 3 of 3</span>
                </div>

                {/* Payment Option Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'UPI', label: 'UPI / QR', icon: QrCode },
                    { id: 'Card', label: 'Cards', icon: CreditCard },
                    { id: 'NetBanking', label: 'NetBanking', icon: Building },
                    { id: 'COD', label: 'Cash on Del.', icon: Banknote },
                  ].map((p) => {
                    const isSelected = paymentMethod === p.id;
                    const Icon = p.icon;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPaymentMethod(p.id as any)}
                        className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                          isSelected
                            ? 'border-amber-600 bg-amber-500 text-slate-950 font-bold shadow-xs'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs font-bold">{p.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Payment Details Container */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                  {paymentMethod === 'UPI' && (
                    <div className="space-y-3">
                      <p className="text-xs text-slate-600">
                        Scan or enter your Virtual Payment Address (VPA) / UPI ID:
                      </p>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="username@okhdfcbank"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-mono font-bold"
                      />
                      <div className="flex gap-2">
                        {['@okhdfcbank', '@okaxis', '@paytm', '@ybl'].map((h) => (
                          <span
                            key={h}
                            onClick={() => setUpiId((u) => u.split('@')[0] + h)}
                            className="px-2 py-1 text-[10px] bg-white rounded border border-slate-200 cursor-pointer hover:bg-slate-100 font-mono text-slate-600"
                          >
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'Card' && (
                    <div className="space-y-3">
                      <p className="text-xs text-slate-600">Demo Credit / Debit Card Details (Zero Real Charges):</p>
                      <input
                        type="text"
                        value={cardDetails.cardNumber}
                        readOnly
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-mono font-bold"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={cardDetails.expiry}
                          readOnly
                          className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-mono font-bold"
                        />
                        <input
                          type="text"
                          value={cardDetails.cvv}
                          readOnly
                          className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-mono font-bold"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'NetBanking' && (
                    <div className="space-y-2">
                      <p className="text-xs text-slate-600">Select your bank:</p>
                      <select className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-semibold">
                        <option>State Bank of India (SBI)</option>
                        <option>HDFC Bank</option>
                        <option>ICICI Bank</option>
                        <option>Axis Bank</option>
                        <option>Kotak Mahindra Bank</option>
                      </select>
                    </div>
                  )}

                  {paymentMethod === 'COD' && (
                    <div className="space-y-1 text-xs text-slate-700">
                      <p className="font-bold text-slate-900">Cash on Delivery (COD) Selected</p>
                      <p className="text-slate-600">
                        Pay exact cash or UPI QR scan to delivery agent upon receiving your stationery parcel.
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-4 flex justify-between items-center">
                  <button
                    onClick={() => setStep(2)}
                    className="text-xs font-bold text-slate-600 hover:underline"
                  >
                    ← Back to Delivery
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg active:scale-98"
                  >
                    {loading ? (
                      <span>Placing Order...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Place Order · Pay ₹{currentTotal}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Order Review Summary (4 cols) */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900 pb-3 border-b border-slate-100">
              Review Bag ({cartCount} Items)
            </h3>

            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3 text-xs py-1">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 object-cover rounded-lg border border-slate-100 shrink-0"
                    onError={(e) => {
                      e.currentTarget.src = '/images/products/stationery-placeholder.svg';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 truncate">{item.name}</p>
                    <p className="text-[10px] text-slate-400">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-bold text-slate-900 shrink-0">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-bold text-slate-900">₹{cartSubtotal}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon ({appliedCoupon.coupon.code}):</span>
                  <span>- ₹{appliedCoupon.discount}</span>
                </div>
              )}

              {pointsDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>SmartPoints:</span>
                  <span>- ₹{pointsDiscount}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Delivery:</span>
                <span className="font-bold text-slate-900">
                  {shippingFee + expressFee === 0 ? 'FREE' : `₹${shippingFee + expressFee}`}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900">Grand Total:</span>
                <span className="text-2xl font-black text-slate-950">₹{currentTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
