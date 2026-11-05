import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';
import ProductCard from './ProductCard';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Check, Award, ShieldCheck } from 'lucide-react';

export default function CatalogPage() {
  const {
    products,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    formatNaira,
  } = useApp();

  const [sortBy, setSortBy] = useState<'popularity' | 'price-asc' | 'price-desc' | 'rating'>('popularity');
  const [onlyExpress, setOnlyExpress] = useState(false);
  const [onlyOfficial, setOnlyOfficial] = useState(false);
  const [priceMax, setPriceMax] = useState<number>(1000000);
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Extract unique brands
  const brands = useMemo(() => {
    const list = Array.from(new Set(products.map((p) => p.brand)));
    return ['all', ...list];
  }, [products]);

  // Filter & sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchBrand = p.brand.toLowerCase().includes(q);
          const matchCategory = p.category.toLowerCase().includes(q);
          if (!matchTitle && !matchBrand && !matchCategory) return false;
        }

        // Category filter
        if (selectedCategory && p.category !== selectedCategory) {
          return false;
        }

        // Jumia Express filter
        if (onlyExpress && !p.isJumiaExpress) {
          return false;
        }

        // Official store filter
        if (onlyOfficial && !p.isOfficialStore) {
          return false;
        }

        // Brand filter
        if (selectedBrand !== 'all' && p.brand !== selectedBrand) {
          return false;
        }

        // Price ceiling
        if (p.price > priceMax) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return b.ratingCount - a.ratingCount; // popularity
      });
  }, [products, searchQuery, selectedCategory, onlyExpress, onlyOfficial, selectedBrand, priceMax, sortBy]);

  const activeCategoryObj = CATEGORIES.find((c) => c.slug === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-2">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <span>Home</span>
            <span>/</span>
            <span>Catalog</span>
            {activeCategoryObj && (
              <>
                <span>/</span>
                <span className="text-[#f68b1e] font-semibold">{activeCategoryObj.name}</span>
              </>
            )}
            {searchQuery && (
              <>
                <span>/</span>
                <span className="text-gray-800">Search: &quot;{searchQuery}&quot;</span>
              </>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
            {activeCategoryObj ? activeCategoryObj.name : searchQuery ? `Results for "${searchQuery}"` : 'All Products'}
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({filteredProducts.length} items found)
            </span>
          </h1>
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-md text-xs font-semibold text-gray-700 shadow-sm"
          >
            <Filter className="w-3.5 h-3.5 text-[#f68b1e]" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-3 py-1.5 text-xs shadow-sm">
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-gray-500 hidden sm:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-semibold text-gray-800 focus:outline-none cursor-pointer"
            >
              <option value="popularity">Popularity</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Product Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Layout: Filters Sidebar + Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block md:col-span-1 space-y-6 bg-white p-4 rounded-lg border border-gray-100 shadow-sm self-start">
          {/* Active Filter Clear */}
          {(selectedCategory || searchQuery || onlyExpress || onlyOfficial || selectedBrand !== 'all') && (
            <div className="pb-3 border-b border-gray-100 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-800">Active Filters</span>
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchQuery('');
                  setOnlyExpress(false);
                  setOnlyOfficial(false);
                  setSelectedBrand('all');
                  setPriceMax(1000000);
                }}
                className="text-[11px] text-[#f68b1e] hover:underline font-semibold"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Categories Filter */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-2.5">
              CATEGORY
            </h3>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left py-1 px-1.5 rounded transition-colors ${
                    !selectedCategory ? 'font-bold text-[#f68b1e] bg-orange-50' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All Categories
                </button>
              </li>
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left py-1 px-1.5 rounded transition-colors ${
                      selectedCategory === cat.slug
                        ? 'font-bold text-[#f68b1e] bg-orange-50'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Express & Official Store Toggles */}
          <div className="border-t border-gray-100 pt-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">
              SERVICE & BRAND
            </h3>

            <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyExpress}
                onChange={(e) => setOnlyExpress(e.target.checked)}
                className="w-4 h-4 text-[#f68b1e] rounded border-gray-300 focus:ring-[#f68b1e]"
              />
              <span className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-[#0b4c8c]" />
                <span>Jumia Express</span>
              </span>
            </label>

            <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyOfficial}
                onChange={(e) => setOnlyOfficial(e.target.checked)}
                className="w-4 h-4 text-[#f68b1e] rounded border-gray-300 focus:ring-[#f68b1e]"
              />
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Official Stores Only</span>
              </span>
            </label>
          </div>

          {/* Brand Filter */}
          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-2">
              BRAND
            </h3>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full text-xs border border-gray-200 rounded p-2 text-gray-700 focus:outline-none focus:border-[#f68b1e]"
            >
              <option value="all">All Brands</option>
              {brands.filter((b) => b !== 'all').map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="border-t border-gray-100 pt-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                PRICE RANGE
              </h3>
              <span className="text-xs font-bold text-[#f68b1e]">
                Under {formatNaira(priceMax)}
              </span>
            </div>
            <input
              type="range"
              min="10000"
              max="1000000"
              step="10000"
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              className="w-full accent-[#f68b1e]"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>₦10,000</span>
              <span>₦1,000,000</span>
            </div>
          </div>
        </aside>

        {/* Product Cards Container */}
        <div className="md:col-span-3">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-12 text-center border border-gray-100 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-orange-50 text-[#f68b1e] flex items-center justify-center mx-auto mb-4">
                <SlidersHorizontal className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-gray-800">No matching products found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                Try loosening your filters, selecting a different category, or searching with another term.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchQuery('');
                  setOnlyExpress(false);
                  setOnlyOfficial(false);
                  setSelectedBrand('all');
                  setPriceMax(1000000);
                }}
                className="mt-4 px-4 py-2 bg-[#f68b1e] hover:bg-[#e07b14] text-white text-xs font-bold rounded uppercase tracking-tight shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Slide-over / Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-4/5 max-w-xs bg-white h-full shadow-2xl p-5 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100 mb-4">
                <h3 className="font-bold text-sm text-gray-900">Filters</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded text-gray-500 hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Filter Form Content */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-gray-700 mb-1">Categories</h4>
                  <select
                    value={selectedCategory || ''}
                    onChange={(e) => setSelectedCategory(e.target.value || null)}
                    className="w-full text-xs border border-gray-200 rounded p-2 text-gray-700"
                  >
                    <option value="">All Categories</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <label className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={onlyExpress}
                      onChange={(e) => setOnlyExpress(e.target.checked)}
                      className="w-4 h-4 text-[#f68b1e]"
                    />
                    <span>Jumia Express</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={onlyOfficial}
                      onChange={(e) => setOnlyOfficial(e.target.checked)}
                      className="w-4 h-4 text-[#f68b1e]"
                    />
                    <span>Official Stores</span>
                  </label>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-700 mb-1">Max Price: {formatNaira(priceMax)}</h4>
                  <input
                    type="range"
                    min="10000"
                    max="1000000"
                    step="10000"
                    value={priceMax}
                    onChange={(e) => setPriceMax(Number(e.target.value))}
                    className="w-full accent-[#f68b1e]"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full py-2.5 bg-[#f68b1e] text-white font-bold text-xs rounded uppercase mt-6"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
