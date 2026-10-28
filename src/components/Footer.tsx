'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import { useCart } from '@/lib/cart-context';
import { Mail, CheckCircle2, ShieldCheck, Truck, RefreshCw, Award, Heart } from 'lucide-react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { addToast } = useCart();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      addToast('Subscribed! ✉️', 'Welcome to the SmartStation newsletter club. Check your inbox for 10% off code.', 'success');
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#1E232A] text-slate-300 pt-16 pb-24 md:pb-12 border-t border-slate-800">
      {/* Value Proposition Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 pb-12 border-b border-slate-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Free Delivery</p>
              <p className="text-xs text-slate-400">On all student orders over ₹499</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">100% Genuine</p>
              <p className="text-xs text-slate-400">Direct from Classmate, DOMS & Faber</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Easy 7-Day Returns</p>
              <p className="text-xs text-slate-400">Hassle-free replacement guarantee</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">SmartPoints Rewards</p>
              <p className="text-xs text-slate-400">Earn points on every single order</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info & Newsletter */}
          <div className="lg:col-span-2">
            <div className="brightness-125 mb-4">
              <Logo showTagline={true} />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mb-6">
              SmartStation is India’s premier dedicated stationery store. From school essentials and exam prep combos to luxury fountain pens and aesthetic study desk organizers, we power thinkers, creators and students.
            </p>

            {/* Newsletter */}
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                Get stationery deals & new arrivals
              </p>
              {subscribed ? (
                <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 p-2.5 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>You are subscribed to the SmartStation newsletter!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your student or work email"
                    className="flex-1 px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shrink-0"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Column 1: Shop */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Shop</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/shop?category=writing-instruments" className="hover:text-amber-400 transition-colors">
                  Writing Instruments
                </Link>
              </li>
              <li>
                <Link href="/shop?category=notebooks-paper" className="hover:text-amber-400 transition-colors">
                  Notebooks & Registers
                </Link>
              </li>
              <li>
                <Link href="/shop?category=school-essentials" className="hover:text-amber-400 transition-colors">
                  School Supplies
                </Link>
              </li>
              <li>
                <Link href="/shop?category=office-supplies" className="hover:text-amber-400 transition-colors">
                  Office Stationery
                </Link>
              </li>
              <li>
                <Link href="/shop?category=art-supplies" className="hover:text-amber-400 transition-colors">
                  Art & Drawing Materials
                </Link>
              </li>
              <li>
                <Link href="/shop?category=desk-organizers" className="hover:text-amber-400 transition-colors">
                  Desk Organizers
                </Link>
              </li>
              <li>
                <Link href="/#kit-builder" className="hover:text-amber-400 transition-colors font-medium text-amber-300">
                  Build Custom Kit ✨
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Customer Service */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Support & Orders</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/help" className="hover:text-amber-400 transition-colors">
                  Help Center & FAQs
                </Link>
              </li>
              <li>
                <Link href="/account?tab=orders" className="hover:text-amber-400 transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/account?tab=orders" className="hover:text-amber-400 transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/bulk-orders" className="hover:text-amber-400 transition-colors font-medium text-blue-300">
                  Bulk & School Quotations
                </Link>
              </li>
              <li>
                <Link href="/account?tab=desk" className="hover:text-amber-400 transition-colors">
                  My Digital Study Desk
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-amber-400 transition-colors">
                  Product Comparison Matrix
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-emerald-400 transition-colors text-emerald-300 font-semibold">
                  Admin Portal Login 🛡️
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Policies & Company */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Policies</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/help" className="hover:text-amber-400 transition-colors">
                  Shipping & Pincode Policy
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-amber-400 transition-colors">
                  Return & Replacement Policy
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-amber-400 transition-colors">
                  Cash on Delivery Terms
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-amber-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-amber-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-amber-400 transition-colors">
                  Institutional RFQ Guidelines
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & payment methods */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 SmartStation Commerce Technologies. Built with pride for stationery lovers.</p>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">Secure Payments via:</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-bold border border-slate-700">UPI</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-bold border border-slate-700">RuPay</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-bold border border-slate-700">Visa / MC</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-bold border border-slate-700">NetBanking</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-bold border border-slate-700">COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
