'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Product, Category, Brand } from '@/lib/types';
import { ProductCard } from '@/components/ProductCard';
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List as ListIcon,
  X,
  Star,
  Check,
  ChevronDown,
  Sparkles,
  RefreshCcw,
} from 'lucide-react';

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filters State
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [brand, setBrand] = useState(searchParams.get('brand') || 'all');
  const [purpose, setPurpose] = useState(searchParams.get('purpose') || 'all');
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [minRating, setMinRating] = useState<number | undefined>(undefined);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [writingType, setWritingType] = useState<string | undefined>(undefined);
  const [paperGsm, setPaperGsm] = useState<number | undefined>(undefined);
  const [sort, setSort] = useState<string>('featured');

  // Load Categories & Brands
  useEffect(() => {
    async function loadMeta() {
      try {
        const [catRes, brandRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/brands'),
        ]);
        const catData = await catRes.json();
        const brandData = await brandRes.json();
        setCategories(catData || []);
        setBrands(brandData || []);
      } catch (e) {
        console.error(e);
      }
    }
    loadMeta();
  }, []);

  // Update URL and fetch products when filters change
  useEffect(() => {
    async function fetchFilteredProducts() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (category && category !== 'all') params.set('category', category);
        if (brand && brand !== 'all') params.set('brand', brand);
        if (purpose && purpose !== 'all') params.set('purpose', purpose);
        if (minPrice !== undefined) params.set('minPrice', String(minPrice));
        if (maxPrice !== undefined) params.set('maxPrice', String(maxPrice));
        if (minRating !== undefined) params.set('rating', String(minRating));
        if (inStockOnly) params.set('inStockOnly', 'true');
        if (writingType) params.set('writingType', writingType);
        if (paperGsm) params.set('paperGsm', String(paperGsm));
        if (sort) params.set('sort', sort);

        const res = await fetch(`/api/products?${params.toString()}`);
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error('Error fetching filtered products:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchFilteredProducts();
  }, [
    search,
    category,
    brand,
    purpose,
    minPrice,
    maxPrice,
    minRating,
    inStockOnly,
    writingType,
    paperGsm,
    sort,
  ]);

  const clearAllFilters = () => {
    setSearch('');
    setCategory('all');
    setBrand('all');
    setPurpose('all');
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setMinRating(undefined);
    setInStockOnly(false);
    setWritingType(undefined);
    setPaperGsm(undefined);
    setSort('featured');
    router.push('/shop');
  };

  const activeFiltersCount = [
    category !== 'all',
    brand !== 'all',
    purpose !== 'all',
    minPrice !== undefined,
    maxPrice !== undefined,
    minRating !== undefined,
    inStockOnly,
    writingType !== undefined,
    paperGsm !== undefined,
  ].filter(Boolean).length;

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="mb-6">
          <nav className="text-xs text-slate-500 mb-2 flex items-center gap-1.5 font-medium">
            <span onClick={() => router.push('/')} className="hover:text-amber-600 cursor-pointer">
              Home
            </span>
            <span>/</span>
            <span className="text-slate-800 font-bold">Shop</span>
            {category !== 'all' && (
              <>
                <span>/</span>
                <span className="capitalize text-amber-700">{category.replace('-', ' ')}</span>
              </>
            )}
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1D3557] tracking-tight">
                All Stationery Catalogue
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Showing <strong className="text-slate-800">{products.length}</strong> stationery products
              </p>
            </div>

            {/* Mobile filter toggle & view toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-xs"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" />
                <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
              </button>

              {/* Grid / List View Toggle */}
              <div className="flex items-center border border-slate-200 bg-white rounded-xl p-0.5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="List View"
                >
                  <ListIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Sorting Selector */}
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-amber-500 shadow-xs appearance-none cursor-pointer"
                >
                  <option value="featured">Sort by: Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest Arrivals</option>
                  <option value="discount">Biggest Discount</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Active Filter Chips Bar */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
              Active Filters:
            </span>

            {category !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200">
                Category: {category}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setCategory('all')} />
              </span>
            )}

            {brand !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-900 border border-blue-200">
                Brand: {brand}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setBrand('all')} />
              </span>
            )}

            {purpose !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-900 border border-purple-200">
                Purpose: {purpose}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setPurpose('all')} />
              </span>
            )}

            {inStockOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200">
                In Stock Only
                <X className="w-3 h-3 cursor-pointer" onClick={() => setInStockOnly(false)} />
              </span>
            )}

            {writingType && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                Type: {writingType}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setWritingType(undefined)} />
              </span>
            )}

            {paperGsm && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                Paper: {paperGsm} GSM
                <X className="w-3 h-3 cursor-pointer" onClick={() => setPaperGsm(undefined)} />
              </span>
            )}

            <button
              onClick={clearAllFilters}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 ml-auto flex items-center gap-1"
            >
              <RefreshCcw className="w-3 h-3" />
              <span>Reset All</span>
            </button>
          </div>
        )}

        {/* Main Content Layout: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6 sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-amber-600" />
                <span>Filters</span>
              </h3>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs font-semibold text-rose-600 hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Keyword Search within Catalogue */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Search Products
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="e.g. blue gel pen..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-amber-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Category
              </label>
              <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                <button
                  onClick={() => setCategory('all')}
                  className={`w-full text-left text-xs py-1 px-2 rounded-lg transition-colors flex items-center justify-between ${
                    category === 'all'
                      ? 'bg-amber-50 text-amber-900 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>All Categories</span>
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCategory(c.slug)}
                    className={`w-full text-left text-xs py-1 px-2 rounded-lg transition-colors flex items-center justify-between ${
                      category === c.slug
                        ? 'bg-amber-50 text-amber-900 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="text-[10px] text-slate-400">({c.itemCount})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Brand
              </label>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                <button
                  onClick={() => setBrand('all')}
                  className={`w-full text-left text-xs py-1 px-2 rounded-lg transition-colors ${
                    brand === 'all'
                      ? 'bg-amber-50 text-amber-900 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  All Brands
                </button>
                {brands.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setBrand(b.slug)}
                    className={`w-full text-left text-xs py-1 px-2 rounded-lg transition-colors flex items-center justify-between ${
                      brand === b.slug
                        ? 'bg-amber-50 text-amber-900 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{b.name}</span>
                    <span className="text-[10px] text-slate-400">({b.productCount})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Purpose Filter */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Purpose
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['School', 'College', 'Exam', 'Office', 'Art', 'Drawing', 'Journaling', 'Study Desk'].map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setPurpose(purpose === p ? 'all' : p)}
                      className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
                        purpose === p
                          ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold shadow-xs'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Price (₹)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min ₹"
                  value={minPrice !== undefined ? minPrice : ''}
                  onChange={(e) =>
                    setMinPrice(e.target.value ? Number(e.target.value) : undefined)
                  }
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
                <input
                  type="number"
                  placeholder="Max ₹"
                  value={maxPrice !== undefined ? maxPrice : ''}
                  onChange={(e) =>
                    setMaxPrice(e.target.value ? Number(e.target.value) : undefined)
                  }
                  className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            {/* Stationery Specific Specs: GSM & Writing Type */}
            <div className="pt-2 border-t border-slate-100 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Paper GSM (Notebooks)
                </label>
                <div className="flex gap-2">
                  {[70, 75, 80, 100].map((gsm) => (
                    <button
                      key={gsm}
                      onClick={() => setPaperGsm(paperGsm === gsm ? undefined : gsm)}
                      className={`px-2 py-1 text-xs rounded-lg border transition-all ${
                        paperGsm === gsm
                          ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {gsm} GSM
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Writing / Ink Type
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {['Ball', 'Gel', 'Rollerball', 'Fountain', 'Highlighter'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setWritingType(writingType === type ? undefined : type)}
                      className={`px-2 py-1 text-xs rounded-lg border transition-all ${
                        writingType === type
                          ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* In Stock Toggle */}
            <div className="pt-2 border-t border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span>Exclude Out-of-Stock Items</span>
              </label>
            </div>
          </aside>

          {/* Product Listing Grid / List */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100 animate-pulse">
                    <div className="aspect-square bg-slate-100 rounded-xl mb-4" />
                    <div className="h-4 bg-slate-100 rounded w-1/3 mb-2" />
                    <div className="h-4 bg-slate-100 rounded w-3/4 mb-3" />
                    <div className="h-6 bg-slate-100 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs">
                <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl mx-auto mb-4">
                  🔍
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  No stationery matched your criteria
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                  Try clearing some filters, widening your price range, or searching for broader terms like &ldquo;pen&rdquo; or &ldquo;notebook&rdquo;.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              /* List View Mode */
              <div className="space-y-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl border border-slate-100 p-4 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row gap-4 items-center"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-28 h-28 object-cover rounded-xl border border-slate-100 shrink-0"
                      onError={(e) => {
                        e.currentTarget.src = '/images/products/stationery-placeholder.svg';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-[10px] text-amber-700 font-bold uppercase tracking-wider mb-1">
                        <span>{product.brand}</span>
                        <span>·</span>
                        <span>{product.category}</span>
                      </div>
                      <h3 className="font-bold text-sm text-slate-900 hover:text-amber-600 transition-colors">
                        <span onClick={() => router.push(`/product/${product.slug}`)} className="cursor-pointer">
                          {product.name}
                        </span>
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                        {product.description}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-amber-500 mt-2">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="font-bold text-slate-800">{product.rating}</span>
                        <span className="text-slate-400 text-[11px]">({product.reviewCount} reviews)</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0 sm:border-l sm:border-slate-100 sm:pl-6 flex flex-col justify-between h-full">
                      <div>
                        <div className="flex items-baseline gap-1.5 justify-end">
                          <span className="text-xl font-black text-slate-950">₹{product.price}</span>
                          {product.mrp > product.price && (
                            <span className="text-xs text-slate-400 line-through">₹{product.mrp}</span>
                          )}
                        </div>
                        <span className="text-[10px] text-emerald-600 font-semibold block">
                          Save ₹{product.mrp - product.price}
                        </span>
                      </div>

                      <button
                        onClick={() => router.push(`/product/${product.slug}`)}
                        className="mt-4 px-4 py-2 bg-slate-900 hover:bg-amber-600 text-white font-bold rounded-xl text-xs transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading shop catalogue...</div>}>
      <ShopContent />
    </Suspense>
  );
}
