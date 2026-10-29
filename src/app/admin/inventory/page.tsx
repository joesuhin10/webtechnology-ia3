'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/cart-context';
import { AlertTriangle, Plus, Minus, Search, Check, RefreshCw, Package } from 'lucide-react';

export default function AdminInventoryPage() {
  const { addToast } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const loadInventory = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products?limit=100');
      const data = await res.json();
      setProducts(data.products || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const handleAdjustStock = async (productId: string, delta: number) => {
    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, delta }),
      });

      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId ? { ...p, stock: Math.max(0, p.stock + delta) } : p
          )
        );
        addToast('Stock Adjusted', `Stock adjusted by ${delta > 0 ? `+${delta}` : delta} units.`, 'success');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const lowStockItems = products.filter((p) => p.stock <= p.lowStockThreshold);
  const outOfStockItems = products.filter((p) => p.stock === 0);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#0F1115] text-slate-100 font-sans">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
              <span>Real-Time Inventory Management</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Live stock levels with atomic locks and threshold warning notifications.
            </p>
          </div>

          <button
            onClick={loadInventory}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Inventory</span>
          </button>
        </div>

        {/* Low Stock Warning Alert Banner */}
        {lowStockItems.length > 0 && (
          <div className="mb-8 p-5 bg-rose-950/40 border border-rose-800/80 rounded-3xl text-xs space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-bold uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Urgent Replenishment Required ({lowStockItems.length} items low or out of stock)</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {lowStockItems.slice(0, 4).map((p) => (
                <span
                  key={p.id}
                  className="px-2.5 py-1 rounded-lg bg-rose-900/60 border border-rose-700 text-rose-200 font-medium"
                >
                  {p.name}: <b>{p.stock} units remaining</b> (Min: {p.lowStockThreshold})
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Search */}
        <div className="mb-6 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items by name, brand, or SKU..."
            className="w-full px-3.5 py-2 text-xs bg-[#1E232A] border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-500"
          />
        </div>

        {/* Table */}
        <div className="bg-[#1E232A] rounded-3xl border border-slate-800 shadow-md overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                <th className="p-4">Product</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Threshold</th>
                <th className="p-4">Status</th>
                <th className="p-4">Stock Level</th>
                <th className="p-4 text-right">Quick Adjustments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.map((p) => {
                const isOut = p.stock === 0;
                const isLow = p.stock <= p.lowStockThreshold;

                return (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0] || '/images/products/stationery-placeholder.svg'}
                          alt={p.name}
                          className="w-10 h-10 object-cover rounded-lg border border-slate-700 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-white max-w-[200px] truncate">{p.name}</p>
                          <span className="text-[10px] text-amber-400 uppercase font-bold">
                            {p.brand}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-mono text-[11px] text-slate-400">{p.sku}</td>
                    <td className="p-4 text-slate-400">{p.lowStockThreshold} units</td>

                    <td className="p-4">
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase ${
                          isOut
                            ? 'bg-rose-950 text-rose-400 border border-rose-800'
                            : isLow
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        }`}
                      >
                        {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="text-base font-black text-white">{p.stock}</span>
                      <span className="text-[10px] text-slate-500 ml-1">units</span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleAdjustStock(p.id, -5)}
                          disabled={p.stock <= 0}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[11px]"
                        >
                          -5
                        </button>
                        <button
                          onClick={() => handleAdjustStock(p.id, 10)}
                          className="px-2 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px]"
                        >
                          +10
                        </button>
                        <button
                          onClick={() => handleAdjustStock(p.id, 50)}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[11px]"
                        >
                          +50
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
