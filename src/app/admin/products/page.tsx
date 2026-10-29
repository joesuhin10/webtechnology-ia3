'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/cart-context';
import {
  Package,
  Plus,
  Search,
  Upload,
  Download,
  Edit,
  Trash2,
  X,
  Check,
  Star,
  ExternalLink,
} from 'lucide-react';

export default function AdminProductsPage() {
  const { addToast } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    brand: 'Classmate',
    category: 'Writing Instruments',
    price: 99,
    mrp: 120,
    stock: 50,
    sku: 'NOTE-CLS-NEW-01',
    description: 'High quality stationery item for students and offices.',
    image: 'https://images.unsplash.com/photo-1585336261026-407137f61fc7?w=700',
  });

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products?limit=100');
      const data = await res.json();
      setProducts(data.products || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      brand: 'Classmate',
      category: 'Writing Instruments',
      price: 99,
      mrp: 120,
      stock: 50,
      sku: `PROD-${Date.now().toString(36).toUpperCase()}`,
      description: 'High quality stationery item for students and offices.',
      image: 'https://images.unsplash.com/photo-1585336261026-407137f61fc7?w=700',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      brand: p.brand,
      category: p.category,
      price: p.price,
      mrp: p.mrp,
      stock: p.stock,
      sku: p.sku,
      description: p.description,
      image: p.images?.[0] || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product from the database?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        addToast('Product Deleted', 'Item removed from catalogue and store.', 'info');
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        // Edit existing
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            brand: formData.brand,
            category: formData.category,
            price: Number(formData.price),
            mrp: Number(formData.mrp),
            stock: Number(formData.stock),
            sku: formData.sku,
            description: formData.description,
            images: [formData.image],
          }),
        });

        if (res.ok) {
          const updated = await res.json();
          addToast('Product Updated! ✅', `${updated.name} updated.`, 'success');
          setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
          setIsModalOpen(false);
        }
      } else {
        // Create new
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            brand: formData.brand,
            brandId: `brand-${formData.brand.toLowerCase()}`,
            category: formData.category,
            categoryId: 'cat-writing',
            subcategory: 'Pens',
            price: Number(formData.price),
            mrp: Number(formData.mrp),
            discountPercentage: Math.round(((formData.mrp - formData.price) / formData.mrp) * 100),
            taxPercentage: 12,
            stock: Number(formData.stock),
            lowStockThreshold: 10,
            images: [formData.image],
            sku: formData.sku,
            barcode: `${Date.now()}`,
            description: formData.description,
            shortDescription: formData.description.slice(0, 80),
            rating: 4.8,
            reviewCount: 1,
            isNew: true,
            isBestseller: false,
            isFeatured: false,
            purposeTags: ['College', 'School', 'Office'],
            specifications: {},
            variants: [],
            status: 'active',
          }),
        });

        if (res.ok) {
          const created = await res.json();
          addToast('Product Created! 🎉', `${created.name} is now live in store.`, 'success');
          setProducts((prev) => [created, ...prev]);
          setIsModalOpen(false);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // CSV Import simulation
  const handleCsvImport = () => {
    const dummyProduct: Product = {
      id: `prod-csv-${Date.now()}`,
      name: 'Classmate Fine Grip 0.7mm Ball Pen (Imported CSV)',
      slug: `classmate-fine-grip-ball-pen-${Date.now()}`,
      sku: 'PEN-CLS-CSV-07',
      barcode: '8901030998823',
      brand: 'Classmate',
      brandId: 'brand-classmate',
      category: 'Writing Instruments',
      categoryId: 'cat-writing',
      subcategory: 'Ballpoint Pens',
      description: 'Bulk imported through CSV upload tool.',
      shortDescription: 'Imported via admin CSV portal.',
      price: 25,
      mrp: 30,
      discountPercentage: 17,
      taxPercentage: 12,
      stock: 200,
      lowStockThreshold: 20,
      images: ['https://images.unsplash.com/photo-1585336261026-407137f61fc7?w=700'],
      rating: 4.6,
      reviewCount: 12,
      isNew: true,
      isBestseller: false,
      isFeatured: false,
      purposeTags: ['School', 'College', 'Office'],
      specifications: {},
      variants: [],
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    setProducts((prev) => [dummyProduct, ...prev]);
    addToast('CSV Import Successful', 'Uploaded products from sample CSV into database.', 'success');
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#0F1115] text-slate-100 font-sans">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <Package className="w-6 h-6 text-amber-500" />
              <span>Products Management</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {products.length} stationery items catalogued in database
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCsvImport}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-colors"
              title="Upload CSV"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import CSV</span>
            </button>

            <a
              href="/api/admin/reports?type=inventory"
              download
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-colors"
              title="Download CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </a>

            <button
              onClick={openAddModal}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 transition-colors shadow-md"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 max-w-md">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products by title, brand, or SKU..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#1E232A] border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-[#1E232A] rounded-3xl border border-slate-800 shadow-md overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                <th className="p-4">Product</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Rating</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.map((p) => {
                const isLow = p.stock <= p.lowStockThreshold;
                return (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0] || '/images/products/stationery-placeholder.svg'}
                          alt={p.name}
                          className="w-10 h-10 object-cover rounded-lg border border-slate-700 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-white max-w-[200px] truncate">{p.name}</p>
                          <span className="text-[10px] text-amber-400 uppercase font-bold">
                            {p.brand}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-mono text-[11px] text-slate-400">{p.sku}</td>
                    <td className="p-4 text-slate-300">{p.category}</td>
                    <td className="p-4">
                      <span className="font-bold text-white">₹{p.price}</span>
                      {p.mrp > p.price && (
                        <span className="text-[10px] text-slate-500 line-through ml-1.5">
                          ₹{p.mrp}
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase ${
                          p.stock <= 0
                            ? 'bg-rose-950 text-rose-400'
                            : isLow
                            ? 'bg-amber-950 text-amber-400'
                            : 'bg-emerald-950 text-emerald-400'
                        }`}
                      >
                        {p.stock <= 0 ? 'Out of stock' : `${p.stock} units`}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1 text-amber-400 font-bold">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{p.rating}</span>
                      </div>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 text-slate-400 hover:text-amber-400 rounded-lg hover:bg-slate-800 transition-colors"
                          title="Edit Product"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Product Add / Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
            <div className="bg-[#1E232A] rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-slate-800 shadow-2xl overflow-y-auto max-h-[90vh]">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <h3 className="text-base font-bold text-white">
                  {editingProduct ? 'Edit Product' : 'Add New Stationery Product'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Classmate Pulse 6-Subject Spiral Notebook"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-white rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Brand</label>
                    <input
                      type="text"
                      required
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-white rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Category</label>
                    <input
                      type="text"
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-white rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Selling Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-white rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">MRP (₹)</label>
                    <input
                      type="number"
                      required
                      value={formData.mrp}
                      onChange={(e) => setFormData({ ...formData, mrp: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-white rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Stock Count</label>
                    <input
                      type="number"
                      required
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-white rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Product SKU</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-white rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Image URL</label>
                  <input
                    type="url"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-white rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-white rounded-xl"
                  />
                </div>

                <div className="flex gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black uppercase tracking-wider"
                  >
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
