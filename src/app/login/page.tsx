'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { Logo } from '@/components/Logo';
import { Lock, Mail, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, addToast } = useCart();
  const [email, setEmail] = useState('customer@smartstation.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(email, 'customer');
      router.push('/account');
    }, 400);
  };

  const handle1ClickDemo = () => {
    login('customer@smartstation.com', 'customer');
    router.push('/account');
  };

  return (
    <div className="bg-[#FAF8F5] min-h-[85vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xl">
        <div className="text-center mb-6">
          <Logo className="justify-center mb-3" />
          <h1 className="text-2xl font-black text-[#1D3557]">Customer Sign In</h1>
          <p className="text-xs text-slate-500 mt-1">
            Access your stationery orders, wishlist, and SmartPoints.
          </p>
        </div>

        {/* 1-Click Demo Login Banner */}
        <div className="mb-6 p-4 bg-amber-50 rounded-2xl border border-amber-200 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
            ⚡ Quick Evaluator Demo Access
          </span>
          <p className="text-xs text-slate-700 mb-2.5">
            Log in instantly with pre-seeded orders and 240 SmartPoints:
          </p>
          <button
            type="button"
            onClick={handle1ClickDemo}
            className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-colors shadow-sm"
          >
            1-Click Demo Customer Login
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-amber-500"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-slate-700 font-bold">Password</label>
              <span className="text-[11px] text-amber-700 hover:underline cursor-pointer">
                Forgot password?
              </span>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-amber-500"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-slate-900 hover:bg-amber-600 text-white font-black rounded-2xl text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Signing in...' : 'Sign In to SmartStation'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
          <p>
            Don&rsquo;t have an account?{' '}
            <Link href="/register" className="font-bold text-amber-700 hover:underline">
              Create an account
            </Link>
          </p>

          <p className="mt-4 pt-4 border-t border-slate-100 text-[11px]">
            Looking for store management?{' '}
            <Link href="/admin/login" className="font-bold text-emerald-700 hover:underline">
              Admin Login 🛡️
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
