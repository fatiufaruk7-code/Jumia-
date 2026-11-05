import React from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { Star, ShoppingCart, Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { openProductDetail, addToCart, formatNaira, toggleWishlist, isWishlisted } = useApp();

  const isSaved = isWishlisted(product.id);

  return (
    <div
      onClick={() => openProductDetail(product)}
      className="group bg-white rounded-md p-3 border border-gray-100 hover:border-orange-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between relative cursor-pointer"
    >
      {/* Top Badges */}
      <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-center z-10 pointer-events-none">
        {product.discountPercent > 0 ? (
          <span className="bg-orange-100 text-[#f68b1e] font-extrabold text-[11px] px-1.5 py-0.5 rounded shadow-xs">
            -{product.discountPercent}%
          </span>
        ) : <span />}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`pointer-events-auto p-1.5 rounded-full bg-white/90 backdrop-blur-sm shadow-sm transition-transform hover:scale-110 ${
            isSaved ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
          }`}
          aria-label="Save to wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-red-500' : ''}`} />
        </button>
      </div>

      {/* Product Image */}
      <div className="w-full aspect-square bg-[#f9f9f9] rounded overflow-hidden relative flex items-center justify-center p-3 mb-2">
        <img
          src={product.image}
          alt={product.title}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
        />

        {product.isJumiaExpress && (
          <div className="absolute bottom-1.5 left-1.5 bg-[#0b4c8c] text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded-xs tracking-tighter shadow-xs">
            EXPRESS
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
            {product.brand}
          </span>
          <h3 className="text-xs sm:text-[13px] font-medium text-gray-800 line-clamp-2 leading-snug group-hover:text-[#f68b1e] transition-colors mt-0.5">
            {product.title}
          </h3>

          <div className="mt-2">
            <div className="text-sm sm:text-base font-extrabold text-gray-900 tabular-nums">
              {formatNaira(product.price)}
            </div>
            {product.originalPrice > product.price && (
              <div className="text-[11px] text-gray-400 line-through tabular-nums">
                {formatNaira(product.originalPrice)}
              </div>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="text-xs font-semibold text-gray-700">{product.rating}</span>
            <span className="text-[11px] text-gray-400">({product.ratingCount})</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product, 1);
            }}
            className="w-full py-2 bg-[#f68b1e] hover:bg-[#e07b14] active:bg-[#c96a0f] text-white text-xs font-bold rounded uppercase tracking-tight flex items-center justify-center gap-1.5 shadow-sm transition-colors"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
