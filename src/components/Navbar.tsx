'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from './Logo';
import { useCart } from '@/lib/cart-context';
import {
  Search,
  Heart,
  ShoppingBag,
  User as UserIcon,
  Menu,
  X,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  ChevronDown,
  Layers,
  ShieldCheck,
  Building2,
  Gift,
  HelpCircle,
} from 'lucide-react';
import { Product, Category, Brand } from '@/lib/types';

export function Navbar() {
  const router = useRouter();
  const { cartCount, wishlist, compareList, user, logout, login } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    products: Product[];
    categories: Category[];
    brands: Brand[];
  }>({ products: [], categories: [], brands: [] });
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearching(false);
      }
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setIsAccountDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Live search debounced query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ products: [], categories: [], brands: [] });
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
          setIsSearching(true);
        }
      } catch (err) {
        console.error('Search error:', err);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(false);
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      {/* Top Announcement Bar */}
      <div className="bg-[#1D3557] text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-slate-900 font-bold px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider">
              Special
            </span>
            <span className="hidden sm:inline">
              ✨ Free Delivery on orders above ₹499 | Use code <b>STUDENT15</b> for 15% off!
            </span>
            <span className="sm:hidden">Free Delivery above ₹499 | Code: STUDENT15</span>
          </div>

          <div className="flex items-center gap-3 text-slate-200">
            <Link href="/help" className="hover:text-amber-300 transition-colors hidden md:inline">
              Help & FAQ
            </Link>
            <span className="text-slate-500 hidden md:inline">|</span>
            {/* Quick Demo Switcher for Evaluation */}
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="text-slate-400">Demo Role:</span>
              <button
                onClick={() => login('customer@smartstation.com', 'customer')}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  user?.role === 'customer'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                title="Switch to Demo Customer"
              >
                Customer
              </button>
              <button
                onClick={() => login('admin@smartstation.com', 'admin')}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  user?.role === 'admin'
                    ? 'bg-emerald-500 text-white font-bold'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                title="Switch to Demo Admin"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <Logo showTagline={false} />

          {/* Search Bar with Autocomplete */}
          <div ref={searchRef} className="relative flex-1 max-w-lg hidden lg:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pens, notebooks, brands like DOMS, Classmate..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 hover:bg-slate-100/80 focus:bg-white rounded-full border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 focus:outline-hidden transition-all text-slate-800 placeholder-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </form>

            {/* Live Autocomplete Results Modal */}
            {isSearching && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {searchResults.products.length === 0 &&
                searchResults.categories.length === 0 &&
                searchResults.brands.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 text-sm">
                    No stationery matching &ldquo;{searchQuery}&rdquo;
                  </div>
                ) : (
                  <div className="max-h-96 overflow-y-auto divide-y divide-slate-50 p-2">
                    {/* Category suggestions */}
                    {searchResults.categories.length > 0 && (
                      <div className="p-2">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1 px-2">
                          Categories
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {searchResults.categories.map((c) => (
                            <Link
                              key={c.id}
                              href={`/shop?category=${c.slug}`}
                              onClick={() => setIsSearching(false)}
                              className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-amber-50 hover:text-amber-700 rounded-lg text-slate-700 transition-colors flex items-center gap-1 font-medium"
                            >
                              <span>{c.name}</span>
                              <span className="text-[10px] text-slate-400">({c.itemCount})</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Brand suggestions */}
                    {searchResults.brands.length > 0 && (
                      <div className="p-2">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1 px-2">
                          Brands
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {searchResults.brands.map((b) => (
                            <Link
                              key={b.id}
                              href={`/shop?brand=${b.slug}`}
                              onClick={() => setIsSearching(false)}
                              className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-blue-50 hover:text-blue-700 rounded-lg text-slate-700 transition-colors font-medium"
                            >
                              {b.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Product suggestions */}
                    {searchResults.products.length > 0 && (
                      <div className="p-2">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1 px-2">
                          Products
                        </span>
                        <div className="flex flex-col gap-1">
                          {searchResults.products.slice(0, 5).map((p) => (
                            <Link
                              key={p.id}
                              href={`/product/${p.slug}`}
                              onClick={() => setIsSearching(false)}
                              className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors group"
                            >
                              <img
                                src={p.images?.[0] || '/images/products/stationery-placeholder.svg'}
                                alt={p.name}
                                className="w-10 h-10 object-cover rounded-lg border border-slate-100 shrink-0"
                                onError={(e) => {
                                  e.currentTarget.src = '/images/products/stationery-placeholder.svg';
                                }}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-amber-600">
                                  {p.name}
                                </p>
                                <p className="text-[11px] text-slate-400">{p.brand} · {p.category}</p>
                              </div>
                              <span className="text-xs font-bold text-slate-900 shrink-0">
                                ₹{p.price}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="p-2 text-center bg-slate-50">
                      <Link
                        href={`/shop?search=${encodeURIComponent(searchQuery)}`}
                        onClick={() => setIsSearching(false)}
                        className="text-xs font-semibold text-amber-600 hover:text-amber-700 inline-flex items-center gap-1"
                      >
                        View all results for &ldquo;{searchQuery}&rdquo; <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Icons: Compare, Wishlist, Cart, Account */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Compare */}
            <Link
              href="/compare"
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors hidden sm:flex items-center justify-center"
              title="Compare Products"
            >
              <SlidersHorizontal className="w-5 h-5" />
              {compareList.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {compareList.length}
                </span>
              )}
            </Link>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50/50 rounded-xl transition-colors hidden sm:flex items-center justify-center"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Shopping Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-slate-700 hover:text-amber-600 hover:bg-amber-50/50 rounded-xl transition-colors flex items-center justify-center group"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-105 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-amber-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Account Dropdown */}
            <div ref={accountRef} className="relative">
              {user ? (
                <button
                  onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-full hover:bg-slate-100 transition-colors text-slate-700 text-xs font-semibold"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-slate-200"
                  />
                  <span className="hidden sm:inline font-medium text-slate-800 max-w-[100px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
                </button>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Login</span>
                </Link>
              )}

              {/* Account Dropdown Menu */}
              {isAccountDropdownOpen && user && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{user.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    <div className="mt-1 flex items-center gap-1 text-[11px] text-amber-600 font-semibold">
                      <Sparkles className="w-3 h-3" />
                      <span>{user.rewardPoints} SmartPoints</span>
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/account?tab=orders"
                      onClick={() => setIsAccountDropdownOpen(false)}
                      className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      📦 My Orders
                    </Link>
                    <Link
                      href="/account?tab=desk"
                      onClick={() => setIsAccountDropdownOpen(false)}
                      className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      📌 My Digital Study Desk
                    </Link>
                    <Link
                      href="/wishlist"
                      onClick={() => setIsAccountDropdownOpen(false)}
                      className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      ❤️ Wishlist ({wishlist.length})
                    </Link>
                    <Link
                      href="/account?tab=rewards"
                      onClick={() => setIsAccountDropdownOpen(false)}
                      className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      🎁 SmartPoints & Coupons
                    </Link>
                    <Link
                      href="/account?tab=addresses"
                      onClick={() => setIsAccountDropdownOpen(false)}
                      className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      📍 Saved Addresses
                    </Link>

                    {/* Admin portal link */}
                    <Link
                      href="/admin"
                      onClick={() => setIsAccountDropdownOpen(false)}
                      className="block px-4 py-2 text-xs text-emerald-700 font-semibold bg-emerald-50/60 hover:bg-emerald-100/60 transition-colors border-t border-emerald-100/50 mt-1"
                    >
                      🛡️ Admin Control Panel
                    </Link>
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setIsAccountDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Admin Quick Access Button for Evaluator */}
            <Link
              href="/admin"
              className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors border border-slate-200/60"
              title="Open Admin Dashboard"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Admin Panel</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop Sub Navigation Bar */}
      <nav className="hidden md:block bg-white border-t border-slate-100/80 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-medium text-slate-700">
          <div className="flex items-center gap-6 overflow-x-auto py-2.5 scrollbar-none">
            <Link href="/" className="hover:text-amber-600 transition-colors font-semibold">
              Home
            </Link>
            <Link href="/shop" className="hover:text-amber-600 transition-colors">
              All Stationery
            </Link>
            <Link href="/shop?category=writing-instruments" className="hover:text-amber-600 transition-colors">
              Writing
            </Link>
            <Link href="/shop?category=notebooks-paper" className="hover:text-amber-600 transition-colors">
              Notebooks
            </Link>
            <Link href="/shop?category=school-essentials" className="hover:text-amber-600 transition-colors">
              School
            </Link>
            <Link href="/shop?category=office-supplies" className="hover:text-amber-600 transition-colors">
              Office
            </Link>
            <Link href="/shop?category=art-supplies" className="hover:text-amber-600 transition-colors">
              Art & Drawing
            </Link>
            <Link href="/shop?deals=true" className="hover:text-amber-600 text-amber-700 font-semibold transition-colors flex items-center gap-1">
              🔥 Deals & Offers
            </Link>
            <Link href="/shop?filter=new" className="hover:text-amber-600 transition-colors">
              New Arrivals
            </Link>
            <Link href="/shop?filter=bestseller" className="hover:text-amber-600 transition-colors">
              Best Sellers
            </Link>
            <Link href="/bulk-orders" className="hover:text-amber-600 transition-colors flex items-center gap-1 font-semibold text-blue-800">
              <Building2 className="w-3.5 h-3.5" />
              Bulk Orders
            </Link>
          </div>

          <div className="flex items-center gap-3 shrink-0 py-2">
            <Link
              href="/#kit-builder"
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-full font-semibold transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Build Custom Kit</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[98px] bottom-0 bg-white z-50 overflow-y-auto p-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-4">
          {/* Mobile search bar */}
          <form onSubmit={handleSearchSubmit} className="mb-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stationery products..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-hidden"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </form>

          <div className="flex flex-col gap-2 font-medium text-slate-800 text-sm">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 hover:bg-slate-50 rounded-xl"
            >
              🏠 Home
            </Link>
            <Link
              href="/shop"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 hover:bg-slate-50 rounded-xl"
            >
              📚 All Stationery
            </Link>
            <Link
              href="/shop?deals=true"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 hover:bg-amber-50 text-amber-800 font-semibold rounded-xl"
            >
              🔥 Deals & Flash Sale
            </Link>
            <Link
              href="/#kit-builder"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 bg-amber-50 text-amber-900 font-semibold rounded-xl"
            >
              ✨ Build Your Own Stationery Kit
            </Link>
            <Link
              href="/#stationery-finder"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 hover:bg-slate-50 rounded-xl"
            >
              🧭 Stationery Finder Questionnaire
            </Link>
            <Link
              href="/bulk-orders"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 hover:bg-slate-50 rounded-xl font-semibold text-blue-900"
            >
              🏢 Institutional & Bulk Orders
            </Link>
            <Link
              href="/compare"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 hover:bg-slate-50 rounded-xl"
            >
              ⚖️ Compare Products ({compareList.length})
            </Link>
            <Link
              href="/wishlist"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 hover:bg-slate-50 rounded-xl"
            >
              ❤️ Saved Wishlist ({wishlist.length})
            </Link>
            <Link
              href="/account"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 hover:bg-slate-50 rounded-xl"
            >
              👤 My Account & Orders
            </Link>
            <Link
              href="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 bg-emerald-50 text-emerald-900 font-bold rounded-xl mt-2"
            >
              🛡️ Admin Control Panel
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
