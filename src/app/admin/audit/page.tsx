'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { AuditLog } from '@/lib/types';
import {
  History,
  Search,
  ShieldCheck,
  Clock,
  Terminal,
  Activity,
  User,
  Filter,
} from 'lucide-react';

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadLogs() {
      try {
        const res = await fetch('/api/admin/audit');
        if (res.ok) {
          const data = await res.json();
          setLogs(data);
        }
      } catch (err) {
        console.error('Failed to load audit logs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  const filtered = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase()) ||
      l.adminUser.toLowerCase().includes(search.toLowerCase()) ||
      l.entity.toLowerCase().includes(search.toLowerCase())
  );

  const actionBadges: Record<string, string> = {
    CREATE_PRODUCT: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    UPDATE_STOCK: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    UPDATE_ORDER_STATUS: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    CREATE_COUPON: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    UPDATE_COUPON: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    UPDATE_RFQ_STATUS: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  };

  return (
    <div className="flex min-h-screen bg-[#0F172A] text-slate-100">
      <AdminSidebar />

      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
              <History className="w-4 h-4" />
              Security & Compliance Trail
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-white">Administrative Action Audit Logs</h1>
            <p className="text-sm text-slate-400 mt-1">
              Immutable record of administrative mutations, inventory adjustments, status updates, and discount modifications.
            </p>
          </div>

          <div className="relative w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search action, admin, details..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-700/80">
                <tr>
                  <th className="px-5 py-4">Timestamp</th>
                  <th className="px-5 py-4">Admin Operator</th>
                  <th className="px-5 py-4">Action Event</th>
                  <th className="px-5 py-4">Target Entity</th>
                  <th className="px-5 py-4">Event Details</th>
                  <th className="px-5 py-4 text-right">Origin IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/40 text-slate-300">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400">
                      Loading audit trail...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400">
                      No matching audit logs found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-700/30 transition-colors font-mono">
                      <td className="px-5 py-4 whitespace-nowrap text-slate-400 font-sans text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>{new Date(log.timestamp).toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap font-sans font-bold text-white">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{log.adminUser}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                            actionBadges[log.action] || 'bg-slate-700 text-slate-300 border-slate-600'
                          }`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-amber-300 font-sans font-semibold">
                        {log.entity}
                      </td>
                      <td className="px-5 py-4 font-sans text-slate-200 text-xs">
                        {log.details}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-right text-slate-400 text-[11px]">
                        {log.ip}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
