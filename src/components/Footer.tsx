import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Smartphone, ShieldCheck, CreditCard, ChevronRight } from 'lucide-react';

export default function Footer() {
  const { switchRole, addToast } = useApp();
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleSubscribe = (gender: 'male' | 'female') => {
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      addToast('Please enter a valid email address', 'error');
      return;
    }
    addToast(`Subscribed! Your ₦1,000 JUMIA voucher code is "JUMIA1000"`, 'success');
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-[#282828] text-white pt-10 pb-20 md:pb-12 text-xs font-sans mt-12 border-t-4 border-[#f68b1e]">
      {/* Newsletter & App Download Strip */}
      <div className="max-w-7xl mx-auto px-4 pb-10 border-b border-gray-700">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Logo & Intro */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-1 mb-1">
              <span className="text-3xl font-extrabold tracking-tight text-white brand-font">
                JUMIA
              </span>
              <span className="text-[#f68b1e] text-2xl font-black">★</span>
            </div>
            <p className="text-xs text-gray-400">
              Nigeria’s Number 1 Online Shopping Mall. Fast delivery, 100% genuine products, and secure checkout.
            </p>
          </div>

          {/* Newsletter Box */}
          <div className="lg:col-span-5">
            <h3 className="font-bold uppercase tracking-wider text-sm mb-1 text-white">
              NEW TO JUMIA?
            </h3>
            <p className="text-xs text-gray-400 mb-2">
              Subscribe to our newsletter to get updates on our latest offers and receive a ₦1,000 voucher!
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter E-mail Address"
                  className="w-full bg-[#3d3d3d] border border-gray-600 rounded pl-9 pr-3 py-2 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#f68b1e]"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleSubscribe('male')}
                  className="px-3 py-2 bg-[#f68b1e] hover:bg-[#e07b14] text-white font-bold text-[11px] uppercase rounded transition-colors"
                >
                  Male
                </button>
                <button
                  type="button"
                  onClick={() => handleSubscribe('female')}
                  className="px-3 py-2 bg-[#f68b1e] hover:bg-[#e07b14] text-white font-bold text-[11px] uppercase rounded transition-colors"
                >
                  Female
                </button>
              </div>
            </div>
          </div>

          {/* App Download */}
          <div className="lg:col-span-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-[#f68b1e] text-white flex items-center justify-center shrink-0">
              <Smartphone className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-white">
                DOWNLOAD JUMIA FREE APP
              </h4>
              <p className="text-[11px] text-gray-400">Get access to exclusive mobile app only discounts</p>
              <div className="flex gap-2 mt-1.5">
                <span className="bg-black/50 border border-gray-700 px-2 py-0.5 rounded text-[10px] text-gray-300">
                  Google Play
                </span>
                <span className="bg-black/50 border border-gray-700 px-2 py-0.5 rounded text-[10px] text-gray-300">
                  App Store
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Links Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8 border-b border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              NEED HELP?
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><a href="#chat" className="hover:text-[#f68b1e]">Chat with Us</a></li>
              <li><a href="#help-center" className="hover:text-[#f68b1e]">Help Center & FAQs</a></li>
              <li><a href="#contact" className="hover:text-[#f68b1e]">Contact Us (0700 600 0000)</a></li>
              <li><a href="#track" className="hover:text-[#f68b1e]">Track Your Order</a></li>
              <li><a href="#dispute" className="hover:text-[#f68b1e]">Dispute Resolution</a></li>
              <li><a href="#returns" className="hover:text-[#f68b1e]">Returns & Refunds</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              ABOUT JUMIA
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><a href="#about" className="hover:text-[#f68b1e]">About Us</a></li>
              <li><a href="#careers" className="hover:text-[#f68b1e]">Jumia Careers</a></li>
              <li><a href="#express" className="hover:text-[#f68b1e]">Jumia Express</a></li>
              <li><a href="#terms" className="hover:text-[#f68b1e]">Terms & Conditions</a></li>
              <li><a href="#privacy" className="hover:text-[#f68b1e]">Privacy Notice</a></li>
              <li><a href="#techweek" className="hover:text-[#f68b1e]">Tech Week 2026</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              MAKE MONEY ON JUMIA
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <button
                  onClick={() => switchRole('seller')}
                  className="text-left text-[#f68b1e] hover:underline font-bold"
                >
                  Sell on JUMIA (Seller Center)
                </button>
              </li>
              <li><a href="#consultant" className="hover:text-[#f68b1e]">Become a Sales Consultant</a></li>
              <li><a href="#logistics" className="hover:text-[#f68b1e]">Jumia Logistics Partner</a></li>
              <li>
                <button
                  onClick={() => switchRole('admin')}
                  className="text-left hover:text-[#f68b1e]"
                >
                  JUMIA Admin Portal
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              JUMIA INTERNATIONAL
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
              <span className="text-[#f68b1e] font-bold">Nigeria 🇳🇬</span>
              <a href="#gh" className="hover:text-[#f68b1e]">Ghana 🇬🇭</a>
              <a href="#eg" className="hover:text-[#f68b1e]">Egypt 🇪🇬</a>
              <a href="#ke" className="hover:text-[#f68b1e]">Kenya 🇰🇪</a>
              <a href="#ci" className="hover:text-[#f68b1e]">Ivory Coast 🇨🇮</a>
              <a href="#ma" className="hover:text-[#f68b1e]">Morocco 🇲🇦</a>
              <a href="#sn" className="hover:text-[#f68b1e]">Senegal 🇸🇳</a>
              <a href="#ug" className="hover:text-[#f68b1e]">Uganda 🇺🇬</a>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Partners & Copyright */}
      <div className="max-w-7xl mx-auto px-4 pt-6 flex flex-col md:flex-row items-center justify-between text-gray-400 text-xs gap-4">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-gray-300">Accepted Payment Methods:</span>
          <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-gray-300">
            <span className="bg-[#383838] px-2 py-0.5 rounded">Mastercard</span>
            <span className="bg-[#383838] px-2 py-0.5 rounded">VISA</span>
            <span className="bg-[#383838] px-2 py-0.5 rounded">Verve</span>
            <span className="bg-[#383838] px-2 py-0.5 rounded text-[#f68b1e]">JumiaPay</span>
          </div>
        </div>

        <div>
          <p>© 2026 JUMIA. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
