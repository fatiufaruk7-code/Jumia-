import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';
import {
  Search,
  ShoppingCart,
  User as UserIcon,
  HelpCircle,
  Package,
  Heart,
  Wallet,
  Store,
  ShieldCheck,
  LogOut,
  ChevronDown,
  PhoneCall,
  MapPin,
  Sparkles,
} from 'lucide-react';

export default function Header() {
  const {
    cartCount,
    user,
    setCurrentView,
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    switchRole,
    setIsAuthModalOpen,
    setAuthModalTab,
    logout,
  } = useApp();

  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isHelpMenuOpen, setIsHelpMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentView('catalog');
  };

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    setCurrentView('catalog');
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm font-sans">
      {/* Top Utility Bar */}
      <div className="bg-[#282828] text-white text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => switchRole('seller')}
              className="text-[#f68b1e] hover:underline font-medium flex items-center gap-1.5 transition-colors"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Sell on JUMIA</span>
            </button>
            <span className="text-gray-400">|</span>
            <div className="flex items-center gap-1 text-gray-300">
              <span className="text-[#f68b1e] font-bold">JUMIA</span>
              <span>PAY</span>
            </div>
            <span className="text-gray-400">|</span>
            <div className="flex items-center gap-1.5 text-gray-300">
              <MapPin className="w-3 h-3 text-[#f68b1e]" />
              <span>Delivery to: <strong>Lagos, Nigeria</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1 text-gray-300">
              <PhoneCall className="w-3 h-3 text-[#f68b1e]" />
              <span>Helpline: <strong>0700 600 0000</strong></span>
            </div>
            <span className="text-gray-400">|</span>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Portal:</span>
              <button
                onClick={() => switchRole('customer')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  user.role === 'customer'
                    ? 'bg-[#f68b1e] text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Customer
              </button>
              <button
                onClick={() => switchRole('seller')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  user.role === 'seller'
                    ? 'bg-[#f68b1e] text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Seller Center
              </button>
              <button
                onClick={() => switchRole('admin')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  user.role === 'admin'
                    ? 'bg-[#f68b1e] text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Jumia Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo - JUMIA */}
        <button
          onClick={() => {
            setSelectedCategory(null);
            setSearchQuery('');
            setCurrentView('home');
          }}
          className="flex items-center gap-1 text-left shrink-0 group focus:outline-none"
        >
          <div className="relative flex items-center">
            <span className="text-3xl font-extrabold tracking-tight text-[#f68b1e] brand-font">
              JUMIA
            </span>
            {/* Signature Jumia star emblem */}
            <span className="text-[#f68b1e] ml-0.5 -mt-2 text-xl font-black">★</span>
          </div>
        </button>

        {/* Search Bar with iconic Jumia Orange Button */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 max-w-2xl relative flex items-center"
        >
          <div className="relative w-full flex items-center">
            <Search className="w-4 h-4 absolute left-3.5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, brands and categories..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border-2 border-[#f68b1e] rounded-l-md focus:outline-none placeholder-gray-400"
            />
          </div>
          <button
            type="submit"
            className="bg-[#f68b1e] hover:bg-[#e07b14] text-white font-bold text-xs uppercase px-6 py-3 rounded-r-md transition-colors shrink-0 shadow-sm"
          >
            Search
          </button>
        </form>

        {/* Action Controls */}
        <div className="flex items-center gap-3 md:gap-5 shrink-0">
          {/* Account Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsAccountMenuOpen(!isAccountMenuOpen);
                setIsHelpMenuOpen(false);
              }}
              className="flex items-center gap-1.5 py-1.5 px-2 hover:bg-gray-100 rounded-md transition-colors text-sm font-medium text-gray-800"
            >
              <UserIcon className="w-5 h-5 text-gray-700" />
              <div className="text-left hidden lg:block">
                <span className="block text-xs text-gray-500 leading-tight">
                  {user ? `Hi, ${user.name.split(' ')[0]}` : 'Welcome'}
                </span>
                <span className="block text-xs font-bold leading-tight flex items-center gap-0.5">
                  Account <ChevronDown className="w-3 h-3 text-gray-500" />
                </span>
              </div>
            </button>

            {isAccountMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-xs text-gray-500">Signed in as</p>
                  <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                  <p className="text-xs text-[#f68b1e] font-medium capitalize mt-0.5">
                    {user.role === 'customer' ? 'JUMIA Shopper' : `${user.role.toUpperCase()} Account`}
                  </p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setCurrentView('customer-dashboard');
                      setIsAccountMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#f68b1e] flex items-center gap-3 transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-gray-500" />
                    <span>My JUMIA Account</span>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentView('customer-dashboard');
                      setIsAccountMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#f68b1e] flex items-center gap-3 transition-colors"
                  >
                    <Package className="w-4 h-4 text-gray-500" />
                    <span>Orders</span>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentView('customer-dashboard');
                      setIsAccountMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#f68b1e] flex items-center gap-3 transition-colors"
                  >
                    <Heart className="w-4 h-4 text-gray-500" />
                    <span>Saved Items (Wishlist)</span>
                  </button>
                  <button
                    onClick={() => {
                      setCurrentView('customer-dashboard');
                      setIsAccountMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#f68b1e] flex items-center gap-3 transition-colors"
                  >
                    <Wallet className="w-4 h-4 text-gray-500" />
                    <div className="flex justify-between items-center flex-1">
                      <span>Jumia Wallet</span>
                      <span className="text-xs font-bold text-emerald-600">
                        ₦{user.walletBalance.toLocaleString()}
                      </span>
                    </div>
                  </button>
                </div>

                <div className="border-t border-gray-100 py-1">
                  <button
                    onClick={() => {
                      switchRole('seller');
                      setIsAccountMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#f68b1e] flex items-center gap-3 transition-colors"
                  >
                    <Store className="w-4 h-4 text-[#f68b1e]" />
                    <span>JUMIA Seller Center</span>
                  </button>
                  <button
                    onClick={() => {
                      switchRole('admin');
                      setIsAccountMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#f68b1e] flex items-center gap-3 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                    <span>JUMIA Admin Portal</span>
                  </button>
                </div>

                <div className="border-t border-gray-100 pt-1">
                  <button
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setAuthModalTab('login');
                      setIsAccountMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-[#f68b1e] hover:bg-orange-50 flex items-center gap-3 transition-colors font-semibold"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>Firebase Sign In / Register</span>
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setIsAccountMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Help Dropdown */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => {
                setIsHelpMenuOpen(!isHelpMenuOpen);
                setIsAccountMenuOpen(false);
              }}
              className="flex items-center gap-1.5 py-1.5 px-2 hover:bg-gray-100 rounded-md transition-colors text-sm font-medium text-gray-800"
            >
              <HelpCircle className="w-5 h-5 text-gray-700" />
              <span className="text-xs font-bold hidden lg:flex items-center gap-0.5">
                Help <ChevronDown className="w-3 h-3 text-gray-500" />
              </span>
            </button>

            {isHelpMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                <a
                  href="#help"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsHelpMenuOpen(false);
                  }}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#f68b1e]"
                >
                  Help Center & FAQs
                </a>
                <a
                  href="#order"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsHelpMenuOpen(false);
                  }}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#f68b1e]"
                >
                  Place an Order
                </a>
                <a
                  href="#payment"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsHelpMenuOpen(false);
                  }}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#f68b1e]"
                >
                  Payment Options
                </a>
                <a
                  href="#track"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentView('customer-dashboard');
                    setIsHelpMenuOpen(false);
                  }}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#f68b1e]"
                >
                  Track Your Order
                </a>
                <a
                  href="#returns"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsHelpMenuOpen(false);
                  }}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#f68b1e]"
                >
                  Returns & Refunds
                </a>
              </div>
            )}
          </div>

          {/* Cart Button */}
          <button
            onClick={() => setCurrentView('cart')}
            className="flex items-center gap-2 py-1.5 px-3 bg-orange-50 hover:bg-orange-100 text-[#f68b1e] rounded-md transition-colors relative"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 text-[#f68b1e]" />
              {cartCount > 0 && (
                <span className="absolute -top-2.5 -right-2.5 bg-[#f68b1e] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-xs font-bold text-gray-800 hidden sm:inline">
              Cart
            </span>
          </button>
        </div>
      </div>

      {/* Quick Category Sub-nav */}
      <div className="border-t border-gray-100 bg-[#fafafa] hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-6 overflow-x-auto no-scrollbar py-2 text-xs font-medium text-gray-700">
          <button
            onClick={() => {
              setSelectedCategory(null);
              setCurrentView('catalog');
            }}
            className="hover:text-[#f68b1e] whitespace-nowrap flex items-center gap-1 font-semibold text-gray-900"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#f68b1e]" />
            <span>All Categories</span>
          </button>
          {CATEGORIES.slice(0, 8).map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.slug)}
              className="hover:text-[#f68b1e] whitespace-nowrap transition-colors"
            >
              {cat.name}
            </button>
          ))}
          <button
            onClick={() => {
              setSelectedCategory(null);
              setCurrentView('catalog');
            }}
            className="text-[#f68b1e] font-bold whitespace-nowrap hover:underline"
          >
            FLASH SALES 🔥
          </button>
        </div>
      </div>
    </header>
  );
}
