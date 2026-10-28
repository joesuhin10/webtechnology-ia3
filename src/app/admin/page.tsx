'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminSidebar } from '@/components/AdminSidebar';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Package,
  AlertTriangle,
  RotateCcw,
  Clock,
  ArrowRight,
  Filter,
  CheckCircle2,
  DollarSign,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [range, setRange] = useState('30d');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/dashboard?range=${range}`);
        if (res.ok) {
          const resData = await res.json();
          setData(resData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [range]);

  return (
    <div className="flex min-h-screen bg-[#0F1115] text-slate-100 font-sans">
      <AdminSidebar />

      {/* Main Admin Content */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        {/* Top greeting bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Good morning, Admin Joe 👋</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Here&rsquo;s what&rsquo;s happening across SmartStation today.
            </p>
          </div>

          {/* Time range selector */}
          <div className="flex items-center gap-2 bg-[#1E232A] p-1 rounded-xl border border-slate-800 text-xs">
            {['7d', '30d', '1y'].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 rounded-lg font-bold uppercase transition-colors ${
                  range === r
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {r === '7d' ? 'Last 7 Days' : r === '30d' ? 'Last 30 Days' : 'This Year'}
              </button>
            ))}
          </div>
        </div>

        {loading || !data ? (
          <div className="py-24 text-center text-slate-500 text-xs">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading real-time store analytics...
          </div>
        ) : (
          <div className="space-y-8">
            {/* 37. Top KPI Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Revenue */}
              <div className="bg-[#1E232A] p-5 rounded-3xl border border-slate-800 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Total Revenue
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <span className="text-2xl sm:text-3xl font-black text-white">
                  ₹{data.kpis.totalRevenue.toLocaleString()}
                </span>
                <span className="text-[11px] text-emerald-400 block mt-1 font-semibold">
                  +18.4% from last period
                </span>
              </div>

              {/* Total Orders */}
              <div className="bg-[#1E232A] p-5 rounded-3xl border border-slate-800 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Total Orders
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <span className="text-2xl sm:text-3xl font-black text-white">
                  {data.kpis.totalOrders}
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">
                  Avg Value: <b>₹{data.kpis.averageOrderValue}</b>
                </span>
              </div>

              {/* Customers */}
              <div className="bg-[#1E232A] p-5 rounded-3xl border border-slate-800 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Registered Customers
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <span className="text-2xl sm:text-3xl font-black text-white">
                  {data.kpis.totalCustomers}
                </span>
                <span className="text-[11px] text-purple-400 block mt-1 font-semibold">
                  Active Student Community
                </span>
              </div>

              {/* Low Stock Urgent Replenishment Alert */}
              <div className="bg-[#1E232A] p-5 rounded-3xl border border-rose-900/40 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                    Low Stock Alerts
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </div>
                <span className="text-2xl sm:text-3xl font-black text-rose-400">
                  {data.kpis.lowStockCount}
                </span>
                <Link
                  href="/admin/inventory"
                  className="text-[11px] text-rose-300 hover:underline block mt-1 font-semibold"
                >
                  Restock Now →
                </Link>
              </div>
            </div>

            {/* 39. Sales Graph & Category Shares (2 columns) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Sales Timeline Bar / Height Chart (8 cols) */}
              <div className="lg:col-span-8 bg-[#1E232A] p-6 rounded-3xl border border-slate-800 shadow-md">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">
                      Sales & Revenue Trajectory
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Dynamic database order volume over time ({range})
                    </p>
                  </div>
                  <span className="text-xs text-emerald-400 font-mono font-bold">
                    Peak: ₹{(Math.max(...data.timeline.map((t: any) => t.revenue)) * 1.1).toFixed(0)}
                  </span>
                </div>

                {/* SVG / Flex Interactive Visual Chart */}
                <div className="h-56 flex items-end gap-2 pt-6 pb-2 px-2 border-b border-slate-800">
                  {data.timeline.map((point: any, idx: number) => {
                    const maxRev = Math.max(...data.timeline.map((t: any) => t.revenue)) || 1;
                    const heightPercent = Math.max(12, Math.round((point.revenue / maxRev) * 100));

                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                        {/* Hover Tooltip */}
                        <div className="absolute -top-10 bg-slate-900 border border-slate-700 px-2 py-1 rounded text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                          {point.date}: ₹{point.revenue} ({point.orders} orders)
                        </div>

                        {/* Bar */}
                        <div
                          className="w-full bg-gradient-to-t from-amber-600 to-amber-400 hover:from-amber-500 hover:to-amber-300 rounded-t-lg transition-all duration-300"
                          style={{ height: `${heightPercent}%` }}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Date Labels */}
                <div className="flex justify-between text-[10px] text-slate-500 mt-2 px-1 font-mono">
                  <span>{data.timeline[0]?.date}</span>
                  <span>{data.timeline[Math.floor(data.timeline.length / 2)]?.date}</span>
                  <span>{data.timeline[data.timeline.length - 1]?.date}</span>
                </div>
              </div>

              {/* Category Breakdown (4 cols) */}
              <div className="lg:col-span-4 bg-[#1E232A] p-6 rounded-3xl border border-slate-800 shadow-md flex flex-col">
                <h3 className="font-extrabold text-sm text-white uppercase tracking-wider mb-1">
                  Category Revenue Share
                </h3>
                <p className="text-xs text-slate-400 mb-4">Percentage breakdown by category</p>

                <div className="space-y-3 flex-1 overflow-y-auto">
                  {data.categoryBreakdown.map((cat: any, i: number) => {
                    const totalCatRev = data.categoryBreakdown.reduce((sum: number, c: any) => sum + c.revenue, 0) || 1;
                    const share = Math.round((cat.revenue / totalCatRev) * 100) || 12;

                    return (
                      <div key={cat.name} className="space-y-1 text-xs">
                        <div className="flex justify-between text-slate-300 font-semibold">
                          <span className="truncate max-w-[160px]">{cat.name}</span>
                          <span className="text-amber-400 font-bold">{share}%</span>
                        </div>
                        <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-amber-500 h-full rounded-full"
                            style={{ width: `${share}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 40. Top Selling Products & Low Stock Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Selling Products */}
              <div className="bg-[#1E232A] p-6 rounded-3xl border border-slate-800 shadow-md">
                <h3 className="font-extrabold text-sm text-white uppercase tracking-wider mb-4 flex items-center justify-between">
                  <span>Top Selling Stationery</span>
                  <Link href="/admin/products" className="text-xs text-amber-400 hover:underline">
                    All Products →
                  </Link>
                </h3>

                <div className="divide-y divide-slate-800">
                  {data.topProducts.slice(0, 5).map((item: any, idx: number) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-5 text-center font-bold text-slate-500">#{idx + 1}</span>
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-9 h-9 object-cover rounded-lg border border-slate-700 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-white truncate max-w-[180px]">
                            {item.product.name}
                          </p>
                          <p className="text-[10px] text-slate-400">{item.product.brand}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-bold text-amber-400 block">₹{item.revenue}</span>
                        <span className="text-[10px] text-slate-400">{item.unitsSold} units sold</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Orders List */}
              <div className="bg-[#1E232A] p-6 rounded-3xl border border-slate-800 shadow-md">
                <h3 className="font-extrabold text-sm text-white uppercase tracking-wider mb-4 flex items-center justify-between">
                  <span>Recent Customer Orders</span>
                  <Link href="/admin/orders" className="text-xs text-amber-400 hover:underline">
                    Manage Orders →
                  </Link>
                </h3>

                <div className="divide-y divide-slate-800">
                  {data.recentOrders.slice(0, 5).map((ord: any) => (
                    <div key={ord.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono font-bold text-white">{ord.orderNumber}</span>
                        <p className="text-[11px] text-slate-400">
                          {ord.customerName} · ₹{ord.totalAmount}
                        </p>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          ord.orderStatus === 'delivered'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : ord.orderStatus === 'cancelled'
                            ? 'bg-rose-950 text-rose-400 border border-rose-800'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}
                      >
                        {ord.orderStatus.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
