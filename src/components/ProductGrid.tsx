import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import ProductCard from './ProductCard';
import { Sparkles, TrendingUp, Award } from 'lucide-react';

export default function ProductGrid() {
  const { products } = useApp();
  const [activeTab, setActiveTab] = useState<'all' | 'deals' | 'express'>('all');

  const filteredProducts = products.filter((p) => {
    if (activeTab === 'deals') return p.discountPercent >= 25;
    if (activeTab === 'express') return p.isJumiaExpress;
    return true;
  });

  return (
    <section className="max-w-7xl mx-auto px-4 py-4">
      {/* Section Header with Tabs */}
      <div className="bg-white rounded-t-lg p-4 border border-gray-100 border-b-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#f68b1e]" />
          <h2 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight">
            TOP DEALS & POPULAR PICKS
          </h2>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'all'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All Products
          </button>
          <button
            onClick={() => setActiveTab('deals')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 ${
              activeTab === 'deals'
                ? 'bg-white text-[#f68b1e] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>High Discounts (25%+)</span>
          </button>
          <button
            onClick={() => setActiveTab('express')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 ${
              activeTab === 'express'
                ? 'bg-white text-[#0b4c8c] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Jumia Express</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="bg-white rounded-b-lg p-4 border border-gray-100 border-t-0 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
