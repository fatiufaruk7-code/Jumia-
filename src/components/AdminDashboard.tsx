import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  TrendingUp,
  Users,
  Package,
  ShoppingBag,
  Zap,
  Trash2,
  RefreshCw,
  Database,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { INITIAL_PRODUCTS } from '../data/mockData';

export default function AdminDashboard() {
  const {
    products,
    updateProduct,
    deleteProduct,
    orders,
    formatNaira,
    addToast,
    switchRole,
    user,
    setCurrentView,
    setIsAuthModalOpen,
    setAuthModalTab,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'catalog' | 'flash-sales' | 'orders'>('overview');

  // Strict Role-Based Access Control Safeguard: Never allow customers to access admin functions
  if (user.role !== 'admin' && user.email !== 'fatiufaruk7@gmail.com') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-white p-8 rounded-xl border border-red-200 shadow-sm max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Access Restricted</h2>
          <p className="text-xs text-gray-500 mt-2">
            The JUMIA Admin Portal requires Administrator privileges. Customer accounts cannot access administrative functions.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <button
              onClick={() => setCurrentView('home')}
              className="w-full py-2.5 bg-[#f68b1e] hover:bg-[#e07b14] text-white text-xs font-bold rounded uppercase tracking-wider"
            >
              Return to JUMIA Store
            </button>
            <button
              onClick={() => {
                setAuthModalTab('login');
                setIsAuthModalOpen(true);
              }}
              className="w-full py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded"
            >
              Sign In with Admin Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalGMV = orders.reduce((acc, o) => acc + o.total, 48250000);
  const flashSaleItems = products.filter((p) => p.isFlashSale);

  const toggleProductFlashSale = async (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;
    const nextState = !prod.isFlashSale;
    await updateProduct(productId, {
      isFlashSale: nextState,
      flashSaleRemaining: nextState ? 10 : undefined,
      flashSaleTotal: nextState ? 20 : undefined,
    });
  };

  const toggleOfficialStore = async (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;
    await updateProduct(productId, { isOfficialStore: !prod.isOfficialStore });
  };

  const handleDelete = async (productId: string) => {
    await deleteProduct(productId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-[#111827] text-white p-6 rounded-lg mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-purple-600 text-white flex items-center justify-center font-black">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight">JUMIA Admin Portal</h1>
              <span className="bg-purple-500/20 text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded border border-purple-500/30">
                Super Admin
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Nigeria Platform Operations, Catalog Control & Real-time Firestore Sync
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 bg-black/40 text-[11px] font-mono text-gray-300 px-3 py-1.5 rounded border border-gray-700">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Firebase: jumia-34b8b</span>
          </div>
          <button
            onClick={() => switchRole('customer')}
            className="px-4 py-2 bg-[#f68b1e] hover:bg-[#e07b14] text-xs font-bold rounded text-white uppercase tracking-wider"
          >
            Return to Store
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-2xs">
          <div className="flex justify-between items-center text-gray-500 text-xs font-medium">
            <span>Total Platform GMV</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-extrabold text-gray-900 mt-2 tabular-nums">
            {formatNaira(totalGMV)}
          </p>
          <p className="text-[10px] text-emerald-600 font-bold mt-1">+24.8% growth YOY</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-2xs">
          <div className="flex justify-between items-center text-gray-500 text-xs font-medium">
            <span>Customer Orders (Firestore)</span>
            <ShoppingBag className="w-4 h-4 text-[#f68b1e]" />
          </div>
          <p className="text-xl font-extrabold text-gray-900 mt-2 tabular-nums">
            {orders.length}
          </p>
          <p className="text-[10px] text-gray-400 mt-1">98.2% Jumia Express on-time</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-2xs">
          <div className="flex justify-between items-center text-gray-500 text-xs font-medium">
            <span>Verified Merchants</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-xl font-extrabold text-gray-900 mt-2 tabular-nums">
            185
          </p>
          <p className="text-[10px] text-gray-400 mt-1">Lagos, Abuja, Port Harcourt</p>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-2xs">
          <div className="flex justify-between items-center text-gray-500 text-xs font-medium">
            <span>Catalog Items in Firestore</span>
            <Package className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xl font-extrabold text-gray-900 mt-2 tabular-nums">
            {products.length}
          </p>
          <p className="text-[10px] text-emerald-600 font-bold mt-1">All Live & Synced</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 gap-6 text-xs font-bold uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'overview'
              ? 'border-[#f68b1e] text-[#f68b1e]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          Catalog Control & Moderation
        </button>
        <button
          onClick={() => setActiveTab('flash-sales')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1 ${
            activeTab === 'flash-sales'
              ? 'border-[#f68b1e] text-[#f68b1e]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Flash Sale Campaign ({flashSaleItems.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'orders'
              ? 'border-[#f68b1e] text-[#f68b1e]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          Firestore Orders ({orders.length})
        </button>
      </div>

      {/* Tab: Catalog Moderation */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase font-semibold">
                <tr>
                  <th className="p-3">Product Title</th>
                  <th className="p-3">Brand</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Discount</th>
                  <th className="p-3">Official Store</th>
                  <th className="p-3">Flash Sale</th>
                  <th className="p-3 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-900 max-w-xs truncate">
                      {p.title}
                    </td>
                    <td className="p-3">{p.brand}</td>
                    <td className="p-3 font-bold text-gray-900 tabular-nums">{formatNaira(p.price)}</td>
                    <td className="p-3">
                      <span className="text-orange-600 font-bold">-{p.discountPercent}%</span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => toggleOfficialStore(p.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.isOfficialStore
                            ? 'bg-blue-100 text-[#0b4c8c]'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {p.isOfficialStore ? 'Verified Official' : 'Standard'}
                      </button>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => toggleProductFlashSale(p.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                          p.isFlashSale
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        <Zap className="w-3 h-3" />
                        <span>{p.isFlashSale ? 'Active' : 'Disabled'}</span>
                      </button>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded"
                        title="Delete product from Cloud Firestore"
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
      )}

      {/* Tab: Flash Sales */}
      {activeTab === 'flash-sales' && (
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase">
                Active Flash Sale Products in Cloud Firestore
              </h3>
              <p className="text-xs text-gray-400">Items featured in the homepage red flash banner with live countdown</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {flashSaleItems.map((p) => (
              <div key={p.id} className="p-3 border rounded-lg border-orange-200 bg-orange-50/20 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded">
                      -{p.discountPercent}% FLASH
                    </span>
                    <span className="text-xs font-bold text-[#f68b1e]">
                      {p.flashSaleRemaining} left of {p.flashSaleTotal}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-gray-900 mt-2 line-clamp-1">{p.title}</h4>
                  <p className="text-sm font-extrabold text-gray-900 mt-1">{formatNaira(p.price)}</p>
                </div>

                <button
                  onClick={() => toggleProductFlashSale(p.id)}
                  className="mt-3 w-full py-1 text-xs text-red-600 hover:bg-red-50 border border-red-200 rounded font-bold"
                >
                  Remove from Flash Sale
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Recent Orders */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase font-semibold">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="p-3 font-bold text-gray-900">{o.id}</td>
                    <td className="p-3">{o.date}</td>
                    <td className="p-3">{o.deliveryAddress.fullName}</td>
                    <td className="p-3">{o.deliveryAddress.cityLGA}, {o.deliveryAddress.state}</td>
                    <td className="p-3 uppercase">{o.paymentMethod}</td>
                    <td className="p-3 font-extrabold text-gray-900 tabular-nums">{formatNaira(o.total)}</td>
                    <td className="p-3">
                      <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
