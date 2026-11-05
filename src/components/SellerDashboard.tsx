import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { CATEGORIES } from '../data/mockData';
import {
  Store,
  Plus,
  Package,
  TrendingUp,
  Trash2,
  X,
  Truck,
  CheckCircle2,
  Upload,
  Image as ImageIcon,
  Database,
} from 'lucide-react';

export default function SellerDashboard() {
  const {
    products,
    addProduct,
    deleteProduct,
    uploadProductImage,
    orders,
    updateOrderStatus,
    formatNaira,
    addToast,
    switchRole,
    user,
  } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // New product form fields
  const [newTitle, setNewTitle] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const [newCategory, setNewCategory] = useState(CATEGORIES[0].slug);
  const [newPrice, setNewPrice] = useState('');
  const [newOriginalPrice, setNewOriginalPrice] = useState('');
  const [newStock, setNewStock] = useState('10');
  const [newIsExpress, setNewIsExpress] = useState(true);
  const [newDescription, setNewDescription] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('/src/assets/images/product_smartphone_flagship_1793832690808.jpg');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const downloadUrl = await uploadProductImage(file);
      setNewImageUrl(downloadUrl);
    } catch (err: any) {
      addToast('Storage upload failed: ' + (err?.message || 'Check storage rules'), 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrice.trim()) return;

    const priceNum = Number(newPrice);
    const origPriceNum = newOriginalPrice ? Number(newOriginalPrice) : priceNum * 1.25;
    const discount = Math.max(0, Math.round(((origPriceNum - priceNum) / origPriceNum) * 100));

    const product: Product = {
      id: 'jum-prod-' + Date.now(),
      title: newTitle,
      brand: newBrand || 'Jumia Merchant',
      category: newCategory,
      price: priceNum,
      originalPrice: origPriceNum,
      discountPercent: discount,
      rating: 5.0,
      ratingCount: 1,
      image: newImageUrl,
      isJumiaExpress: newIsExpress,
      isOfficialStore: false,
      inStock: true,
      stockCount: Number(newStock) || 10,
      description: newDescription || 'Genuine high-performance product with full official warranty on Jumia Nigeria.',
      features: ['Genuine manufacturer grade', 'Tested and verified by Jumia quality team'],
      specifications: { Condition: 'Brand New', Warranty: '12 Months' },
      sellerId: user.id,
      seller: {
        name: user.name || 'My Jumia Store',
        score: 95,
        joinDate: 'Nov 2026',
        verified: true,
        fulfillmentRate: 98,
      },
      reviews: [],
    };

    await addProduct(product);
    setIsAddModalOpen(false);

    // Reset form
    setNewTitle('');
    setNewBrand('');
    setNewPrice('');
    setNewOriginalPrice('');
    setNewDescription('');
  };

  const handleDeleteProduct = async (productId: string) => {
    await deleteProduct(productId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Seller Portal Header */}
      <div className="bg-[#282828] text-white p-6 rounded-lg mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-[#f68b1e] text-white flex items-center justify-center font-black">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight">JUMIA Seller Center</h1>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                Active Merchant
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Synced with Cloud Firestore and Firebase Storage
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 bg-black/40 text-[11px] font-mono text-gray-300 px-3 py-1.5 rounded border border-gray-700">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>jumia-34b8b</span>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-[#f68b1e] hover:bg-[#e07b14] text-white font-bold text-xs rounded uppercase flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
          <button
            onClick={() => switchRole('customer')}
            className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-xs font-semibold rounded text-gray-200"
          >
            View as Customer
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-2xs">
          <span className="text-xs text-gray-500 font-medium">Total Store Revenue</span>
          <p className="text-xl font-extrabold text-gray-900 mt-1 tabular-nums">
            {formatNaira(3850000)}
          </p>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-1">
            <TrendingUp className="w-3 h-3" /> +18.4% vs last month
          </span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-2xs">
          <span className="text-xs text-gray-500 font-medium">Orders to Fulfill</span>
          <p className="text-xl font-extrabold text-[#f68b1e] mt-1 tabular-nums">
            {orders.length}
          </p>
          <span className="text-[10px] text-gray-400 mt-1 block">Jumia Express dispatch queue</span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-2xs">
          <span className="text-xs text-gray-500 font-medium">Products in Firestore</span>
          <p className="text-xl font-extrabold text-gray-900 mt-1 tabular-nums">
            {products.length}
          </p>
          <span className="text-[10px] text-emerald-600 font-bold mt-1 block">Live & Synced</span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-2xs">
          <span className="text-xs text-gray-500 font-medium">Seller Quality Score</span>
          <p className="text-xl font-extrabold text-emerald-600 mt-1 tabular-nums">
            96%
          </p>
          <span className="text-[10px] text-gray-400 mt-1 block">Eligible for Jumia Gold Badge</span>
        </div>
      </div>

      {/* Product Catalog Inventory Table */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5 mb-8">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
          <div>
            <h2 className="text-sm font-bold text-gray-900 uppercase">
              Product Inventory & Pricing
            </h2>
            <p className="text-xs text-gray-400">Stored in Cloud Firestore `products` collection</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="text-xs font-bold text-[#f68b1e] hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase font-semibold">
              <tr>
                <th className="p-3">Product</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Jumia Express</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {products.map((prod) => (
                <tr key={prod.id} className="hover:bg-gray-50/70">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.image}
                        alt=""
                        className="w-10 h-10 object-contain rounded bg-gray-50 p-1"
                        referrerPolicy="no-referrer"
                      />
                      <div className="max-w-xs">
                        <p className="font-semibold text-gray-900 truncate">{prod.title}</p>
                        <p className="text-[10px] text-gray-400">{prod.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 capitalize">{prod.category.replace('-', ' ')}</td>
                  <td className="p-3 font-bold text-gray-900 tabular-nums">
                    {formatNaira(prod.price)}
                  </td>
                  <td className="p-3">
                    <span className="font-semibold text-emerald-700">{prod.stockCount} in stock</span>
                  </td>
                  <td className="p-3">
                    {prod.isJumiaExpress ? (
                      <span className="bg-[#0b4c8c] text-white text-[9px] font-black px-1.5 py-0.5 rounded">
                        EXPRESS
                      </span>
                    ) : (
                      <span className="text-gray-400">Standard</span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleDeleteProduct(prod.id)}
                      className="p-1 text-gray-400 hover:text-red-600 rounded"
                      title="Remove product from Firestore"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Orders Fulfillment Board */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5">
        <h2 className="text-sm font-bold text-gray-900 uppercase pb-3 border-b border-gray-100 mb-4">
          Order Fulfillment Queue (Cloud Firestore)
        </h2>

        <div className="space-y-3">
          {orders.map((ord) => (
            <div key={ord.id} className="p-4 border border-gray-100 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-gray-900">{ord.id}</span>
                  <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold uppercase">
                    {ord.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Recipient: {ord.deliveryAddress.fullName} · {ord.deliveryAddress.cityLGA}, {ord.deliveryAddress.state}
                </p>
                <p className="text-xs font-bold text-gray-800 mt-0.5">
                  Total: {formatNaira(ord.total)} ({ord.items.length} items)
                </p>
              </div>

              {/* Status Updater Action */}
              <div className="flex items-center gap-2">
                {ord.status !== 'shipped' && ord.status !== 'delivered' && (
                  <button
                    onClick={() => updateOrderStatus(ord.id, 'shipped')}
                    className="px-3 py-1.5 bg-[#0b4c8c] hover:bg-blue-900 text-white text-xs font-bold rounded uppercase flex items-center gap-1"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Dispatch to Jumia Hub</span>
                  </button>
                )}
                {ord.status === 'shipped' && (
                  <button
                    onClick={() => updateOrderStatus(ord.id, 'delivered')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded uppercase flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark as Delivered</span>
                  </button>
                )}
                {ord.status === 'delivered' && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Delivered & Paid
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Product Modal with Firebase Storage Image Upload */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase">
                Add New Product to JUMIA (Firestore & Storage)
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Product Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Samsung Galaxy S24 Ultra 256GB Titanium"
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-[#f68b1e]"
                  required
                />
              </div>

              {/* Product Photo: Upload to Firebase Storage or Paste URL */}
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Product Image (Firebase Storage)
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-gray-50 border rounded flex items-center justify-center overflow-hidden shrink-0">
                    {newImageUrl ? (
                      <img src={newImageUrl} alt="preview" className="w-full h-full object-contain" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5 text-[#f68b1e]" />
                      <span>{isUploading ? 'Uploading to Storage...' : 'Upload Image to Storage'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        disabled={isUploading}
                      />
                    </label>
                    <input
                      type="text"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="Or enter image URL"
                      className="w-full mt-1.5 border border-gray-300 rounded p-1.5 text-[11px]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Brand</label>
                  <input
                    type="text"
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    placeholder="e.g. Samsung"
                    className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-[#f68b1e]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-[#f68b1e]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Price (₦)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="e.g. 150000"
                    className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-[#f68b1e]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Original Price (₦)</label>
                  <input
                    type="number"
                    value={newOriginalPrice}
                    onChange={(e) => setNewOriginalPrice(e.target.value)}
                    placeholder="e.g. 200000"
                    className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-[#f68b1e]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Stock Count</label>
                  <input
                    type="number"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-[#f68b1e]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={newIsExpress}
                    onChange={(e) => setNewIsExpress(e.target.checked)}
                    className="w-4 h-4 text-[#f68b1e]"
                  />
                  <span>Enroll in Jumia Express (Stored at Ikeja fulfillment hub)</span>
                </label>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Description</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={3}
                  placeholder="Key highlights and product details..."
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-[#f68b1e]"
                />
              </div>

              <div className="pt-3 flex gap-2 justify-end border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-600 rounded text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2 bg-[#f68b1e] hover:bg-[#e07b14] disabled:opacity-50 text-white text-xs font-bold rounded uppercase shadow-sm"
                >
                  Publish to Cloud Firestore
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
