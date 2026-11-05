import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Trash2,
  Heart,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Tag,
  Check,
  ShoppingBag,
} from 'lucide-react';

export default function CartPage() {
  const {
    cart,
    cartSubtotal,
    cartCount,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    formatNaira,
    setCurrentView,
    toggleWishlist,
    appliedCoupon,
    couponDiscount,
    applyCoupon,
    removeCoupon,
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const freeShippingThreshold = 100000;
  const progressToFree = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));
  const amountNeeded = Math.max(0, freeShippingThreshold - cartSubtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;

    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-lg p-10 max-w-lg mx-auto border border-gray-100 shadow-sm">
          <div className="w-20 h-20 bg-orange-50 text-[#f68b1e] rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Your JUMIA cart is empty!</h2>
          <p className="text-xs text-gray-500 mt-2">
            Explore our daily best deals and discover millions of genuine products at unbeatable prices.
          </p>
          <button
            onClick={() => setCurrentView('catalog')}
            className="mt-6 px-6 py-3 bg-[#f68b1e] hover:bg-[#e07b14] text-white font-bold text-xs rounded uppercase tracking-wider shadow-md transition-all"
          >
            START SHOPPING
          </button>
        </div>
      </div>
    );
  }

  const finalTotal = Math.max(0, cartSubtotal - couponDiscount);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-6">
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
          Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})
        </h1>
        <button
          onClick={clearCart}
          className="text-xs text-red-600 hover:underline font-semibold"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cart Items List (col-span-8) */}
        <div className="lg:col-span-8 space-y-3">
          {/* Free Shipping Progress Box */}
          <div className="bg-white p-3.5 rounded-lg border border-orange-100 shadow-2xs">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-gray-800">
                {amountNeeded === 0
                  ? '🎉 Congratulations! You unlocked Free Jumia Express Delivery!'
                  : `Add ${formatNaira(amountNeeded)} more to qualify for Free Lagos Delivery`}
              </span>
              <span className="font-bold text-[#f68b1e]">{progressToFree}%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#f68b1e] rounded-full transition-all duration-300"
                style={{ width: `${progressToFree}%` }}
              />
            </div>
          </div>

          {/* Item Rows */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm divide-y divide-gray-100">
            {cart.map((item) => (
              <div key={item.product.id} className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex gap-3.5 items-center flex-1">
                  <div className="w-20 h-20 bg-[#f9f9f9] rounded p-1.5 flex items-center justify-center shrink-0 border border-gray-100">
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="max-h-full max-w-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-gray-400">
                        {item.product.brand}
                      </span>
                      {item.product.isJumiaExpress && (
                        <span className="bg-[#0b4c8c] text-white text-[9px] font-black px-1.5 py-0.2 rounded-xs">
                          EXPRESS
                        </span>
                      )}
                    </div>

                    <h3 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2 mt-0.5">
                      {item.product.title}
                    </h3>

                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-sm font-bold text-gray-900 tabular-nums">
                        {formatNaira(item.product.price)}
                      </span>
                      {item.product.originalPrice > item.product.price && (
                        <span className="text-[11px] text-gray-400 line-through tabular-nums">
                          {formatNaira(item.product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quantity & Actions */}
                <div className="flex items-center justify-between w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-50">
                  <div className="flex items-center border border-gray-200 rounded">
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                      className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 text-xs font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-bold text-gray-800 tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                      className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 text-xs font-bold"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleWishlist(item.product.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 rounded"
                      title="Save for later"
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Summary (col-span-4) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900 pb-3 border-b border-gray-100">
              CART SUMMARY
            </h2>

            <div className="py-3 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900 tabular-nums">
                  {formatNaira(cartSubtotal)}
                </span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Coupon ({appliedCoupon})</span>
                  </span>
                  <span className="tabular-nums">-{formatNaira(couponDiscount)}</span>
                </div>
              )}

              <p className="text-[11px] text-gray-400 pt-1">
                Jumia Express items are eligible for fast delivery across Nigeria. Shipping fee calculated at checkout.
              </p>
            </div>

            {/* Total */}
            <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
              <span className="text-sm font-bold text-gray-900">Total</span>
              <span className="text-xl font-black text-gray-900 tabular-nums">
                {formatNaira(finalTotal)}
              </span>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => setCurrentView('checkout')}
              className="mt-5 w-full py-3 bg-[#f68b1e] hover:bg-[#e07b14] active:bg-[#c96a0f] text-white font-extrabold text-sm uppercase rounded shadow-md flex items-center justify-center gap-2 transition-transform transform hover:-translate-y-0.5"
            >
              <span>CHECKOUT ({formatNaira(finalTotal)})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Voucher / Coupon Code Form */}
          <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#f68b1e]" />
              <span>Use JUMIA Voucher</span>
            </h3>

            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-emerald-50 text-emerald-800 p-2.5 rounded text-xs">
                <span className="font-bold">{appliedCoupon} Applied!</span>
                <button
                  onClick={removeCoupon}
                  className="text-xs text-red-600 hover:underline font-semibold"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="e.g. JUMIA1000, TECHWEEK"
                    className="flex-1 text-xs border border-gray-200 rounded p-2 focus:outline-none focus:border-[#f68b1e] uppercase"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded uppercase tracking-tight"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-[11px] text-red-600">{couponError}</p>}
                <p className="text-[10px] text-gray-400">
                  Tip: Use <strong>JUMIA1000</strong> for ₦1,000 off or <strong>TECHWEEK</strong> for 10% off!
                </p>
              </form>
            )}
          </div>

          {/* Trust Guarantees */}
          <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm space-y-2.5 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Payment Protection & Secure Checkout</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-[#f68b1e] shrink-0" />
              <span>Easy 7-day Return & Money Back Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
