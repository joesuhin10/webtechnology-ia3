'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { Order, OrderStatus } from '@/lib/types';
import { useCart } from '@/lib/cart-context';
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  Check,
  Truck,
  RotateCcw,
  X,
  ExternalLink,
} from 'lucide-react';

export default function AdminOrdersPage() {
  const { addToast } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusUpdate, setStatusUpdate] = useState<OrderStatus>('confirmed');
  const [statusNote, setStatusNote] = useState('');
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: statusUpdate,
          note: statusNote || `Status updated to ${statusUpdate.toUpperCase()}`,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
        setSelectedOrder(updated);
        addToast('Order Status Updated', `Order ${updated.orderNumber} set to ${statusUpdate.toUpperCase()}.`, 'success');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = orders.filter((o) => {
    if (statusFilter !== 'all' && o.orderStatus !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex min-h-screen bg-[#0F1115] text-slate-100 font-sans">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-amber-500" />
              <span>Orders & Fulfillment Management</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Manage order lifecycle stages, shipment manifests, and customer return requests.
            </p>
          </div>

          <span className="text-xs font-bold text-amber-400 bg-amber-950/60 border border-amber-800 px-3 py-1.5 rounded-xl self-start sm:self-auto">
            {orders.length} Total Orders Placed
          </span>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'pending', label: 'Pending' },
            { id: 'confirmed', label: 'Confirmed' },
            { id: 'packed', label: 'Packed' },
            { id: 'shipped', label: 'Shipped' },
            { id: 'delivered', label: 'Delivered' },
            { id: 'return_requested', label: 'Return Requested' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === tab.id
                  ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                  : 'bg-[#1E232A] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders Table */}
        <div className="bg-[#1E232A] rounded-3xl border border-slate-800 shadow-md overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Date</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-mono font-bold text-white">{ord.orderNumber}</td>
                  <td className="p-4">
                    <p className="font-bold text-white">{ord.customerName}</p>
                    <p className="text-[10px] text-slate-400">{ord.customerEmail}</p>
                  </td>
                  <td className="p-4 text-slate-400 font-mono text-[11px]">
                    {ord.createdAt.split('T')[0]}
                  </td>
                  <td className="p-4 text-slate-300">{ord.items.length} items</td>
                  <td className="p-4 font-bold text-amber-400">₹{ord.totalAmount}</td>
                  <td className="p-4">
                    <span className="font-mono text-slate-300">{ord.paymentMethod}</span>
                    <span className="text-[10px] text-slate-500 block uppercase">
                      {ord.paymentStatus}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase ${
                        ord.orderStatus === 'delivered'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : ord.orderStatus === 'cancelled'
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {ord.orderStatus.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedOrder(ord);
                        setStatusUpdate(ord.orderStatus);
                        setStatusNote('');
                      }}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-colors"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Order Details & Lifecycle Update Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
            <div className="bg-[#1E232A] rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-slate-800 shadow-2xl overflow-y-auto max-h-[90vh]">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <div>
                  <h3 className="text-base font-bold text-white">
                    Order Details: {selectedOrder.orderNumber}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Carrier: {selectedOrder.deliveryPartner} · Tracking: {selectedOrder.trackingNumber}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Lifecycle Stage Update Form */}
              <form onSubmit={handleUpdateStatus} className="p-4 bg-slate-900 rounded-2xl border border-slate-800 mb-6 space-y-3 text-xs">
                <span className="font-bold text-amber-400 block uppercase tracking-wider text-[10px]">
                  Update Order Lifecycle Status
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">New Stage</label>
                    <select
                      value={statusUpdate}
                      onChange={(e) => setStatusUpdate(e.target.value as any)}
                      className="w-full px-3 py-2 bg-[#1E232A] border border-slate-700 rounded-xl text-white font-bold"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="packed">Packed</option>
                      <option value="shipped">Shipped</option>
                      <option value="out_for_delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled (Restore Stock)</option>
                      <option value="returned">Returned / Refunded</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Timeline Note</label>
                    <input
                      type="text"
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      placeholder="e.g. Dispatched from Bengaluru hub"
                      className="w-full px-3 py-2 bg-[#1E232A] border border-slate-700 rounded-xl text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl uppercase tracking-wider"
                >
                  Save Status Transition
                </button>
              </form>

              {/* Items List */}
              <div className="space-y-3 mb-6 text-xs">
                <h4 className="font-bold text-white uppercase tracking-wider text-[10px]">
                  Ordered Products
                </h4>
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div className="flex items-center gap-3">
                      <img
                        src={it.image}
                        alt={it.name}
                        className="w-10 h-10 object-cover rounded-lg"
                      />
                      <div>
                        <p className="font-bold text-white">{it.name}</p>
                        <p className="text-[10px] text-slate-400">{it.brand} · Qty: {it.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-amber-400">₹{it.price * it.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Customer & Address Details */}
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-xs space-y-1 text-slate-300">
                <p className="font-bold text-white">Shipping Address:</p>
                <p>{selectedOrder.customerName} ({selectedOrder.customerPhone})</p>
                <p className="text-slate-400">
                  {selectedOrder.shippingAddress.addressLine}, {selectedOrder.shippingAddress.city},{' '}
                  {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
