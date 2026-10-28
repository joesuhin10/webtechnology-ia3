'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Order } from '@/lib/types';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Download,
  ArrowRight,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

export default function OrderSuccessPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Launch celebratory confetti burst
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {}

    async function fetchOrder() {
      if (!id) return;
      try {
        const res = await fetch(`/api/orders/${id}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [id]);

  const handleDownloadInvoice = () => {
    if (!order) return;
    const invoiceContent = `
========================================
SMARTSTATION ONLINE STATIONERY STORE
Tax Invoice & Order Receipt
========================================
Order Number: ${order.orderNumber}
Date: ${order.createdAt}
Customer Name: ${order.customerName}
Email: ${order.customerEmail}
Phone: ${order.customerPhone}

Delivery Address:
${order.shippingAddress.addressLine}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}

ITEMS PURCHASED:
${order.items.map((it) => `- ${it.name} (${it.variantName || 'Standard'}) x ${it.quantity} @ Rs. ${it.price} each = Rs. ${it.price * it.quantity}`).join('\n')}

Subtotal: Rs. ${order.subtotal}
Coupon Discount: Rs. ${order.couponDiscount}
SmartPoints Discount: Rs. ${order.pointsDiscount}
Shipping Fee: Rs. ${order.shippingFee}
Estimated Tax: Rs. ${order.tax}
TOTAL PAID: Rs. ${order.totalAmount}
Payment Method: ${order.paymentMethod} (${order.paymentStatus})
Tracking ID: ${order.trackingNumber} via ${order.deliveryPartner}
========================================
Thank you for shopping stationery with SmartStation!
    `.trim();

    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice-${order.orderNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-slate-500">Preparing your order receipt...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-24 text-center">
        <p className="text-sm font-bold text-slate-800">Order not found.</p>
        <Link href="/shop" className="text-xs text-amber-600 underline mt-2 inline-block">
          Return to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Success Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xl text-center mb-6">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-4xl mx-auto mb-4 shadow-inner animate-in zoom-in-75 duration-300">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Payment Verified & Confirmed
          </span>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1D3557] mt-3 mb-1">
            Order Placed Successfully! 🎉
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mb-6">
            Order Number: <strong className="font-mono text-slate-900">{order.orderNumber}</strong>
          </p>

          {/* Key Order Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-8 text-left text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Expected Date</span>
              <span className="font-bold text-slate-900">{order.estimatedDeliveryDate}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Total Paid</span>
              <span className="font-bold text-slate-900">₹{order.totalAmount}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Payment Method</span>
              <span className="font-bold text-slate-900">{order.paymentMethod}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Delivery Partner</span>
              <span className="font-bold text-slate-900">{order.deliveryPartner}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={`/track/${order.id}`}
              className="w-full sm:w-auto px-6 py-3 bg-[#1D3557] hover:bg-slate-800 text-white font-bold rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-md"
            >
              <Truck className="w-4 h-4 text-amber-300" />
              <span>Track Live Delivery</span>
            </Link>

            <button
              onClick={handleDownloadInvoice}
              className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span>Download Tax Invoice</span>
            </button>

            <Link
              href="/shop"
              className="w-full sm:w-auto px-6 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Order Details Accordion */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-amber-600" />
              <span>Items in this Shipment</span>
            </h3>
            <span className="text-xs text-slate-500">{order.items.length} items</span>
          </div>

          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 py-2 border-b border-slate-50 text-xs">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 object-cover rounded-xl border border-slate-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                    {item.brand}
                  </span>
                  <p className="font-bold text-slate-900 truncate">{item.name}</p>
                  {item.variantName && (
                    <p className="text-[11px] text-slate-500 font-medium">Option: {item.variantName}</p>
                  )}
                  <p className="text-[11px] text-slate-400">Qty: {item.quantity} × ₹{item.price}</p>
                </div>
                <span className="font-black text-slate-900 text-sm">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          {/* Delivery Address Details */}
          <div className="pt-4 border-t border-slate-100 flex items-start gap-3 text-xs text-slate-600">
            <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-900">Delivering to:</p>
              <p>{order.customerName} · {order.customerPhone}</p>
              <p className="text-slate-500">
                {order.shippingAddress.addressLine}, {order.shippingAddress.city},{' '}
                {order.shippingAddress.state} - {order.shippingAddress.pincode}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
