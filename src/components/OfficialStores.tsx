import React from 'react';
import { useApp } from '../context/AppContext';
import { OFFICIAL_BRANDS } from '../data/mockData';
import { ShieldCheck, ChevronRight } from 'lucide-react';

export default function OfficialStores() {
  const { setSearchQuery, setCurrentView } = useApp();

  const handleBrandClick = (brandName: string) => {
    setSearchQuery(brandName);
    setCurrentView('catalog');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-3">
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#0b4c8c]" />
            <h3 className="text-sm sm:text-base font-extrabold text-gray-900 tracking-tight">
              OFFICIAL STORES
            </h3>
            <span className="text-xs text-gray-400 font-normal hidden sm:inline">
              · 100% Authentic Warrantied Products
            </span>
          </div>

          <button
            onClick={() => {
              setSearchQuery('');
              setCurrentView('catalog');
            }}
            className="text-xs font-bold text-[#f68b1e] hover:underline flex items-center gap-0.5"
          >
            <span>See All Stores</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {OFFICIAL_BRANDS.map((brand, idx) => (
            <button
              key={idx}
              onClick={() => handleBrandClick(brand.name)}
              className="group p-3 rounded-lg border border-gray-100 hover:border-[#f68b1e] hover:shadow-sm bg-gray-50/70 hover:bg-white transition-all flex flex-col items-center justify-center text-center"
            >
              <span className="text-xs font-black tracking-wider text-gray-800 uppercase group-hover:text-[#f68b1e] transition-colors py-1">
                {brand.logo}
              </span>
              <span className="text-[10px] text-gray-500 font-medium mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                Official Store
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
