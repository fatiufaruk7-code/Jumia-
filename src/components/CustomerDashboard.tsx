import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Package,
  Heart,
  Wallet,
  MapPin,
  User as UserIcon,
  Clock,
  CheckCircle2,
  ChevronRight,
  Plus,
  ArrowRight,
  ShoppingCart,
} from 'lucide-react';

export default function CustomerDashboard() {
  const {
    user,
    orders,
    products,
    formatNaira,
    addToCart,
    openProductDetail,
    setCurrentView,
    addToast,
    setUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'wallet' | 'addresses' | 'details'>('orders');
  const [walletDepositAmount, setWalletDepositAmount] = useState('10000');

  const wishlistProducts = products.filter((p) => user.savedItemIds.includes(p.id));

  const handleDepositWallet = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(walletDepositAmount);
    if (isNaN(amount) || amount <= 0) return;
    const updated = { ...user, walletBalance: user.walletBalance + amount };
    setUser(updated);
    addToast(`Successfully credited ${formatNaira(amount)} to Jumia Wallet!`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 mb-6 gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
            My JUMIA Account
          </h1>
          <p className="text-xs text-gray-500">
            Welcome back, <strong>{user.name}</strong> ({user.email})
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Navigation Tabs */}
        <aside className="md:col-span-3 bg-white rounded-lg border border-gray-100 shadow-sm p-3 self-start">
          <div className="space-y-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between p-2.5 rounded transition-colors ${
                activeTab === 'orders'
                  ? 'bg-orange-50 text-[#f68b1e]'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4" />
                <span>Orders</span>
              </div>
              <span className="text-[11px] bg-gray-100 px-1.5 py-0.5 rounded font-bold text-gray-600">
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('wishlist')}
              className={`w-full flex items-center justify-between p-2.5 rounded transition-colors ${
                activeTab === 'wishlist'
                  ? 'bg-orange-50 text-[#f68b1e]'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Heart className="w-4 h-4" />
                <span>Saved Items (Wishlist)</span>
              </div>
              <span className="text-[11px] bg-gray-100 px-1.5 py-0.5 rounded font-bold text-gray-600">
                {wishlistProducts.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('wallet')}
              className={`w-full flex items-center justify-between p-2.5 rounded transition-colors ${
                activeTab === 'wallet'
                  ? 'bg-orange-50 text-[#f68b1e]'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Wallet className="w-4 h-4" />
                <span>JUMIA Wallet</span>
              </div>
              <span className="text-[11px] text-emerald-600 font-extrabold">
                {formatNaira(user.walletBalance)}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center gap-2.5 p-2.5 rounded transition-colors ${
                activeTab === 'addresses'
                  ? 'bg-orange-50 text-[#f68b1e]'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Address Book</span>
            </button>

            <button
              onClick={() => setActiveTab('details')}
              className={`w-full flex items-center gap-2.5 p-2.5 rounded transition-colors ${
                activeTab === 'details'
                  ? 'bg-orange-50 text-[#f68b1e]'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span>Account Details</span>
            </button>
          </div>
        </aside>

        {/* Right Tab Content */}
        <div className="md:col-span-9 bg-white rounded-lg border border-gray-100 shadow-sm p-6">
          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                Order History
              </h2>

              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-xs text-gray-500">You have placed no orders yet.</p>
                  <button
                    onClick={() => setCurrentView('catalog')}
                    className="mt-3 px-4 py-2 bg-[#f68b1e] text-white text-xs font-bold rounded uppercase"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-orange-200 transition-colors"
                    >
                      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-gray-100 text-xs gap-2">
                        <div>
                          <span className="font-bold text-gray-900">{order.id}</span>
                          <span className="text-gray-400 ml-2">Placed on {order.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                              order.status === 'delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : order.status === 'shipped'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-orange-100 text-[#f68b1e]'
                            }`}
                          >
                            {order.status}
                          </span>
                          <span className="font-extrabold text-gray-900">{formatNaira(order.total)}</span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="py-3 divide-y divide-gray-50">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex items-center justify-between py-2 text-xs">
                            <div className="flex items-center gap-3">
                              <img
                                src={it.product.image}
                                alt=""
                                className="w-10 h-10 object-contain rounded bg-gray-50 p-1"
                              />
                              <div>
                                <p className="font-medium text-gray-800 line-clamp-1">{it.product.title}</p>
                                <p className="text-[10px] text-gray-400">Qty: {it.quantity}</p>
                              </div>
                            </div>
                            <span className="font-bold tabular-nums">
                              {formatNaira(it.product.price * it.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Tracking Footer */}
                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                        <span className="text-gray-500 text-[11px]">
                          Est. Delivery: {order.estimatedDelivery}
                        </span>
                        <button
                          onClick={() => {
                            order.items.forEach((it) => addToCart(it.product, it.quantity));
                            setCurrentView('cart');
                          }}
                          className="text-[#f68b1e] hover:underline font-bold"
                        >
                          Reorder Items
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* WISHLIST TAB */}
          {activeTab === 'wishlist' && (
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                Saved Items ({wishlistProducts.length})
              </h2>

              {wishlistProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-xs text-gray-500">Your wishlist is empty.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {wishlistProducts.map((product) => (
                    <div
                      key={product.id}
                      className="border border-gray-100 rounded-lg p-3 hover:shadow-md transition-shadow flex flex-col justify-between"
                    >
                      <div
                        onClick={() => openProductDetail(product)}
                        className="cursor-pointer"
                      >
                        <div className="w-full aspect-square bg-[#f9f9f9] rounded p-2 flex items-center justify-center mb-2">
                          <img
                            src={product.image}
                            alt=""
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <h4 className="text-xs font-semibold text-gray-800 line-clamp-2">
                          {product.title}
                        </h4>
                        <p className="text-sm font-bold text-gray-900 mt-1 tabular-nums">
                          {formatNaira(product.price)}
                        </p>
                      </div>

                      <button
                        onClick={() => addToCart(product, 1)}
                        className="mt-3 w-full py-1.5 bg-[#f68b1e] hover:bg-[#e07b14] text-white text-xs font-bold rounded uppercase flex items-center justify-center gap-1"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* WALLET TAB */}
          {activeTab === 'wallet' && (
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center justify-between">
                <span>JUMIA Wallet & Store Credit</span>
                <span className="text-emerald-700 font-extrabold text-lg">
                  {formatNaira(user.walletBalance)}
                </span>
              </h2>

              <p className="text-xs text-gray-600 mb-6">
                Use your Jumia Wallet for instant zero-fee checkouts, automatic refund credits, and promotional rewards.
              </p>

              <form onSubmit={handleDepositWallet} className="bg-gray-50 p-4 rounded-lg max-w-md space-y-3">
                <h3 className="text-xs font-bold text-gray-800 uppercase">Top Up Wallet</h3>
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">Amount to Add (₦)</label>
                  <input
                    type="number"
                    value={walletDepositAmount}
                    onChange={(e) => setWalletDepositAmount(e.target.value)}
                    className="w-full text-xs border border-gray-300 rounded p-2"
                    step="1000"
                    min="1000"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-[#f68b1e] text-white font-bold text-xs rounded uppercase"
                >
                  Top Up with Card / Bank Transfer
                </button>
              </form>
            </div>
          )}

          {/* ADDRESSES TAB */}
          {activeTab === 'addresses' && (
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                Address Book
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.addresses.map((addr) => (
                  <div key={addr.id} className="p-4 rounded-lg border border-gray-200 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-gray-900">{addr.fullName}</span>
                      {addr.isDefault && (
                        <span className="bg-orange-100 text-[#f68b1e] text-[10px] font-bold px-1.5 py-0.5 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mt-1">{addr.address}</p>
                    <p className="text-gray-500 mt-0.5">
                      {addr.cityLGA}, {addr.state}
                    </p>
                    <p className="text-gray-400 mt-2">{addr.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACCOUNT DETAILS TAB */}
          {activeTab === 'details' && (
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                Account Information
              </h2>

              <div className="space-y-4 max-w-md text-xs">
                <div>
                  <label className="block text-gray-500 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={user.name}
                    readOnly
                    className="w-full border border-gray-200 bg-gray-50 rounded p-2 text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={user.email}
                    readOnly
                    className="w-full border border-gray-200 bg-gray-50 rounded p-2 text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={user.phone}
                    readOnly
                    className="w-full border border-gray-200 bg-gray-50 rounded p-2 text-gray-800"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
