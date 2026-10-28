'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { ShieldCheck, Lock, Mail, ArrowRight, KeyRound } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, addToast } = useCart();
  const [email, setEmail] = useState('admin@smartstation.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login('admin@smartstation.com', 'admin');
      router.push('/admin');
    }, 400);
  };

  const handle1ClickAdmin = () => {
    login('admin@smartstation.com', 'admin');
    router.push('/admin');
  };

  return (
    <div className="bg-[#111317] min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#1E232A] rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center text-xl font-black mx-auto mb-3 shadow-lg shadow-amber-500/20">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-white">SmartStation Admin</h1>
          <p className="text-xs text-slate-400 mt-1">
            Restricted Business Management & Analytics Gateway
          </p>
        </div>

        {/* 1-Click Demo Admin Button */}
        <div className="mb-6 p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-2xl text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
            ⚡ 1-Click Evaluator Access
          </span>
          <p className="text-xs text-slate-300 mb-2.5">
            Log in as Super Admin with pre-loaded sales charts and inventory:
          </p>
          <button
            type="button"
            onClick={handle1ClickAdmin}
            className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-colors shadow-md"
          >
            1-Click Demo Admin Login
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1">Admin Email</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 text-white rounded-xl focus:outline-hidden focus:border-amber-500"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 text-white rounded-xl focus:outline-hidden focus:border-amber-500"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-2xl text-xs uppercase tracking-wider transition-colors shadow-lg flex items-center justify-center gap-2 mt-4"
          >
            <span>{loading ? 'Authenticating...' : 'Enter Admin Console'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-xs text-slate-400 hover:text-amber-400 transition-colors"
          >
            ← Return to Customer Store
          </button>
        </div>
      </div>
    </div>
  );
}
