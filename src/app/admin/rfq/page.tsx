'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { useCart } from '@/lib/cart-context';
import { BulkOrderRFQ } from '@/lib/types';
import {
  Building2,
  Search,
  Mail,
  Phone,
  Calendar,
  Layers,
  FileText,
  CheckCircle2,
  Clock,
  CheckCheck,
  Ban,
  ArrowRight,
  Filter,
} from 'lucide-react';

export default function AdminRFQPage() {
  const { addToast } = useCart();
  const [rfqs, setRfqs] = useState<BulkOrderRFQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  async function loadRFQs() {
    try {
      const res = await fetch('/api/rfq');
      if (res.ok) {
        const data = await res.json();
        setRfqs(data);
      }
    } catch (err) {
      console.error('Failed to load RFQs:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRFQs();
  }, []);

  async function handleStatusChange(id: string, status: BulkOrderRFQ['status']) {
    try {
      const res = await fetch(`/api/rfq/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        addToast({
          type: 'success',
          title: 'Status Updated',
          message: `RFQ ${id} status set to ${status}.`,
        });
        setRfqs((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status } : r))
        );
      }
    } catch (err: any) {
      addToast({ type: 'error', title: 'Update Failed', message: err.message });
    }
  }

  const filtered = rfqs.filter((r) => {
    const matchesSearch =
      r.organization.toLowerCase().includes(search.toLowerCase()) ||
      r.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusColors = {
    pending: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    quoted: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    approved: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30',
    fulfilled: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    cancelled: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
  };

  return (
    <div className="flex min-h-screen bg-[#0F172A] text-slate-100">
      <AdminSidebar />

      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
              <Building2 className="w-4 h-4" />
              Institutional B2B Procurement
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-white">Bulk Order Quotation Requests</h1>
            <p className="text-sm text-slate-400 mt-1">
              Review institutional inquiry submissions from schools, colleges, offices, and enterprises.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search organization, name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="quoted">Quoted</option>
              <option value="approved">Approved</option>
              <option value="fulfilled">Fulfilled</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {loading ? (
            <p className="text-center py-12 text-slate-400">Loading quotation requests...</p>
          ) : filtered.length === 0 ? (
            <p className="text-center py-12 text-slate-400">No matching quotation requests found.</p>
          ) : (
            filtered.map((rfq) => (
              <div
                key={rfq.id}
                className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-slate-600 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-xs text-slate-400">{rfq.id}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        statusColors[rfq.status] || 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {rfq.status}
                    </span>
                    <span className="text-xs text-slate-400">
                      Submitted: {new Date(rfq.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-white">{rfq.organization}</h3>
                    <p className="text-xs text-slate-300">
                      Contact: <span className="font-bold text-white">{rfq.contactPerson}</span>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {rfq.email}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {rfq.phone}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-amber-400" />
                      Category: <span className="text-white font-semibold">{rfq.targetCategory}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                      Target Date: <span className="text-white font-semibold">{rfq.targetDeliveryDate}</span>
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                    <p className="text-slate-400 mb-1 font-semibold">
                      Required Products & Specs ({rfq.estimatedQuantity} estimated units):
                    </p>
                    <p className="text-white leading-relaxed">{rfq.requiredProducts}</p>
                    {rfq.additionalNotes && (
                      <p className="text-slate-400 mt-2 text-[11px] italic">
                        Note: {rfq.additionalNotes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Status action buttons */}
                <div className="lg:w-48 shrink-0 flex flex-col gap-2 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-700">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Update Procurement Status
                  </p>

                  {rfq.status === 'pending' && (
                    <button
                      onClick={() => handleStatusChange(rfq.id, 'quoted')}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      Send Price Quote
                    </button>
                  )}

                  {(rfq.status === 'pending' || rfq.status === 'quoted') && (
                    <button
                      onClick={() => handleStatusChange(rfq.id, 'approved')}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Approve Quote
                    </button>
                  )}

                  {rfq.status === 'approved' && (
                    <button
                      onClick={() => handleStatusChange(rfq.id, 'fulfilled')}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      Mark as Fulfilled
                    </button>
                  )}

                  {rfq.status !== 'cancelled' && rfq.status !== 'fulfilled' && (
                    <button
                      onClick={() => handleStatusChange(rfq.id, 'cancelled')}
                      className="w-full py-1.5 bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 font-semibold rounded-xl text-[11px] transition-colors"
                    >
                      Reject / Cancel
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
