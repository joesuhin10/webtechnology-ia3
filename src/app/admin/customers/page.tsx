'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { useCart } from '@/lib/cart-context';
import {
  Users,
  Search,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  Award,
  MapPin,
  ExternalLink,
  X,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';

interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  rewardPoints: number;
  createdAt: string;
  orderCount: number;
  totalSpent: number;
  addresses: any[];
  recentOrders: any[];
}

export default function AdminCustomersPage() {
  const { user } = useCart();
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);

  useEffect(() => {
    async function loadCustomers() {
      try {
        const res = await fetch('/api/admin/customers');
        if (res.ok) {
          const data = await res.json();
          setCustomers(data);
        }
      } catch (err) {
        console.error('Failed to load customers:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCustomers();
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.phone && c.phone.includes(search))
  );

  return (
    <div className="flex min-h-screen bg-[#0F172A] text-slate-100">
      <AdminSidebar />

      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
              <Users className="w-4 h-4" />
              Customer Relationship Management
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-white">Registered Customer Directory</h1>
            <p className="text-sm text-slate-400 mt-1">
              Monitor active customer profiles, lifetime order spending, reward points, and addresses.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search name, email, phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Total Registered Users</p>
              <p className="text-2xl font-black text-white">{customers.length}</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Cumulative Customer Spend</p>
              <p className="text-2xl font-black text-white">
                ₹{customers.reduce((acc, c) => acc + c.totalSpent, 0).toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">SmartPoints in Circulation</p>
              <p className="text-2xl font-black text-white">
                {customers.reduce((acc, c) => acc + (c.rewardPoints || 0), 0).toLocaleString('en-IN')} pts
              </p>
            </div>
          </div>
        </div>

        {/* Customer Table */}
        <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-700/80">
                <tr>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Contact</th>
                  <th className="px-5 py-4">Role</th>
                  <th className="px-5 py-4">SmartPoints</th>
                  <th className="px-5 py-4">Orders</th>
                  <th className="px-5 py-4">Total Spent</th>
                  <th className="px-5 py-4">Joined</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/40 text-slate-300">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-slate-400">
                      Loading customer records...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-slate-400">
                      No matching customers found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((cust) => (
                    <tr key={cust.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-500 text-white font-bold flex items-center justify-center text-xs">
                            {cust.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm">{cust.name}</p>
                            <p className="text-[11px] text-slate-400">{cust.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 space-y-0.5">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{cust.email}</span>
                        </div>
                        {cust.phone && (
                          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                            <Phone className="w-3.5 h-3.5" />
                            <span>{cust.phone}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            cust.role === 'admin'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          }`}
                        >
                          {cust.role === 'admin' && <ShieldCheck className="w-3 h-3" />}
                          {cust.role}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1 font-bold text-amber-400">
                          <Award className="w-3.5 h-3.5" />
                          <span>{cust.rewardPoints || 0} pts</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-semibold text-white">{cust.orderCount} orders</td>
                      <td className="px-5 py-4 font-extrabold text-emerald-400">
                        ₹{cust.totalSpent.toLocaleString('en-IN')}
                      </td>
                      <td className="px-5 py-4 text-slate-400">
                        {new Date(cust.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => setSelectedCustomer(cust)}
                          className="px-3 py-1.5 bg-slate-700 hover:bg-amber-500 hover:text-slate-950 font-bold rounded-lg text-xs transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer Profile Drawer Modal */}
        {selectedCustomer && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 lg:p-8 shadow-2xl relative animate-in fade-in zoom-in-95">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-500 text-white font-black text-2xl flex items-center justify-center shadow-lg">
                  {selectedCustomer.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">{selectedCustomer.name}</h2>
                  <p className="text-xs text-slate-400">{selectedCustomer.email}</p>
                  <p className="text-xs text-amber-400 font-bold mt-1">
                    Customer ID: {selectedCustomer.id} • {selectedCustomer.rewardPoints} SmartPoints
                  </p>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700">
                  <p className="text-xs text-slate-400">Lifetime Orders</p>
                  <p className="text-xl font-black text-white">{selectedCustomer.orderCount}</p>
                </div>
                <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700">
                  <p className="text-xs text-slate-400">Total Purchase Value</p>
                  <p className="text-xl font-black text-emerald-400">
                    ₹{selectedCustomer.totalSpent.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Saved Addresses */}
              <div className="mb-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  Saved Shipping Addresses ({selectedCustomer.addresses.length})
                </h3>
                {selectedCustomer.addresses.length === 0 ? (
                  <p className="text-xs text-slate-500 bg-slate-800/40 p-4 rounded-xl border border-slate-800">
                    No saved addresses on file.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selectedCustomer.addresses.map((addr: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-3.5 bg-slate-800/60 border border-slate-700/60 rounded-xl text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">{addr.fullName}</span>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                            {addr.addressType || 'Home'}
                          </span>
                        </div>
                        <p className="text-slate-300">
                          {addr.streetAddress}, {addr.city}, {addr.state} — {addr.pincode}
                        </p>
                        <p className="text-slate-400 text-[11px]">Phone: {addr.phone}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Orders */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  Recent Orders ({selectedCustomer.recentOrders.length})
                </h3>
                {selectedCustomer.recentOrders.length === 0 ? (
                  <p className="text-xs text-slate-500 bg-slate-800/40 p-4 rounded-xl border border-slate-800">
                    No orders placed yet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selectedCustomer.recentOrders.map((ord: any) => (
                      <div
                        key={ord.id}
                        className="p-3.5 bg-slate-800/60 border border-slate-700/60 rounded-xl flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-bold text-white">{ord.id}</p>
                          <p className="text-slate-400 text-[11px]">
                            {new Date(ord.createdAt).toLocaleDateString()} • {ord.items.length} items
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-white">₹{ord.totalAmount}</p>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                            {ord.orderStatus.replace(/_/g, ' ')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
