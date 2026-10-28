'use client';

import React, { useState } from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import {
  FileSpreadsheet,
  Download,
  DollarSign,
  Package,
  Users,
  Tag,
  CheckCircle,
  FileText,
  Calendar,
} from 'lucide-react';

export default function AdminReportsPage() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const reports = [
    {
      id: 'sales',
      title: 'Sales & Revenue Report',
      description: 'Comprehensive order-by-order breakdown including amounts, customer emails, payment gateways, and delivery statuses.',
      icon: DollarSign,
      color: 'from-emerald-500 to-teal-600',
      badge: 'Revenue Data',
      filename: 'smartstation-sales-report.csv',
    },
    {
      id: 'inventory',
      title: 'Inventory & Stock Report',
      description: 'Complete stock levels, SKU identifiers, low-stock threshold triggers, prices, and stock statuses across all stationery products.',
      icon: Package,
      color: 'from-amber-500 to-orange-600',
      badge: 'Warehouse Data',
      filename: 'smartstation-inventory-report.csv',
    },
    {
      id: 'customers',
      title: 'Customer Directory & Loyalty Report',
      description: 'Customer profiles, contact phone numbers, registration dates, roles, and earned SmartPoints balances.',
      icon: Users,
      color: 'from-blue-500 to-indigo-600',
      badge: 'CRM Data',
      filename: 'smartstation-customers-report.csv',
    },
    {
      id: 'coupons',
      title: 'Promotional Coupons & Vouchers',
      description: 'Coupon codes, percentage/fixed discounts, minimum order requirements, usage counters, and expiration dates.',
      icon: Tag,
      color: 'from-purple-500 to-pink-600',
      badge: 'Marketing Data',
      filename: 'smartstation-coupons-report.csv',
    },
  ];

  async function handleDownload(reportId: string, filename: string) {
    setDownloading(reportId);
    try {
      const res = await fetch(`/api/admin/reports?type=${reportId}`);
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setDownloading(null);
    }
  }

  return (
    <div className="flex min-h-screen bg-[#0F172A] text-slate-100">
      <AdminSidebar />

      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
            <FileSpreadsheet className="w-4 h-4" />
            Business Intelligence & Compliance
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-white">Downloadable System Reports</h1>
          <p className="text-sm text-slate-400 mt-1">
            Export structured CSV data for accounting, tax audits, logistics planning, and marketing performance.
          </p>
        </div>

        {/* Report Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {reports.map((rpt) => {
            const Icon = rpt.icon;
            const isDownloading = downloading === rpt.id;

            return (
              <div
                key={rpt.id}
                className="p-6 rounded-3xl bg-slate-800/70 border border-slate-700/80 hover:border-slate-600 transition-all flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${rpt.color} text-white flex items-center justify-center shadow-lg`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-3 py-1 rounded-full bg-slate-700/80 text-slate-300">
                      {rpt.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-white mb-2">{rpt.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6">
                    {rpt.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-500">Format: .CSV</span>
                  <button
                    onClick={() => handleDownload(rpt.id, rpt.filename)}
                    disabled={isDownloading}
                    className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-700 text-slate-950 font-black rounded-xl text-xs shadow-md transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isDownloading ? 'Generating...' : 'Export CSV'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Notice Card */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-4">
          <FileText className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <h4 className="font-bold text-white text-sm">Automated Live Database Derivation</h4>
            <p className="text-slate-400 leading-relaxed">
              All exported files are generated dynamically from live store transactions, ensuring that every newly placed order,
              real-time stock decrement, and customer registration is instantly reflected in exported spreadsheets without batch caching delay.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
