import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  X,
  Lock,
  Mail,
  User,
  Phone,
  Store,
  ShieldCheck,
  CheckCircle2,
  Database,
} from 'lucide-react';

export default function AuthModal() {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalTab,
    setAuthModalTab,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    switchRole,
    addToast,
    user,
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      if (authModalTab === 'login') {
        await loginWithEmail(email, password, selectedRole);
      } else {
        await registerWithEmail(email, password, name, phone, selectedRole);
      }
    } catch (err: any) {
      addToast(err?.message || 'Authentication error', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemoLogin = (role: 'customer' | 'seller' | 'admin') => {
    switchRole(role);
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity"
        onClick={() => setIsAuthModalOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden z-10 border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Brand Header */}
        <div className="bg-[#f68b1e] p-5 text-white text-center relative">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center justify-center gap-1">
            <span className="text-3xl font-extrabold tracking-tight brand-font">
              JUMIA
            </span>
            <span className="text-xl font-black">★</span>
          </div>
          <p className="text-xs text-orange-100 mt-1">
            {authModalTab === 'login'
              ? 'Sign in to access your orders, wishlist, and wallet'
              : 'Create your account and start shopping or selling on JUMIA'}
          </p>

          {/* Firebase Connection indicator */}
          <div className="mt-2 inline-flex items-center gap-1.5 bg-black/25 text-white text-[10px] font-mono px-2.5 py-0.5 rounded-full">
            <Database className="w-3 h-3 text-emerald-400" />
            <span>Firebase: jumia-34b8b</span>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-2 border-b border-gray-200 text-xs font-bold uppercase">
          <button
            onClick={() => setAuthModalTab('login')}
            className={`py-3 text-center transition-colors ${
              authModalTab === 'login'
                ? 'border-b-2 border-[#f68b1e] text-[#f68b1e]'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setAuthModalTab('register')}
            className={`py-3 text-center transition-colors ${
              authModalTab === 'register'
                ? 'border-b-2 border-[#f68b1e] text-[#f68b1e]'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Registration
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={loginWithGoogle}
            className="w-full py-2.5 px-4 bg-white hover:bg-gray-50 border border-gray-300 rounded text-xs font-bold text-gray-700 shadow-2xs flex items-center justify-center gap-2.5 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="flex items-center gap-2 my-2">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-[11px] text-gray-400 uppercase font-semibold">Or with email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            {authModalTab === 'register' && (
              <>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Faruk Bello"
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#f68b1e]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Account Role</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRole('customer')}
                      className={`py-1.5 px-2 rounded border text-xs font-semibold ${
                        selectedRole === 'customer'
                          ? 'border-[#f68b1e] bg-orange-50 text-[#f68b1e]'
                          : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      Customer (Shopper)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRole('seller')}
                      className={`py-1.5 px-2 rounded border text-xs font-semibold ${
                        selectedRole === 'seller'
                          ? 'border-[#f68b1e] bg-orange-50 text-[#f68b1e]'
                          : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      Seller (Merchant)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Phone Number (Nigeria)</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 0803 123 4567"
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#f68b1e]"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-gray-700 font-semibold mb-1">E-mail Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#f68b1e]"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-gray-700 font-semibold">Password</label>
                {authModalTab === 'login' && (
                  <button
                    type="button"
                    onClick={() => addToast('Password reset link sent to your email!', 'info')}
                    className="text-[11px] text-[#f68b1e] hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#f68b1e]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-[#f68b1e] hover:bg-[#e07b14] disabled:opacity-50 text-white font-extrabold text-xs uppercase rounded shadow-sm transition-colors mt-2"
            >
              {isSubmitting
                ? 'Processing...'
                : authModalTab === 'login'
                ? 'Sign In to JUMIA'
                : 'Create My JUMIA Account'}
            </button>
          </form>

          {/* Quick Demo Switchers */}
          <div className="bg-orange-50/60 border border-orange-100 rounded-lg p-3 pt-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
              1-Click Demo Profiles (Connected to Firestore):
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('customer')}
                className="py-1.5 px-2 bg-white hover:bg-orange-100/60 border border-orange-200 rounded text-[11px] font-semibold text-gray-800 flex flex-col items-center justify-center gap-0.5 shadow-2xs"
              >
                <User className="w-3.5 h-3.5 text-[#f68b1e]" />
                <span>Customer</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('seller')}
                className="py-1.5 px-2 bg-white hover:bg-orange-100/60 border border-orange-200 rounded text-[11px] font-semibold text-gray-800 flex flex-col items-center justify-center gap-0.5 shadow-2xs"
              >
                <Store className="w-3.5 h-3.5 text-blue-600" />
                <span>Seller Center</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                className="py-1.5 px-2 bg-white hover:bg-orange-100/60 border border-orange-200 rounded text-[11px] font-semibold text-gray-800 flex flex-col items-center justify-center gap-0.5 shadow-2xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          <p className="text-[10px] text-gray-400 text-center leading-normal">
            By continuing, you agree to JUMIA’s Terms & Conditions and Privacy Notice.
          </p>
        </div>
      </div>
    </div>
  );
}
