import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, HERO_BANNERS } from '../data/mockData';
import {
  Tv,
  Smartphone,
  Sparkles,
  Home,
  Speaker,
  Shirt,
  Laptop,
  ShoppingBag,
  Baby,
  Gamepad2,
  ChevronRight,
  PhoneCall,
  Store,
  Zap,
  RotateCcw,
  ShieldCheck,
  ChevronLeft,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  Tv: <Tv className="w-4 h-4 text-gray-500 group-hover:text-[#f68b1e]" />,
  Smartphone: <Smartphone className="w-4 h-4 text-gray-500 group-hover:text-[#f68b1e]" />,
  Sparkles: <Sparkles className="w-4 h-4 text-gray-500 group-hover:text-[#f68b1e]" />,
  Home: <Home className="w-4 h-4 text-gray-500 group-hover:text-[#f68b1e]" />,
  Speaker: <Speaker className="w-4 h-4 text-gray-500 group-hover:text-[#f68b1e]" />,
  Shirt: <Shirt className="w-4 h-4 text-gray-500 group-hover:text-[#f68b1e]" />,
  Laptop: <Laptop className="w-4 h-4 text-gray-500 group-hover:text-[#f68b1e]" />,
  ShoppingBag: <ShoppingBag className="w-4 h-4 text-gray-500 group-hover:text-[#f68b1e]" />,
  Baby: <Baby className="w-4 h-4 text-gray-500 group-hover:text-[#f68b1e]" />,
  Gamepad2: <Gamepad2 className="w-4 h-4 text-gray-500 group-hover:text-[#f68b1e]" />,
};

export default function HeroSection() {
  const { setSelectedCategory, setCurrentView, switchRole } = useApp();
  const [activeSlide, setActiveSlide] = useState(0);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Auto advance banner every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_BANNERS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleCategoryClick = (slug: string) => {
    setSelectedCategory(slug);
    setCurrentView('catalog');
  };

  const currentBanner = HERO_BANNERS[activeSlide];

  return (
    <section className="max-w-7xl mx-auto px-4 pt-4 pb-2">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Category Sidebar (Desktop) */}
        <div className="hidden lg:block lg:col-span-3 bg-white rounded-lg shadow-sm border border-gray-100 p-2 relative">
          <ul className="divide-y divide-gray-50 text-xs text-gray-700">
            {CATEGORIES.map((cat) => (
              <li
                key={cat.id}
                onMouseEnter={() => setHoveredCategory(cat.id)}
                onMouseLeave={() => setHoveredCategory(null)}
                className="group relative"
              >
                <button
                  onClick={() => handleCategoryClick(cat.slug)}
                  className="w-full flex items-center justify-between py-2 px-2.5 rounded hover:bg-orange-50 hover:text-[#f68b1e] transition-colors"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {ICON_MAP[cat.iconName] || <Sparkles className="w-4 h-4" />}
                    <span className="truncate font-medium">{cat.name}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#f68b1e] shrink-0" />
                </button>

                {/* Subcategory Flyout */}
                {hoveredCategory === cat.id && (
                  <div className="absolute left-full top-0 ml-1 w-64 bg-white rounded-lg shadow-xl border border-gray-100 p-4 z-30">
                    <h4 className="text-xs font-bold text-gray-900 border-b border-gray-100 pb-2 mb-2 flex items-center gap-1.5 text-[#f68b1e]">
                      {cat.name}
                    </h4>
                    <div className="flex flex-col gap-2">
                      {cat.subcategories.map((sub, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleCategoryClick(cat.slug)}
                          className="text-left text-xs text-gray-600 hover:text-[#f68b1e] hover:translate-x-1 transition-all py-0.5"
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Center Column: Interactive Campaign Banner Carousel */}
        <div className="col-span-1 lg:col-span-7 relative bg-gray-900 rounded-lg overflow-hidden shadow-sm group min-h-[280px] sm:min-h-[360px] flex items-center">
          <img
            src={currentBanner.image}
            alt={currentBanner.title}
            className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          {/* Subtle gradient scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

          {/* Banner Text & CTA */}
          <div className="relative z-10 p-6 sm:p-8 max-w-lg">
            <span className="inline-block bg-[#f68b1e] text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm mb-2 shadow-sm">
              {currentBanner.tag}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
              {currentBanner.title}
            </h2>
            <p className="text-xs sm:text-sm text-gray-200 mt-2 font-normal line-clamp-2 drop-shadow">
              {currentBanner.subtitle}
            </p>

            <button
              onClick={() => {
                setSelectedCategory(currentBanner.category);
                setCurrentView('catalog');
              }}
              className="mt-4 inline-flex items-center gap-2 bg-[#f68b1e] hover:bg-[#e07b14] text-white font-bold text-xs uppercase px-5 py-2.5 rounded shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <span>{currentBanner.ctaText}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Slider Prev / Next Controls */}
          <button
            onClick={() =>
              setActiveSlide((prev) => (prev - 1 + HERO_BANNERS.length) % HERO_BANNERS.length)
            }
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-[#f68b1e] text-white p-2 rounded-full backdrop-blur-sm transition-colors opacity-80 group-hover:opacity-100 z-20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveSlide((prev) => (prev + 1) % HERO_BANNERS.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-[#f68b1e] text-white p-2 rounded-full backdrop-blur-sm transition-colors opacity-80 group-hover:opacity-100 z-20"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Slide Indicator Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
            {HERO_BANNERS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  activeSlide === idx ? 'w-6 bg-[#f68b1e]' : 'bg-white/60 hover:bg-white'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Jumia Quick Service Cards (Desktop) */}
        <div className="hidden lg:flex lg:col-span-2 flex-col gap-3">
          {/* Card 1: Call to Order */}
          <div className="bg-white rounded-lg p-3.5 border border-gray-100 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 text-[#f68b1e] flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-800 uppercase tracking-tight">CALL TO ORDER</p>
              <p className="text-xs text-[#f68b1e] font-extrabold">0700 600 0000</p>
            </div>
          </div>

          {/* Card 2: Sell on Jumia */}
          <button
            onClick={() => switchRole('seller')}
            className="bg-white hover:bg-orange-50/50 rounded-lg p-3.5 border border-gray-100 shadow-sm flex items-center gap-3 text-left transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-amber-100 text-[#f68b1e] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-800 uppercase tracking-tight">Sell on JUMIA</p>
              <p className="text-[11px] text-gray-500">Reach millions of shoppers</p>
            </div>
          </button>

          {/* Card 3: Jumia Express */}
          <div className="bg-white rounded-lg p-3.5 border border-gray-100 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-[#0b4c8c] flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-800 uppercase tracking-tight">JUMIA EXPRESS</p>
              <p className="text-[11px] text-gray-500">Next-day delivery in Lagos</p>
            </div>
          </div>

          {/* Card 4: Easy Return */}
          <div className="bg-white rounded-lg p-3.5 border border-gray-100 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-800 uppercase tracking-tight">EASY RETURN</p>
              <p className="text-[11px] text-gray-500">7 days money-back guarantee</p>
            </div>
          </div>

          {/* Card 5: Authentic Guarantee */}
          <div className="bg-white rounded-lg p-3.5 border border-gray-100 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-800 uppercase tracking-tight">100% AUTHENTIC</p>
              <p className="text-[11px] text-gray-500">Direct from official brands</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
