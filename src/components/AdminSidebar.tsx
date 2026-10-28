'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { Logo } from './Logo';
import {
  LayoutDashboard,
  Package,
  Layers,
  FolderTree,
  AlertTriangle,
  ShoppingBag,
  Users,
  Star,
  Tag,
  Flame,
  Image as ImageIcon,
  RotateCcw,
  FileSpreadsheet,
  History,
  Settings,
  LogOut,
  Building2,
  ExternalLink,
} from 'lucide-react';

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useCart();

  const links = [
    { label: 'Overview Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Products Management', href: '/admin/products', icon: Package },
    { label: 'Inventory & Stock Alerts', href: '/admin/inventory', icon: AlertTriangle },
    { label: 'Orders & Shipments', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Customer Directory', href: '/admin/customers', icon: Users },
    { label: 'Coupons & Discounts', href: '/admin/coupons', icon: Tag },
    { label: 'Bulk Order RFQs', href: '/admin/rfq', icon: Building2 },
    { label: 'Reports & Export', href: '/admin/reports', icon: FileSpreadsheet },
    { label: 'Audit Action Logs', href: '/admin/audit', icon: History },
  ];

  return (
    <aside className="w-64 bg-[#1E232A] text-slate-300 flex flex-col shrink-0 min-h-screen border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm shadow-sm">
            SS
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm text-white tracking-tight">SmartStation</span>
            <span className="text-[10px] uppercase font-bold text-emerald-400">Admin Console</span>
          </div>
        </Link>

        <Link
          href="/"
          target="_blank"
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          title="Open Customer Store"
        >
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1 block">
          Store Operations
        </span>

        {links.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Admin User Footer Profile */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 font-bold flex items-center justify-center text-xs">
              AJ
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">Admin Joe</p>
              <p className="text-[10px] text-slate-400 truncate">Super Administrator</p>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              router.push('/admin/login');
            }}
            className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
            title="Log Out Admin"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
