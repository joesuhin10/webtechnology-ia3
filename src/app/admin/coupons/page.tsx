'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { useCart } from '@/lib/cart-context';
import { Coupon } from '@/lib/types';
import {
  Tag,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Calendar,
  Percent,
  DollarSign,
  Truck,
  X,
  AlertCircle,
} from 'lucide-react';

export default function AdminCouponsPage() {
  const { addToast } = useCart();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [form, setForm] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed' | 'free_shipping',
    discountValue: 15,
    minOrderValue: 299,
    maxDiscount: 100,
    validUntil: '',
    usageLimit: 100,
    perUserLimit: 1,
    status: 'active' as 'active' | 'disabled',
  });

  async function loadCoupons() {
    try {
      const res = await fetch('/api/coupons');
      if (res.ok) {
        const data = await res.json();
        setCoupons(data);
      }
    } catch (err) {
      console.error('Failed to load coupons:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCoupons();
  }, []);

  async function handleCreateCoupon(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        addToast({
          type: 'success',
          title: 'Coupon Created',
          message: `Coupon code ${form.code.toUpperCase()} is now live.`,
        });
        setShowAddModal(false);
        setForm({
          code: '',
          discountType: 'percentage',
          discountValue: 15,
          minOrderValue: 299,
          maxDiscount: 100,
          validUntil: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
          usageLimit: 100,
          perUserLimit: 1,
          status: 'active',
        });
        loadCoupons();
      } else {
        const data = await res.json();
        addToast({ type: 'error', title: 'Error', message: data.error || 'Failed to create coupon' });
      }
    } catch (err: any) {
      addToast({ type: 'error', title: 'Network Error', message: err.message });
    }
  }

  async function handleToggleStatus(coupon: Coupon) {
    const newStatus = coupon.status === 'active' ? 'disabled' : 'active';
    try {
      const res = await fetch(`/api/coupons/${coupon.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        addToast({
          type: 'info',
          title: 'Coupon Updated',
          message: `${coupon.code} is now ${newStatus}.`,
        });
        setCoupons((prev) =>
          prev.map((c) => (c.id === coupon.id ? { ...c, status: newStatus } : c))
        );
      }
    } catch (err: any) {
      addToast({ type: 'error', title: 'Failed to update', message: err.message });
    }
  }

  const filtered = coupons.filter((c) =>
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#0F172A] text-slate-100">
      <AdminSidebar />

      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
              <Tag className="w-4 h-4" />
              Promotion & Discounts Engine
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-white">Coupons & Offer Vouchers</h1>
            <p className="text-sm text-slate-400 mt-1">
              Manage promotional codes, percentage rebates, flat discounts, and cart minimums.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search coupon code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            <button
              onClick={() => {
                setForm((prev) => ({
                  ...prev,
                  validUntil: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
                }));
                setShowAddModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create Coupon</span>
            </button>
          </div>
        </div>

        {/* Coupons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {loading ? (
            <p className="col-span-full text-center py-12 text-slate-400">Loading coupons...</p>
          ) : filtered.length === 0 ? (
            <p className="col-span-full text-center py-12 text-slate-400">No coupons found.</p>
          ) : (
            filtered.map((coupon) => (
              <div
                key={coupon.id}
                className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-slate-600 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-base font-black px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {coupon.code}
                    </span>
                    <button
                      onClick={() => handleToggleStatus(coupon)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                        coupon.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30'
                      }`}
                    >
                      {coupon.status}
                    </button>
                  </div>

                  <div className="text-xl font-black text-white mb-2 flex items-center gap-1.5">
                    {coupon.discountType === 'percentage' && (
                      <>
                        <Percent className="w-5 h-5 text-amber-400" />
                        <span>{coupon.discountValue}% OFF</span>
                      </>
                    )}
                    {coupon.discountType === 'fixed' && (
                      <>
                        <DollarSign className="w-5 h-5 text-emerald-400" />
                        <span>₹{coupon.discountValue} FLAT OFF</span>
                      </>
                    )}
                    {coupon.discountType === 'free_shipping' && (
                      <>
                        <Truck className="w-5 h-5 text-blue-400" />
                        <span>FREE DELIVERY</span>
                      </>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 mb-4">
                    Min order ₹{coupon.minOrderValue}
                    {coupon.maxDiscount ? ` • Max discount ₹${coupon.maxDiscount}` : ''}
                  </p>

                  <div className="space-y-1.5 text-[11px] text-slate-400 border-t border-slate-700/60 pt-3">
                    <div className="flex items-center justify-between">
                      <span>Times Used</span>
                      <span className="font-bold text-white">{coupon.timesUsed || 0} times</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Usage Limit</span>
                      <span className="font-bold text-white">{coupon.usageLimit || 100}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Expires</span>
                      <span className="font-bold text-slate-300">
                        {new Date(coupon.validUntil).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500">ID: {coupon.id}</span>
                  <button
                    onClick={() => handleToggleStatus(coupon)}
                    className="text-xs font-bold text-amber-400 hover:text-amber-300 underline underline-offset-2"
                  >
                    {coupon.status === 'active' ? 'Disable Code' : 'Enable Code'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Create Coupon Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 lg:p-8 shadow-2xl relative animate-in fade-in zoom-in-95">
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                <Tag className="w-4 h-4" />
                New Voucher
              </div>
              <h2 className="text-xl font-black text-white mb-6">Create Promotional Coupon</h2>

              <form onSubmit={handleCreateCoupon} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. EXAM25"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Discount Type</label>
                    <select
                      value={form.discountType}
                      onChange={(e) => setForm({ ...form, discountType: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                      <option value="free_shipping">Free Shipping</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      {form.discountType === 'percentage' ? 'Discount %' : 'Discount ₹'}
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={form.discountType === 'percentage' ? 90 : 1000}
                      value={form.discountValue}
                      onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Min Order Value (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={form.minOrderValue}
                      onChange={(e) => setForm({ ...form, minOrderValue: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Max Cap (₹, opt)</label>
                    <input
                      type="number"
                      min={0}
                      value={form.maxDiscount}
                      onChange={(e) => setForm({ ...form, maxDiscount: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Valid Until</label>
                    <input
                      type="date"
                      required
                      value={form.validUntil}
                      onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Usage Limit</label>
                    <input
                      type="number"
                      min={1}
                      value={form.usageLimit}
                      onChange={(e) => setForm({ ...form, usageLimit: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all"
                  >
                    Publish Coupon
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
