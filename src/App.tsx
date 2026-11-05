/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import CategoryStrip from './components/CategoryStrip';
import FlashSales from './components/FlashSales';
import OfficialStores from './components/OfficialStores';
import ProductGrid from './components/ProductGrid';
import CatalogPage from './components/CatalogPage';
import ProductDetailPage from './components/ProductDetailPage';
import CartPage from './components/CartPage';
import CheckoutModal from './components/CheckoutModal';
import OrderSuccessModal from './components/OrderSuccessModal';
import CustomerDashboard from './components/CustomerDashboard';
import SellerDashboard from './components/SellerDashboard';
import AdminDashboard from './components/AdminDashboard';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import MobileNavigation from './components/MobileNavigation';
import ToastContainer from './components/ToastContainer';

function MainContent() {
  const { currentView } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f1f2]">
      <Header />

      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <HeroSection />
            <CategoryStrip />
            <FlashSales />
            <OfficialStores />
            <ProductGrid />
          </>
        )}

        {currentView === 'catalog' && <CatalogPage />}
        {currentView === 'product-detail' && <ProductDetailPage />}
        {currentView === 'cart' && <CartPage />}
        {currentView === 'checkout' && <CheckoutModal />}
        {currentView === 'order-success' && <OrderSuccessModal />}
        {currentView === 'customer-dashboard' && <CustomerDashboard />}
        {currentView === 'seller-dashboard' && <SellerDashboard />}
        {currentView === 'admin-dashboard' && <AdminDashboard />}
      </main>

      <Footer />
      <MobileNavigation />
      <AuthModal />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
