import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NIGERIAN_STATES_LGAS } from '../data/mockData';
import {
  Star,
  ShoppingCart,
  Zap,
  Truck,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Heart,
  Share2,
  ChevronRight,
  Store,
  MapPin,
  Clock,
  ArrowRight,
} from 'lucide-react';

export default function ProductDetailPage() {
  const {
    selectedProduct,
    addToCart,
    formatNaira,
    setCurrentView,
    toggleWishlist,
    isWishlisted,
    addToast,
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedState, setSelectedState] = useState('Lagos');
  const [selectedLGA, setSelectedLGA] = useState('Ikeja');

  if (!selectedProduct) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-gray-800">No product selected</h2>
        <button
          onClick={() => setCurrentView('catalog')}
          className="mt-4 px-5 py-2.5 bg-[#f68b1e] text-white font-bold text-xs rounded uppercase"
        >
          Browse JUMIA Catalog
        </button>
      </div>
    );
  }

  const images = selectedProduct.additionalImages && selectedProduct.additionalImages.length > 0
    ? selectedProduct.additionalImages
    : [selectedProduct.image];

  const currentImage = images[activeImageIndex] || selectedProduct.image;
  const isSaved = isWishlisted(selectedProduct.id);

  const handleBuyNow = () => {
    addToCart(selectedProduct, quantity);
    setCurrentView('checkout');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Product link copied to clipboard!', 'info');
    }
  };

  const lgas = NIGERIAN_STATES_LGAS[selectedState] || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 overflow-x-auto whitespace-nowrap">
        <button
          onClick={() => setCurrentView('home')}
          className="hover:text-[#f68b1e] transition-colors"
        >
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <button
          onClick={() => setCurrentView('catalog')}
          className="hover:text-[#f68b1e] transition-colors capitalize"
        >
          {selectedProduct.category.replace('-', ' ')}
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-800 font-medium truncate max-w-xs">
          {selectedProduct.title}
        </span>
      </div>

      {/* Main Top Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Gallery Column (Desktop col-span-4) */}
        <div className="lg:col-span-4 bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex flex-col items-center self-start">
          <div className="w-full aspect-square bg-[#f9f9f9] rounded-md relative flex items-center justify-center p-4 overflow-hidden">
            <img
              src={currentImage}
              alt={selectedProduct.title}
              className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
              referrerPolicy="no-referrer"
            />
            {selectedProduct.isJumiaExpress && (
              <span className="absolute top-2 left-2 bg-[#0b4c8c] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-sm">
                EXPRESS
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto w-full justify-center">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-14 h-14 rounded border p-1 bg-[#f9f9f9] transition-all ${
                    activeImageIndex === idx
                      ? 'border-[#f68b1e] ring-2 ring-orange-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Share & Wishlist Row */}
          <div className="flex items-center justify-between w-full mt-4 pt-3 border-t border-gray-100 text-xs text-gray-600">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 hover:text-[#f68b1e] transition-colors"
            >
              <Share2 className="w-4 h-4 text-gray-500" />
              <span>Share this product</span>
            </button>
            <button
              onClick={() => toggleWishlist(selectedProduct.id)}
              className={`flex items-center gap-1.5 transition-colors ${
                isSaved ? 'text-red-500 font-semibold' : 'hover:text-red-500'
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500' : ''}`} />
              <span>{isSaved ? 'Saved to Wishlist' : 'Add to Wishlist'}</span>
            </button>
          </div>
        </div>

        {/* Center Purchase Module Column (Desktop col-span-5) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-lg border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            {/* Official Store Badge & Brand */}
            <div className="flex items-center gap-2 mb-1.5">
              {selectedProduct.isOfficialStore && (
                <span className="bg-blue-50 text-[#0b4c8c] text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Official Store
                </span>
              )}
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Brand: <strong className="text-gray-900">{selectedProduct.brand}</strong>
              </span>
            </div>

            {/* Title */}
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
              {selectedProduct.title}
            </h1>

            {/* Ratings Bar */}
            <div className="flex items-center gap-2 mt-2 pb-3 border-b border-gray-100">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(selectedProduct.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-gray-800">
                {selectedProduct.rating} out of 5
              </span>
              <span className="text-xs text-gray-400">
                ({selectedProduct.ratingCount} verified ratings)
              </span>
            </div>

            {/* Pricing Section */}
            <div className="py-4 border-b border-gray-100">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 tabular-nums">
                  {formatNaira(selectedProduct.price)}
                </span>
                {selectedProduct.originalPrice > selectedProduct.price && (
                  <>
                    <span className="text-sm text-gray-400 line-through tabular-nums">
                      {formatNaira(selectedProduct.originalPrice)}
                    </span>
                    <span className="bg-orange-100 text-[#f68b1e] text-xs font-black px-2 py-0.5 rounded">
                      -{selectedProduct.discountPercent}%
                    </span>
                  </>
                )}
              </div>

              {selectedProduct.isJumiaExpress && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-sm w-fit font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Eligible for Free Delivery in Lagos with Jumia Express</span>
                </div>
              )}
            </div>

            {/* Stock status */}
            <div className="py-3 text-xs">
              {selectedProduct.inStock ? (
                <p className="text-emerald-700 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
                  In Stock ({selectedProduct.stockCount} units available)
                </p>
              ) : (
                <p className="text-red-600 font-semibold">Out of Stock</p>
              )}
            </div>

            {/* Quantity Stepper */}
            <div className="py-2 flex items-center gap-4">
              <span className="text-xs font-bold text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-200 rounded">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100 font-bold text-sm"
                >
                  -
                </button>
                <span className="px-4 py-1 text-xs font-bold text-gray-900 tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(selectedProduct.stockCount, q + 1))}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100 font-bold text-sm"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 space-y-2.5">
            <button
              onClick={() => addToCart(selectedProduct, quantity)}
              className="w-full py-3 bg-[#f68b1e] hover:bg-[#e07b14] active:bg-[#c96a0f] text-white font-extrabold text-sm uppercase rounded shadow-md flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Add to Cart</span>
            </button>

            <button
              onClick={handleBuyNow}
              className="w-full py-3 bg-[#282828] hover:bg-black text-white font-extrabold text-sm uppercase rounded shadow flex items-center justify-center gap-2 transition-all"
            >
              <span>Buy Now (Instant Checkout)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Delivery & Seller Column (Desktop col-span-3) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Delivery & Returns Box */}
          <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#f68b1e]" />
              <span>Delivery & Returns</span>
            </h3>

            {/* Location selector */}
            <div className="pt-3">
              <label className="block text-[11px] text-gray-500 mb-1 font-medium">
                Choose your location:
              </label>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <select
                  value={selectedState}
                  onChange={(e) => {
                    const st = e.target.value;
                    setSelectedState(st);
                    setSelectedLGA(NIGERIAN_STATES_LGAS[st]?.[0] || '');
                  }}
                  className="text-xs border border-gray-200 rounded p-1.5 text-gray-800 focus:outline-none"
                >
                  {Object.keys(NIGERIAN_STATES_LGAS).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedLGA}
                  onChange={(e) => setSelectedLGA(e.target.value)}
                  className="text-xs border border-gray-200 rounded p-1.5 text-gray-800 focus:outline-none"
                >
                  {lgas.map((lga) => (
                    <option key={lga} value={lga}>
                      {lga}
                    </option>
                  ))}
                </select>
              </div>

              {/* Delivery options */}
              <div className="space-y-3 pt-2 text-xs">
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded bg-orange-50 text-[#f68b1e] flex items-center justify-center shrink-0 mt-0.5">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-800">Door Delivery</span>
                      <span className="font-bold text-[#f68b1e]">₦1,200</span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Ready for delivery tomorrow if you order within next 3 hours.
                    </p>
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded bg-blue-50 text-[#0b4c8c] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-800">Pickup Station</span>
                      <span className="font-bold text-emerald-600">₦500</span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Pickup at {selectedLGA} Jumia Hub. Ready tomorrow.
                    </p>
                  </div>
                </div>

                <div className="flex gap-2.5 pt-2 border-t border-gray-100">
                  <div className="w-7 h-7 rounded bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <RotateCcw className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-gray-800">Return Policy</span>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Free return within 7 days for all eligible items.
                    </p>
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-gray-800">Warranty</span>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      12 Months Official Manufacturer Warranty.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Seller Information Card */}
          <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 pb-2 border-b border-gray-100 flex items-center justify-between">
              <span>SELLER INFORMATION</span>
              <Store className="w-3.5 h-3.5 text-gray-400" />
            </h3>

            <div className="pt-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-gray-800">{selectedProduct.seller.name}</h4>
                  <p className="text-[10px] text-gray-400">Merchant on Jumia since {selectedProduct.seller.joinDate}</p>
                </div>
                {selectedProduct.seller.verified && (
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold">
                    Verified
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-100 text-center">
                <div className="bg-gray-50 p-2 rounded">
                  <p className="text-sm font-extrabold text-[#f68b1e] tabular-nums">
                    {selectedProduct.seller.score}%
                  </p>
                  <p className="text-[10px] text-gray-500">Seller Score</p>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <p className="text-sm font-extrabold text-emerald-600 tabular-nums">
                    {selectedProduct.seller.fulfillmentRate}%
                  </p>
                  <p className="text-[10px] text-gray-500">Fulfillment Rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Tabs: Specifications, Features, Reviews */}
      <div className="mt-8 bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6">
          <h2 className="text-base font-extrabold text-gray-900 mb-4 pb-2 border-b border-gray-100">
            Product Details & Key Features
          </h2>

          <p className="text-sm text-gray-700 leading-relaxed mb-6">
            {selectedProduct.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Features Bullet List */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">
                Highlights & Features
              </h3>
              <ul className="space-y-2 text-xs text-gray-700">
                {selectedProduct.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Specifications Key-Value Table */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">
                Technical Specifications
              </h3>
              <div className="border border-gray-100 rounded overflow-hidden divide-y divide-gray-100 text-xs">
                {Object.entries(selectedProduct.specifications).map(([key, val]) => (
                  <div key={key} className="grid grid-cols-3 p-2.5">
                    <span className="font-semibold text-gray-500 col-span-1">{key}</span>
                    <span className="text-gray-900 font-medium col-span-2">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="p-6 border-t border-gray-100 bg-[#fafafa]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-gray-200 gap-2">
            <div>
              <h2 className="text-base font-extrabold text-gray-900">
                Verified Customer Feedback
              </h2>
              <p className="text-xs text-gray-500">
                Genuine feedback from confirmed buyers on Jumia Nigeria
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold text-gray-900">{selectedProduct.rating}</span>
              <div className="flex items-center text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
              </div>
              <span className="text-xs text-gray-500">({selectedProduct.ratingCount} reviews)</span>
            </div>
          </div>

          <div className="space-y-4">
            {selectedProduct.reviews.map((rev) => (
              <div key={rev.id} className="bg-white p-4 rounded-md border border-gray-100 shadow-2xs">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-gray-900">{rev.title}</span>
                  </div>
                  <span className="text-[11px] text-gray-400">{rev.date}</span>
                </div>
                <p className="text-xs text-gray-700 mt-1">{rev.comment}</p>
                <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-400">
                  <span>By {rev.author}</span>
                  {rev.verifiedPurchase && (
                    <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified Purchase
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
