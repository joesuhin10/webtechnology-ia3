'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import {
  Building2,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Send,
  Calculator,
  ArrowRight,
} from 'lucide-react';

export default function BulkOrdersPage() {
  const { addToast } = useCart();

  const [organization, setOrganization] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [targetCategory, setTargetCategory] = useState('School Essentials');
  const [estimatedQuantity, setEstimatedQuantity] = useState(500);
  const [targetDeliveryDate, setTargetDeliveryDate] = useState('2026-11-20');
  const [requiredProducts, setRequiredProducts] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Dynamic Volume Discount Estimator
  const estimatedDiscountPercent =
    estimatedQuantity >= 2000 ? 25 : estimatedQuantity >= 1000 ? 20 : estimatedQuantity >= 500 ? 15 : 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organization,
          contactPerson,
          email,
          phone,
          targetCategory,
          estimatedQuantity,
          targetDeliveryDate,
          requiredProducts: requiredProducts || `${estimatedQuantity} units of ${targetCategory}`,
          additionalNotes,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        addToast('Quotation Request Received! 📋', 'Our institutional account manager will contact you with a formal quotation.', 'success');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner */}
        <div className="bg-[#1D3557] text-white rounded-3xl p-8 sm:p-12 mb-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <span className="text-amber-400 font-bold uppercase tracking-wider text-xs block mb-2">
              B2B & Institutional Procurement
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
              Institutional & Bulk Stationery Quotations
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed font-light">
              We supply schools, colleges, coaching institutes, corporate offices, and exam centres across India with direct manufacturer pricing, GST invoicing, custom kits, and priority scheduled delivery.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15 text-center shrink-0">
            <span className="text-3xl font-black text-amber-400">Up to 25%</span>
            <span className="text-xs text-slate-200 block mt-1 font-bold">Institutional Volume Discount</span>
          </div>
        </div>

        {/* 2 Column Form + Value Props */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* RFQ Submission Form (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto mb-4">
                  ✓
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Quotation Request Submitted Successfully!
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
                  Thank you, <b>{contactPerson}</b>. Our Institutional Sales team has received your request for <b>{organization}</b>. We will send the PDF quote and GST proforma invoice within 1 business day.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs uppercase"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="border-b border-slate-100 pb-3 mb-2">
                  <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-600" />
                    <span>Request Quotation (RFQ)</span>
                  </h2>
                  <p className="text-[11px] text-slate-500">Fill in your requirements below for an instant official quotation.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Organization / School Name</label>
                    <input
                      type="text"
                      required
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="e.g. St. Joseph Academy / Infosys Ltd"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Contact Person & Designation</label>
                    <input
                      type="text"
                      required
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      placeholder="e.g. Sunita Menon (Principal / Admin)"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Official Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="procurement@school.edu.in"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Phone / WhatsApp Number</label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98450 12345"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Target Category</label>
                    <select
                      value={targetCategory}
                      onChange={(e) => setTargetCategory(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                    >
                      <option>School Essentials & Geometry</option>
                      <option>Notebooks & Spiral Registers</option>
                      <option>Office Stationery & Copier Paper</option>
                      <option>Art & Drawing Supplies</option>
                      <option>Exam Hall Transparent Combos</option>
                      <option>Custom Corporate Gift Kits</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Estimated Quantity Units ({estimatedQuantity} units = ~{estimatedDiscountPercent}% discount)
                    </label>
                    <input
                      type="number"
                      min={50}
                      step={50}
                      value={estimatedQuantity}
                      onChange={(e) => setEstimatedQuantity(Number(e.target.value))}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-bold mb-1">
                      Required Products & Specific Brands (DOMS, Classmate, Pilot, etc.)
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={requiredProducts}
                      onChange={(e) => setRequiredProducts(e.target.value)}
                      placeholder="e.g. 500 Classmate A4 spiral notebooks (ruled), 500 Camlin scholar geometry boxes, 1000 blue ballpoint pens."
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-bold mb-1">Target Delivery Date</label>
                    <input
                      type="date"
                      value={targetDeliveryDate}
                      onChange={(e) => setTargetDeliveryDate(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 py-3.5 px-6 bg-slate-900 hover:bg-amber-600 text-white font-black rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Submitting Request...' : 'Submit Quotation Request'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Why Choose SmartStation for Institutions (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Dynamic Volume Estimator Box */}
            <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-3xl">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
                <Calculator className="w-4 h-4 text-amber-700" />
                <span>Tiered Volume Discount Tiers</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-amber-200/50">
                  <span className="text-slate-700">100 – 499 Units</span>
                  <span className="font-bold text-amber-800">10% Off MRP</span>
                </div>
                <div className="flex justify-between py-1 border-b border-amber-200/50">
                  <span className="text-slate-700">500 – 999 Units</span>
                  <span className="font-bold text-amber-800">15% Off MRP</span>
                </div>
                <div className="flex justify-between py-1 border-b border-amber-200/50">
                  <span className="text-slate-700">1,000 – 1,999 Units</span>
                  <span className="font-bold text-amber-800">20% Off MRP</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-700">2,000+ Units</span>
                  <span className="font-bold text-emerald-800">25% Off MRP + Free Freight</span>
                </div>
              </div>
            </div>

            {/* Why buy from SmartStation */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 text-xs">
              <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900">
                Institutional Advantages
              </h3>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900">100% Tax Compliant GST Invoices</p>
                  <p className="text-slate-500">Claim full GST input credit for your school or enterprise.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900">Custom Kit Packaging & Branding</p>
                  <p className="text-slate-500">We pack student kits pre-sorted with your school crest or logo.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900">Direct From ITC & DOMS Warehouses</p>
                  <p className="text-slate-500">Guaranteed freshest paper stocks without yellowing or age decay.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
