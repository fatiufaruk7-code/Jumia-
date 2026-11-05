import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { Zap, Clock, ChevronRight, ShoppingCart } from 'lucide-react';

export default function FlashSales() {
  const { products, openProductDetail, addToCart, formatNaira, setCurrentView, setSelectedCategory } = useApp();

  // Simulated countdown timer (starts with 3 hours, 28 mins, 45 secs)
  const [timeLeft, setTimeLeft] = useState({
    hours: 3,
    minutes: 28,
    seconds: 45,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 3, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashProducts = products.filter((p) => p.isFlashSale);

  const formatDigits = (num: number) => num.toString().padStart(2, '0');

  return (
    <section className="max-w-7xl mx-auto px-4 py-3">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {/* Flash Sale Banner Header */}
        <div className="bg-gradient-to-r from-[#e61601] via-[#e61601] to-[#f68b1e] text-white px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-extrabold text-base sm:text-lg tracking-wide uppercase">
              <Zap className="w-5 h-5 fill-white text-yellow-300 animate-pulse" />
              <span>FLASH SALES</span>
            </div>

            {/* Countdown timer */}
            <div className="flex items-center gap-1 text-xs font-mono ml-2 sm:ml-4 bg-black/25 px-2.5 py-1 rounded backdrop-blur-sm">
              <Clock className="w-3.5 h-3.5 text-yellow-300 mr-1" />
              <span className="text-yellow-200 text-[11px] font-sans mr-1 hidden sm:inline">Time Left:</span>
              <span className="font-bold bg-black/40 px-1 py-0.5 rounded text-white tabular-nums">
                {formatDigits(timeLeft.hours)}h
              </span>
              <span>:</span>
              <span className="font-bold bg-black/40 px-1 py-0.5 rounded text-white tabular-nums">
                {formatDigits(timeLeft.minutes)}m
              </span>
              <span>:</span>
              <span className="font-bold bg-black/40 px-1 py-0.5 rounded text-white tabular-nums">
                {formatDigits(timeLeft.seconds)}s
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedCategory(null);
              setCurrentView('catalog');
            }}
            className="text-xs font-bold uppercase tracking-wider text-white hover:text-yellow-200 flex items-center gap-1 transition-colors"
          >
            <span>SEE ALL</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Product Cards Row */}
        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {flashProducts.map((product) => {
            const remaining = product.flashSaleRemaining ?? 5;
            const total = product.flashSaleTotal ?? 20;
            const progressPercent = Math.max(12, Math.round(((total - remaining) / total) * 100));

            return (
              <div
                key={product.id}
                className="group bg-white rounded-md p-2.5 border border-gray-100 hover:shadow-md hover:border-orange-200 transition-all flex flex-col justify-between relative cursor-pointer"
                onClick={() => openProductDetail(product)}
              >
                {/* Discount Badge */}
                <div className="absolute top-2 right-2 bg-orange-100 text-[#e61601] font-extrabold text-[11px] px-1.5 py-0.5 rounded z-10">
                  -{product.discountPercent}%
                </div>

                {/* Product Image */}
                <div className="w-full aspect-square bg-[#f9f9f9] rounded overflow-hidden relative flex items-center justify-center p-2 mb-2">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  {product.isJumiaExpress && (
                    <div className="absolute bottom-1 left-1 bg-[#0b4c8c] text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded-sm tracking-tighter">
                      EXPRESS
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-medium text-gray-800 line-clamp-2 leading-snug group-hover:text-[#f68b1e] transition-colors">
                      {product.title}
                    </h3>

                    <div className="mt-1.5">
                      <div className="text-sm font-bold text-gray-900 tabular-nums">
                        {formatNaira(product.price)}
                      </div>
                      <div className="text-[11px] text-gray-400 line-through tabular-nums">
                        {formatNaira(product.originalPrice)}
                      </div>
                    </div>
                  </div>

                  {/* Stock Progress Bar */}
                  <div className="mt-2.5">
                    <div className="flex justify-between items-center text-[10px] text-gray-500 mb-1 font-medium">
                      <span>{remaining} items left</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full flash-progress rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product, 1);
                      }}
                      className="mt-3 w-full py-1.5 bg-[#f68b1e] hover:bg-[#e07b14] text-white text-[11px] font-bold rounded uppercase tracking-tight flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
