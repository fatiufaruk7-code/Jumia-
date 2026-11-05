import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Package, Truck, ArrowRight, Printer, MapPin } from 'lucide-react';

export default function OrderSuccessModal() {
  const { activeOrder, formatNaira, setCurrentView } = useApp();

  if (!activeOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold">No active order found</h2>
        <button
          onClick={() => setCurrentView('home')}
          className="mt-4 px-6 py-2 bg-[#f68b1e] text-white text-xs font-bold rounded uppercase"
        >
          Go to Homepage
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white rounded-xl border border-gray-100 shadow-md overflow-hidden">
        {/* Success Header */}
        <div className="bg-[#f68b1e] text-white p-6 sm:p-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-xs">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Order Confirmed!
          </h1>
          <p className="text-xs sm:text-sm text-orange-100 mt-1">
            Thank you for shopping with JUMIA. We have received your order.
          </p>
          <div className="mt-3 inline-block bg-black/20 px-3 py-1 rounded text-xs font-mono font-bold">
            Order Reference: {activeOrder.id}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Tracking Step Indicator */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 mb-4 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#f68b1e]" />
              <span>Delivery Status Timeline</span>
            </h3>

            <div className="space-y-4 relative pl-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
              {activeOrder.trackingSteps.map((step, idx) => (
                <div key={idx} className="relative">
                  <div
                    className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                      step.completed
                        ? 'border-[#f68b1e] bg-[#f68b1e]'
                        : 'border-gray-300'
                    }`}
                  >
                    {step.completed && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <p className={`text-xs font-bold ${step.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                        {step.title}
                      </p>
                      {step.timestamp && (
                        <span className="text-[10px] text-gray-400">{step.timestamp}</span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery & Items Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-xs font-bold text-gray-800 uppercase mb-2 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#f68b1e]" />
                <span>Delivery Address</span>
              </h4>
              <p className="text-xs font-semibold text-gray-900">{activeOrder.deliveryAddress.fullName}</p>
              <p className="text-xs text-gray-600 mt-0.5">{activeOrder.deliveryAddress.address}</p>
              <p className="text-xs text-gray-600">{activeOrder.deliveryAddress.cityLGA}, {activeOrder.deliveryAddress.state}</p>
              <p className="text-xs text-gray-500 mt-1">{activeOrder.deliveryAddress.phone}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-xs font-bold text-gray-800 uppercase mb-2 flex items-center gap-1">
                <Package className="w-3.5 h-3.5 text-[#f68b1e]" />
                <span>Order Summary</span>
              </h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Items count:</span>
                  <span className="font-semibold">{activeOrder.items.length} item(s)</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Payment Method:</span>
                  <span className="font-semibold uppercase">{activeOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-gray-900 font-bold pt-1 border-t border-gray-200">
                  <span>Total Paid:</span>
                  <span className="text-sm font-extrabold text-[#f68b1e]">{formatNaira(activeOrder.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={() => setCurrentView('customer-dashboard')}
              className="flex-1 py-3 bg-[#282828] hover:bg-black text-white text-xs font-bold rounded uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <span>View in My Orders</span>
            </button>
            <button
              onClick={() => setCurrentView('home')}
              className="flex-1 py-3 bg-[#f68b1e] hover:bg-[#e07b14] text-white text-xs font-bold rounded uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
