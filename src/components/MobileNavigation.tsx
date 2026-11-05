import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Grid, Zap, User, ShoppingCart } from 'lucide-react';

export default function MobileNavigation() {
  const {
    currentView,
    setCurrentView,
    cartCount,
    setSelectedCategory,
    setIsAuthModalOpen,
    user,
  } = useApp();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg py-2 px-3 font-sans">
      <div className="flex items-center justify-around text-[10px] font-medium text-gray-600">
        <button
          onClick={() => {
            setSelectedCategory(null);
            setCurrentView('home');
          }}
          className={`flex flex-col items-center gap-0.5 transition-colors ${
            currentView === 'home' ? 'text-[#f68b1e] font-bold' : 'hover:text-gray-900'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => {
            setSelectedCategory(null);
            setCurrentView('catalog');
          }}
          className={`flex flex-col items-center gap-0.5 transition-colors ${
            currentView === 'catalog' ? 'text-[#f68b1e] font-bold' : 'hover:text-gray-900'
          }`}
        >
          <Grid className="w-5 h-5" />
          <span>Categories</span>
        </button>

        <button
          onClick={() => {
            setSelectedCategory(null);
            setCurrentView('catalog');
          }}
          className="flex flex-col items-center gap-0.5 text-[#e61601] font-bold"
        >
          <Zap className="w-5 h-5 fill-[#e61601]" />
          <span>Deals</span>
        </button>

        <button
          onClick={() => {
            if (user.role === 'customer') {
              setCurrentView('customer-dashboard');
            } else if (user.role === 'seller') {
              setCurrentView('seller-dashboard');
            } else {
              setCurrentView('admin-dashboard');
            }
          }}
          className={`flex flex-col items-center gap-0.5 transition-colors ${
            currentView.includes('dashboard') ? 'text-[#f68b1e] font-bold' : 'hover:text-gray-900'
          }`}
        >
          <User className="w-5 h-5" />
          <span>Account</span>
        </button>

        <button
          onClick={() => setCurrentView('cart')}
          className={`flex flex-col items-center gap-0.5 relative transition-colors ${
            currentView === 'cart' ? 'text-[#f68b1e] font-bold' : 'hover:text-gray-900'
          }`}
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#f68b1e] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {cartCount}
              </span>
            )}
          </div>
          <span>Cart</span>
        </button>
      </div>
    </nav>
  );
}
