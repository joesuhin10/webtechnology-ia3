'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product, Category } from '@/lib/types';
import { useCart } from '@/lib/cart-context';
import { ProductCard } from '@/components/ProductCard';
import { BuildStationeryKit } from '@/components/BuildStationeryKit';
import { ShopByPurpose } from '@/components/ShopByPurpose';
import { StationeryFinder } from '@/components/StationeryFinder';
import { FlashDealsCountdown } from '@/components/FlashDealsCountdown';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  PenTool,
  GraduationCap,
  Briefcase,
  Palette,
  Scissors,
  Calendar,
  LayoutGrid,
  CheckSquare,
  Gift,
  Truck,
  RotateCcw,
  ShieldCheck,
  Award,
} from 'lucide-react';

export default function HomePage() {
  const { user, wishlist, addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch('/api/products?limit=50'),
          fetch('/api/categories'),
        ]);
        const prodData = await prodRes.json();
        const catData = await catRes.json();
        setProducts(prodData.products || []);
        setCategories(catData || []);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const bestsellers = products.filter((p) => p.isBestseller).slice(0, 4);
  const newArrivals = products.filter((p) => p.isNew).slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Personalized Welcome Banner for Logged-In Users */}
      {user && (
        <div className="bg-amber-50/70 border-b border-amber-200/50 py-3 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-800">
              <span className="text-base">👋</span>
              <span className="font-bold">Welcome back, {user.name}!</span>
              <span className="text-slate-500 hidden sm:inline">
                Ready to restock your desk? You have <b>{user.rewardPoints} SmartPoints</b> ready to redeem.
              </span>
            </div>

            <div className="flex items-center gap-3 font-semibold text-amber-800">
              <Link href="/account?tab=orders" className="hover:underline flex items-center gap-1">
                <span>Recent Orders</span>
              </Link>
              <span>·</span>
              <Link href="/account?tab=desk" className="hover:underline flex items-center gap-1">
                <span>📌 My Desk</span>
              </Link>
              {wishlist.length > 0 && (
                <>
                  <span>·</span>
                  <Link href="/wishlist" className="hover:underline text-rose-600">
                    Saved Items ({wishlist.length})
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative bg-[#1D3557] text-white py-16 sm:py-24 overflow-hidden">
        {/* Subtle geometric pattern overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-400/30 text-amber-300 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>India&rsquo;s Dedicated Stationery Store</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6">
                WRITE. CREATE. <br />
                <span className="text-amber-400">ORGANIZE.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-200 max-w-xl mx-auto lg:mx-0 mb-8 font-light leading-relaxed">
                Everything for your study desk, college lectures, exam prep, and creative workspace. Premium journals, smooth gel pens, and curated academic kits.
              </p>

              {/* Call to Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 mb-10">
                <Link
                  href="/shop"
                  className="w-full sm:w-auto px-7 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-2xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                >
                  <span>Shop All Stationery</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="#kit-builder"
                  className="w-full sm:w-auto px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-xs uppercase tracking-wider transition-all border border-white/15 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Build Custom Kit</span>
                </Link>
              </div>

              {/* Value Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 text-left">
                <div>
                  <p className="text-lg font-black text-amber-400">₹499+</p>
                  <p className="text-xs text-slate-300">Free Doorstep Delivery</p>
                </div>
                <div>
                  <p className="text-lg font-black text-amber-400">100%</p>
                  <p className="text-xs text-slate-300">Genuine Brand Quality</p>
                </div>
                <div>
                  <p className="text-lg font-black text-amber-400">15% Off</p>
                  <p className="text-xs text-slate-300">With Code STUDENT15</p>
                </div>
              </div>
            </div>

            {/* Right Stationery Visual Merchandising Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-gradient-to-tr from-white/10 to-white/5 p-4 rounded-3xl backdrop-blur-md border border-white/15 shadow-2xl">
                <img
                  src="/images/hero-stationery.svg"
                  alt="Stationery flatlay essentials"
                  className="w-full h-80 object-cover rounded-2xl shadow-inner"
                  onError={(e) => {
                    e.currentTarget.src = '/images/products/stationery-placeholder.svg';
                  }}
                />

                {/* Floating promo badge 1 */}
                <div className="absolute -bottom-4 -left-4 bg-white text-slate-900 p-3 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
                    ✨
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Exam Kit Ready</p>
                    <p className="text-[11px] text-slate-500">Hall-approved combos</p>
                  </div>
                </div>

                {/* Floating promo badge 2 */}
                <div className="absolute -top-3 -right-3 bg-slate-900 text-white px-3 py-1.5 rounded-xl shadow-xl border border-slate-700 text-xs font-bold flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>ITC Classmate & DOMS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Smart Shopping Sections: Shop by Category */}
      <section className="py-16 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block mb-1">
                Explore Categories
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D3557]">
                Shop by Stationery Category
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 group"
            >
              <span>View All ({categories.length})</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className="group relative bg-white rounded-2xl p-4 border border-slate-100 hover:border-amber-300 shadow-xs hover:shadow-md transition-all text-center flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-2xl overflow-hidden mb-3 bg-slate-50 border border-slate-100 group-hover:scale-105 transition-transform p-1 flex items-center justify-center">
                  <img
                    src={cat.image || `/images/categories/${cat.slug}.svg`}
                    alt={cat.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = `/images/categories/${cat.slug}.svg`;
                    }}
                  />
                </div>
                <h3 className="font-bold text-xs text-slate-900 group-hover:text-amber-600 transition-colors leading-tight mb-1">
                  {cat.name}
                </h3>
                <span className="text-[10px] text-slate-400 font-medium">
                  {cat.itemCount} items
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Quick Shop Collections */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block mb-1">
              Curated Highlights
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D3557]">
              Quick Shop Collections
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Everything students and professionals need, hand-grouped for speed.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Back to School',
                desc: 'Notebooks, geometry boxes, compasses & sharpeners.',
                tag: 'Student Favorite',
                link: '/shop?purpose=School',
                image: '/images/categories/school-essentials.svg',
              },
              {
                title: 'Exam Ready Prep',
                desc: 'Clear pouches, blue/black ball pens & rulers.',
                tag: 'Hall Approved',
                link: '/shop?purpose=Exam',
                image: '/images/categories/exam-essentials.svg',
              },
              {
                title: 'Study Desk Aesthetic',
                desc: 'Metal mesh organizers, pastel note cubes & pen stands.',
                tag: 'Desk Goals',
                link: '/shop?purpose=Study%20Desk',
                image: '/images/categories/desk-organizers.svg',
              },
              {
                title: 'Creative Corner',
                desc: 'Watercolours, graphite shading pencils & sketchbooks.',
                tag: 'Art Supplies',
                link: '/shop?category=art-supplies',
                image: '/images/categories/art-supplies.svg',
              },
              {
                title: 'Office Workplace Essentials',
                desc: 'Staplers, punch machines, files & Copier A4 paper.',
                tag: 'Executive',
                link: '/shop?purpose=Office',
                image: '/images/categories/office-supplies.svg',
              },
              {
                title: 'Journaling & Planners',
                desc: '100 GSM ivory journals, pastel highlighters & stickers.',
                tag: 'Mindfulness',
                link: '/shop?purpose=Journaling',
                image: '/images/categories/planners-journals.svg',
              },
            ].map((col) => (
              <Link
                key={col.title}
                href={col.link}
                className="group relative h-64 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-end p-6 border border-slate-100"
              >
                {/* Background image */}
                <img
                  src={col.image}
                  alt={col.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90 group-hover:brightness-75"
                  onError={(e) => {
                    e.currentTarget.src = '/images/products/stationery-placeholder.svg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

                <div className="relative z-10">
                  <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-slate-950 uppercase tracking-wider mb-2">
                    {col.tag}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-amber-300 transition-colors">
                    {col.title}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2 mb-3">
                    {col.desc}
                  </p>
                  <span className="text-xs font-bold text-white inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Explore Collection</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Bestsellers Section */}
      <section className="py-16 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block mb-1">
                Top Rated by Students
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D3557]">
                Best Sellers
              </h2>
            </div>
            <Link
              href="/shop?filter=bestseller"
              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 group"
            >
              <span>View All Bestsellers</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestsellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 10. Flash Deals with Live Countdown */}
      <FlashDealsCountdown products={products} />

      {/* 11. UNIQUE FEATURE: Build Your Own Stationery Kit */}
      <BuildStationeryKit products={products} />

      {/* 12. UNIQUE FEATURE: Shop By Purpose */}
      <ShopByPurpose products={products} />

      {/* 9. New Arrivals Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block mb-1">
                Just Landed
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D3557]">
                New Arrivals
              </h2>
            </div>
            <Link
              href="/shop?filter=new"
              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 group"
            >
              <span>View All New Additions</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 66. UNIQUE FEATURE: Stationery Finder Questionnaire */}
      <StationeryFinder products={products} />

      {/* Institutional / Bulk Order Callout Banner */}
      <section className="py-12 bg-[#1D3557] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-amber-600/20 to-transparent p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                Institutional Quotations
              </span>
              <h3 className="text-2xl font-black mt-2">
                Need Bulk Stationery for Schools, Colleges or Companies?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                Get tiered institutional volume pricing, GST invoices, and dedicated relationship manager for school reopening kits or corporate orders.
              </p>
            </div>

            <Link
              href="/bulk-orders"
              className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-2xl text-xs uppercase tracking-wider whitespace-nowrap transition-colors shrink-0 shadow-lg"
            >
              Request Bulk Quotation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
