import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-16 md:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-lg shadow-xl border text-xs font-medium transition-all animate-in fade-in slide-in-from-bottom-2 ${
            toast.type === 'success'
              ? 'bg-[#282828] text-white border-gray-700'
              : toast.type === 'error'
              ? 'bg-red-600 text-white border-red-700'
              : 'bg-white text-gray-800 border-gray-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {toast.type === 'success' && (
              <CheckCircle2 className="w-4 h-4 text-[#f68b1e] shrink-0" />
            )}
            {toast.type === 'error' && (
              <AlertCircle className="w-4 h-4 text-white shrink-0" />
            )}
            {toast.type === 'info' && (
              <Info className="w-4 h-4 text-[#0b4c8c] shrink-0" />
            )}
            <span className="leading-tight">{toast.message}</span>
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 rounded hover:opacity-75 shrink-0 ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
