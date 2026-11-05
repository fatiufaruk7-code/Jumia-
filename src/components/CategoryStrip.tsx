import React from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';
import {
  Smartphone,
  Tv,
  Sparkles,
  Home,
  Speaker,
  Shirt,
  Laptop,
  ShoppingBag,
} from 'lucide-react';

const CATEGORY_ITEMS = [
  {
    name: 'Phones & Tablets',
    slug: 'phones-tablets',
    icon: <Smartphone className="w-6 h-6 text-[#f68b1e]" />,
    bg: 'bg-orange-50',
  },
  {
    name: 'Appliances',
    slug: 'appliances',
    icon: <Tv className="w-6 h-6 text-blue-600" />,
    bg: 'bg-blue-50',
  },
  {
    name: 'Computing',
    slug: 'computing',
    icon: <Laptop className="w-6 h-6 text-indigo-600" />,
    bg: 'bg-indigo-50',
  },
  {
    name: 'Electronics',
    slug: 'electronics',
    icon: <Speaker className="w-6 h-6 text-emerald-600" />,
    bg: 'bg-emerald-50',
  },
  {
    name: 'Health & Beauty',
    slug: 'health-beauty',
    icon: <Sparkles className="w-6 h-6 text-pink-600" />,
    bg: 'bg-pink-50',
  },
  {
    name: 'Fashion',
    slug: 'fashion',
    icon: <Shirt className="w-6 h-6 text-amber-600" />,
    bg: 'bg-amber-50',
  },
  {
    name: 'Supermarket',
    slug: 'supermarket',
    icon: <ShoppingBag className="w-6 h-6 text-red-600" />,
    bg: 'bg-red-50',
  },
  {
    name: 'Home & Office',
    slug: 'home-office',
    icon: <Home className="w-6 h-6 text-cyan-600" />,
    bg: 'bg-cyan-50',
  },
];

export default function CategoryStrip() {
  const { setSelectedCategory, setCurrentView } = useApp();

  const handleCategoryClick = (slug: string) => {
    setSelectedCategory(slug);
    setCurrentView('catalog');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-3">
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between overflow-x-auto no-scrollbar gap-4 md:gap-6">
          {CATEGORY_ITEMS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleCategoryClick(item.slug)}
              className="flex flex-col items-center gap-2 group min-w-[76px] sm:min-w-[90px] focus:outline-none"
            >
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full ${item.bg} flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm border border-gray-100`}
              >
                {item.icon}
              </div>
              <span className="text-[11px] sm:text-xs font-medium text-gray-700 text-center leading-tight group-hover:text-[#f68b1e] transition-colors line-clamp-2">
                {item.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
