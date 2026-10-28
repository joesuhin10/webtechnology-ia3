'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { Order, Product } from '@/lib/types';
import {
  Package,
  Heart,
  Sparkles,
  MapPin,
  User as UserIcon,
  RotateCcw,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Download,
  ShoppingBag,
  Trash2,
  Plus,
  Bookmark,
  ShieldCheck,
  Check,
  Layers,
} from 'lucide-react';

function AccountContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = searchParams.get('tab') || 'orders';

  const { user, wishlist, addToCart, addToast } = useCart();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Return modal state
  const [returningOrder, setReturningOrder] = useState<Order | null>(null);
  const [returnReason, setReturnReason] = useState('Damaged product');
  const [returnDetails, setReturnDetails] = useState('');
  const [isSubmittingReturn, setIsSubmittingReturn] = useState(false);

  // Digital Study Desk items (saved pinned essentials)
  const [deskItems, setDeskItems] = useState<{ id: string; name: string; category: string; checked: boolean }[]>([
    { id: '1', name: 'Classmate A4 Spiral Notebook', category: 'Notebooks', checked: true },
    { id: '2', name: 'Pentel EnerGel 0.5mm Pen (Blue)', category: 'Pens', checked: true },
    { id: '3', name: 'Flair Pastel Highlighters', category: 'Highlighters', checked: false },
    { id: '4', name: 'DOMS 0.7mm Mechanical Pencil', category: 'Pencils', checked: true },
    { id: '5', name: 'Post-it Pastel Sticky Notes Cube', category: 'Study Notes', checked: false },
  ]);
  const [newDeskItem, setNewDeskItem] = useState('');

  useEffect(() => {
    async function fetchOrders() {
      if (!user) return;
      try {
        const res = await fetch(`/api/orders?customerId=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setOrders(data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="bg-[#FAF8F5] min-h-[70vh] flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center border border-slate-200/80 shadow-xs">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Customer Sign In Required</h2>
          <p className="text-xs text-slate-500 mb-6">Please log in to view your account dashboard and past orders.</p>
          <Link
            href="/login"
            className="px-6 py-3 bg-slate-900 hover:bg-amber-600 text-white font-bold rounded-2xl text-xs uppercase transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // Quick reorder 1-click function
  const handleBuyAgain = (order: Order) => {
    order.items.forEach((item) => {
      addToCart({
        id: item.productId,
        name: item.name,
        slug: item.productId,
        sku: item.sku,
        barcode: '',
        brand: item.brand,
        brandId: '',
        category: 'Stationery',
        categoryId: 'cat-writing',
        subcategory: '',
        description: '',
        shortDescription: '',
        price: item.price,
        mrp: Math.round(item.price * 1.2),
        discountPercentage: 15,
        taxPercentage: 12,
        stock: 50,
        lowStockThreshold: 10,
        images: [item.image],
        rating: 4.8,
        reviewCount: 50,
        isNew: false,
        isBestseller: true,
        isFeatured: false,
        purposeTags: ['College', 'School'],
        specifications: {},
        variants: [],
        status: 'active',
        createdAt: '',
      });
    });
    addToast('Reordered! 🛒', `All items from order ${order.orderNumber} added to your bag.`, 'success');
    router.push('/cart');
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, { method: 'POST' });
      if (res.ok) {
        addToast('Order Cancelled', 'Your order was cancelled and inventory restored.', 'info');
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, orderStatus: 'cancelled' } : o))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const submitReturnRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!returningOrder) return;
    setIsSubmittingReturn(true);
    try {
      const res = await fetch(`/api/orders/${returningOrder.id}/return`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: returnReason, details: returnDetails }),
      });
      if (res.ok) {
        addToast('Return Requested', 'Our support team will review and approve within 24 hours.', 'success');
        setOrders((prev) =>
          prev.map((o) => (o.id === returningOrder.id ? { ...o, orderStatus: 'return_requested' } : o))
        );
        setReturningOrder(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingReturn(false);
    }
  };

  // Add desk item
  const handleAddDeskItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeskItem.trim()) return;
    setDeskItems((prev) => [
      ...prev,
      { id: String(Date.now()), name: newDeskItem.trim(), category: 'General', checked: false },
    ]);
    setNewDeskItem('');
    addToast('Item Pinned 📌', 'Added to your Digital Study Desk checklist.', 'success');
  };

  const toggleDeskItem = (id: string) => {
    setDeskItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, checked: !it.checked } : it))
    );
  };

  const removeDeskItem = (id: string) => {
    setDeskItems((prev) => prev.filter((it) => it.id !== id));
  };

  const deliveredCount = orders.filter((o) => o.orderStatus === 'delivered').length;
  const pendingCount = orders.filter((o) => ['pending', 'confirmed', 'packed', 'shipped'].includes(o.orderStatus)).length;

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* User Profile Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500/20 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900">{user.name}</h1>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                  Verified Student
                </span>
              </div>
              <p className="text-xs text-slate-500">{user.email} · {user.phone}</p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-lg font-black text-slate-900">{orders.length}</span>
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Total Orders</span>
            </div>
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100">
              <span className="text-lg font-black text-amber-700">{pendingCount}</span>
              <span className="text-[10px] text-amber-800 block uppercase font-bold">In Transit</span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
              <span className="text-lg font-black text-emerald-700">{deliveredCount}</span>
              <span className="text-[10px] text-emerald-800 block uppercase font-bold">Delivered</span>
            </div>
            <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100">
              <span className="text-lg font-black text-purple-700">{user.rewardPoints}</span>
              <span className="text-[10px] text-purple-800 block uppercase font-bold">SmartPoints</span>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs & Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Tabs Menu (3 cols) */}
          <div className="lg:col-span-3 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs space-y-1">
            {[
              { id: 'orders', label: 'My Orders', icon: Package },
              { id: 'desk', label: 'My Digital Study Desk', icon: Bookmark, badge: 'Unique' },
              { id: 'rewards', label: 'SmartPoints & Rewards', icon: Sparkles },
              { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
              { id: 'profile', label: 'Profile & Security', icon: UserIcon },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge && (
                    <span className="text-[9px] bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded uppercase font-black">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Tab Content (9 cols) */}
          <div className="lg:col-span-9 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
            {/* TAB: MY ORDERS */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 mb-6 pb-3 border-b border-slate-100 flex items-center gap-2">
                  <Package className="w-5 h-5 text-amber-600" />
                  <span>My Stationery Orders</span>
                </h2>

                {orders.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-xs">
                    No orders placed yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/40 hover:bg-white transition-all space-y-4"
                      >
                        {/* Order header row */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/60 text-xs">
                          <div>
                            <span className="font-mono font-bold text-slate-900">{ord.orderNumber}</span>
                            <span className="text-slate-400 ml-2">
                              {new Date(ord.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="font-black text-slate-950">₹{ord.totalAmount}</span>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                ord.orderStatus === 'delivered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : ord.orderStatus === 'cancelled'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {ord.orderStatus.replace('_', ' ')}
                            </span>
                          </div>
                        </div>

                        {/* Order items preview */}
                        <div className="flex flex-wrap gap-3 items-center">
                          {ord.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-100 text-xs">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-10 h-10 object-cover rounded-lg"
                              />
                              <div className="max-w-[140px] truncate">
                                <p className="font-semibold text-slate-900 truncate">{item.name}</p>
                                <p className="text-[10px] text-slate-400">Qty: {item.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Actions bar */}
                        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-3 font-semibold text-amber-700">
                            <Link href={`/track/${ord.id}`} className="hover:underline flex items-center gap-1">
                              <span>Track Live</span>
                            </Link>
                            <span>·</span>
                            <Link href={`/order-success/${ord.id}`} className="hover:underline">
                              View Invoice
                            </Link>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Buy Again 1-click */}
                            <button
                              onClick={() => handleBuyAgain(ord)}
                              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1 transition-colors"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Buy Again</span>
                            </button>

                            {/* Cancel order if pending */}
                            {ord.orderStatus === 'pending' && (
                              <button
                                onClick={() => handleCancelOrder(ord.id)}
                                className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs transition-colors"
                              >
                                Cancel Order
                              </button>
                            )}

                            {/* Request return if delivered */}
                            {ord.orderStatus === 'delivered' && (
                              <button
                                onClick={() => setReturningOrder(ord)}
                                className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs transition-colors"
                              >
                                Return Item
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: DIGITAL STUDY DESK (Unique Feature 71) */}
            {activeTab === 'desk' && (
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-6">
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                      <Bookmark className="w-5 h-5 text-amber-600" />
                      <span>My Digital Study Desk</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Pin your daily stationery checklist and fast restock list.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">
                    Study Space Active
                  </span>
                </div>

                {/* Desk Checklist Container */}
                <div className="bg-amber-50/40 p-6 rounded-3xl border border-amber-200/60 mb-6">
                  <h3 className="text-xs font-black uppercase tracking-wider text-amber-900 mb-4">
                    Daily Study Essentials Checklist
                  </h3>

                  <div className="space-y-2 mb-4">
                    {deskItems.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between p-3 rounded-2xl bg-white border transition-all ${
                          item.checked ? 'border-emerald-300 opacity-60' : 'border-slate-200'
                        }`}
                      >
                        <div
                          onClick={() => toggleDeskItem(item.id)}
                          className="flex items-center gap-3 cursor-pointer flex-1"
                        >
                          <div
                            className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                              item.checked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'
                            }`}
                          >
                            {item.checked && <Check className="w-3.5 h-3.5" />}
                          </div>
                          <span
                            className={`text-xs font-bold ${
                              item.checked ? 'line-through text-slate-400' : 'text-slate-800'
                            }`}
                          >
                            {item.name}
                          </span>
                        </div>

                        <button
                          onClick={() => removeDeskItem(item.id)}
                          className="text-slate-300 hover:text-rose-500 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleAddDeskItem} className="flex gap-2">
                    <input
                      type="text"
                      value={newDeskItem}
                      onChange={(e) => setNewDeskItem(e.target.value)}
                      placeholder="Add stationery item to your study desk..."
                      className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-amber-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-900 hover:bg-amber-600 text-white font-bold rounded-xl text-xs transition-colors shrink-0"
                    >
                      Pin to Desk
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* TAB: SMARTPOINTS REWARDS */}
            {activeTab === 'rewards' && (
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 mb-6 pb-3 border-b border-slate-100 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  <span>SmartPoints & Student Rewards</span>
                </h2>

                <div className="p-6 bg-gradient-to-tr from-amber-500/10 via-amber-500/5 to-white rounded-3xl border border-amber-200/80 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
                      Available Points Balance
                    </span>
                    <span className="text-3xl font-black text-slate-900">
                      {user.rewardPoints} <span className="text-sm font-normal text-slate-500">Points</span>
                    </span>
                    <p className="text-xs text-emerald-700 font-bold mt-1">
                      Equivalent to ₹{user.rewardPoints} instant discount on next purchase.
                    </p>
                  </div>

                  <Link
                    href="/shop"
                    className="px-5 py-2.5 bg-slate-900 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shrink-0"
                  >
                    Redeem at Checkout
                  </Link>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    How SmartPoints Work
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="font-bold text-slate-900 mb-1">🛍️ Shop Stationery</p>
                      <p className="text-slate-500">Earn 5 points for every ₹100 spent on notebooks, pens and kits.</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="font-bold text-slate-900 mb-1">✍️ Write Reviews</p>
                      <p className="text-slate-500">Earn 20 bonus points when you review a verified stationery item.</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="font-bold text-slate-900 mb-1">💸 Instant Discount</p>
                      <p className="text-slate-500">1 point = ₹1 off at checkout with zero restrictions.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: SAVED ADDRESSES */}
            {activeTab === 'addresses' && (
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 mb-6 pb-3 border-b border-slate-100 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-600" />
                  <span>Saved Delivery Addresses</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {user.addresses.map((addr) => (
                    <div key={addr.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{addr.fullName}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                          {addr.type}
                        </span>
                      </div>
                      <p className="text-slate-600">{addr.addressLine}</p>
                      <p className="text-slate-600">{addr.city}, {addr.state} - {addr.pincode}</p>
                      <p className="text-slate-500 font-mono">Ph: {addr.phone}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: PROFILE */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 mb-6 pb-3 border-b border-slate-100 flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-amber-600" />
                  <span>Profile Information</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-500 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={user.name}
                      readOnly
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={user.email}
                      readOnly
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={user.phone}
                      readOnly
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Role</label>
                    <input
                      type="text"
                      value={user.role.toUpperCase()}
                      readOnly
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Return Modal */}
        {returningOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100">
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Request Return for {returningOrder.orderNumber}
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Please specify the reason for your stationery return request.
              </p>

              <form onSubmit={submitReturnRequest} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Reason</label>
                  <select
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option>Damaged product</option>
                    <option>Wrong product received</option>
                    <option>Missing item</option>
                    <option>Defective product</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Additional details</label>
                  <textarea
                    rows={3}
                    value={returnDetails}
                    onChange={(e) => setReturnDetails(e.target.value)}
                    placeholder="Describe the issue..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="flex gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setReturningOrder(null)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingReturn}
                    className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-amber-600 text-white font-bold"
                  >
                    {isSubmittingReturn ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading Account...</div>}>
      <AccountContent />
    </Suspense>
  );
}
