'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Order, OrderStatus } from '@/lib/types';
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  MapPin,
  Check,
  RotateCcw,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

const TRACKING_STEPS: { status: OrderStatus; label: string; desc: string }[] = [
  { status: 'pending', label: 'Order Placed', desc: 'Order received and logged in system' },
  { status: 'confirmed', label: 'Confirmed', desc: 'Payment verified & order confirmed' },
  { status: 'packed', label: 'Packed & Sealed', desc: 'Items safely packed with bubble wrap' },
  { status: 'shipped', label: 'Shipped', desc: 'Dispatched with logistics carrier' },
  { status: 'out_for_delivery', label: 'Out for Delivery', desc: 'Courier agent is on the way to your door' },
  { status: 'delivered', label: 'Delivered', desc: 'Package received by customer' },
];

export default function OrderTrackingPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  if (loading) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-slate-500">Loading delivery tracking timeline...</p>
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

  const currentStepIdx = TRACKING_STEPS.findIndex((s) => s.status === order.orderStatus);
  const isCancelled = order.orderStatus === 'cancelled';
  const isReturnRequested = order.orderStatus === 'return_requested' || order.orderStatus === 'refunded';

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xl mb-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md">
                Live Shipment Tracking
              </span>
              <h1 className="text-2xl font-black text-[#1D3557] mt-1.5">
                Order {order.orderNumber}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Carrier: <b>{order.deliveryPartner}</b> · AWB: <b>{order.trackingNumber}</b>
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[11px] text-slate-400 block">Status:</span>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  isCancelled
                    ? 'bg-rose-100 text-rose-800'
                    : order.orderStatus === 'delivered'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {order.orderStatus.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Cancelled Banner if cancelled */}
          {isCancelled && (
            <div className="my-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>This order has been cancelled and inventory was safely restored.</span>
            </div>
          )}

          {/* Visual Tracking Stepper */}
          {!isCancelled && (
            <div className="my-8">
              <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                {TRACKING_STEPS.map((stepItem, idx) => {
                  const isCompleted = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;
                  const historyMatch = order.statusHistory?.find(
                    (h) => h.status === stepItem.status
                  );

                  return (
                    <div key={stepItem.status} className="relative flex items-start gap-4">
                      {/* Step Circle Pin */}
                      <div
                        className={`absolute -left-6 sm:-left-8 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                          isCompleted
                            ? 'bg-emerald-600 text-white ring-4 ring-emerald-50'
                            : 'bg-white border-2 border-slate-300 text-slate-400'
                        }`}
                      >
                        {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h4
                            className={`text-sm font-bold ${
                              isCompleted ? 'text-slate-900' : 'text-slate-400'
                            }`}
                          >
                            {stepItem.label}
                          </h4>
                          {historyMatch && (
                            <span className="text-[11px] text-slate-400 font-mono">
                              {new Date(historyMatch.timestamp).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-500 mt-0.5">
                          {historyMatch?.note || stepItem.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Shipment Items Preview */}
          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
              Shipment Package Contents
            </h3>
            <div className="space-y-2">
              {order.items.map((it, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1">
                  <span className="text-slate-700 font-medium">
                    {it.name} <span className="text-slate-400">× {it.quantity}</span>
                  </span>
                  <span className="font-bold text-slate-900">₹{it.price * it.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center text-xs">
            <Link href="/account?tab=orders" className="text-amber-700 font-bold hover:underline">
              ← View All Orders in Account
            </Link>

            <Link href="/shop" className="text-slate-600 font-bold hover:underline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
