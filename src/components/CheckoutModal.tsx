import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NIGERIAN_STATES_LGAS } from '../data/mockData';
import { DeliveryAddress } from '../types';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  MapPin,
  CheckCircle2,
  ChevronLeft,
  ArrowRight,
  Plus,
  Building,
} from 'lucide-react';

export default function CheckoutModal() {
  const {
    cart,
    cartSubtotal,
    couponDiscount,
    user,
    addDeliveryAddress,
    placeOrder,
    formatNaira,
    setCurrentView,
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Address state
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    user.addresses[0]?.id || ''
  );
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [newFullName, setNewFullName] = useState(user.name);
  const [newPhone, setNewPhone] = useState(user.phone);
  const [newStreet, setNewStreet] = useState('');
  const [newState, setNewState] = useState('Lagos');
  const [newLGA, setNewLGA] = useState('Ikeja');

  // Delivery method
  const [deliveryMethod, setDeliveryMethod] = useState<'door' | 'pickup'>('door');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'jumiapay' | 'card' | 'bank_transfer' | 'cod'>('jumiapay');

  const selectedAddress = user.addresses.find((a) => a.id === selectedAddressId) || user.addresses[0];

  const deliveryFee = deliveryMethod === 'door' ? 1200 : 500;
  const effectiveDiscount = Math.min(couponDiscount, cartSubtotal);
  const finalTotal = Math.max(0, cartSubtotal + deliveryFee - effectiveDiscount);

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet.trim() || !newFullName.trim() || !newPhone.trim()) return;

    addDeliveryAddress({
      fullName: newFullName,
      phone: newPhone,
      address: newStreet,
      state: newState,
      cityLGA: newLGA,
      isDefault: false,
    });
    setIsAddingNewAddress(false);
  };

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const handleCompleteOrder = async () => {
    if (!selectedAddress) {
      setStep(1);
      return;
    }
    setIsPlacingOrder(true);
    try {
      await placeOrder({
        address: selectedAddress,
        deliveryMethod,
        paymentMethod,
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-gray-900">Your cart is empty</h2>
        <button
          onClick={() => setCurrentView('catalog')}
          className="mt-4 px-6 py-2.5 bg-[#f68b1e] text-white font-bold text-xs rounded uppercase"
        >
          Return to Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('cart')}
            className="p-1 rounded text-gray-500 hover:text-gray-900 hover:bg-gray-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
            JUMIA Checkout
          </h1>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className={`px-2.5 py-1 rounded ${step === 1 ? 'bg-[#f68b1e] text-white' : 'bg-gray-100 text-gray-600'}`}>
            1. Address
          </span>
          <span className="text-gray-300">/</span>
          <span className={`px-2.5 py-1 rounded ${step === 2 ? 'bg-[#f68b1e] text-white' : 'bg-gray-100 text-gray-600'}`}>
            2. Delivery
          </span>
          <span className="text-gray-300">/</span>
          <span className={`px-2.5 py-1 rounded ${step === 3 ? 'bg-[#f68b1e] text-white' : 'bg-gray-100 text-gray-600'}`}>
            3. Payment
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Step Content Column (col-span-8) */}
        <div className="lg:col-span-8 space-y-4">
          {/* STEP 1: Address */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#f68b1e]" />
                <h2 className="text-sm font-bold text-gray-900 uppercase">
                  1. Delivery Address
                </h2>
              </div>
              {step !== 1 && (
                <button
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-[#f68b1e] hover:underline"
                >
                  Change
                </button>
              )}
            </div>

            {step === 1 ? (
              <div className="p-5 space-y-4">
                <p className="text-xs text-gray-500">
                  Select where you want your order delivered or add a new address in Nigeria:
                </p>

                {/* Address Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {user.addresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                        selectedAddressId === addr.id
                          ? 'border-[#f68b1e] bg-orange-50/40 ring-1 ring-[#f68b1e]'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-xs text-gray-900">{addr.fullName}</span>
                        {selectedAddressId === addr.id && (
                          <CheckCircle2 className="w-4 h-4 text-[#f68b1e]" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{addr.address}</p>
                      <p className="text-xs text-gray-500 mt-0.5 font-medium">
                        {addr.cityLGA}, {addr.state}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{addr.phone}</p>
                    </div>
                  ))}
                </div>

                {/* Add New Address Form Toggle */}
                {!isAddingNewAddress ? (
                  <button
                    onClick={() => setIsAddingNewAddress(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#f68b1e] hover:underline pt-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Delivery Address</span>
                  </button>
                ) : (
                  <form onSubmit={handleSaveNewAddress} className="mt-4 p-4 border border-dashed border-orange-200 rounded-lg bg-orange-50/20 space-y-3">
                    <h3 className="text-xs font-bold text-gray-900 uppercase">New Address Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-gray-600 mb-1">Full Name</label>
                        <input
                          type="text"
                          value={newFullName}
                          onChange={(e) => setNewFullName(e.target.value)}
                          className="w-full text-xs border border-gray-300 rounded p-2"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-gray-600 mb-1">Phone Number (Nigeria)</label>
                        <input
                          type="text"
                          value={newPhone}
                          onChange={(e) => setNewPhone(e.target.value)}
                          placeholder="e.g. 0803 123 4567"
                          className="w-full text-xs border border-gray-300 rounded p-2"
                          required
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] text-gray-600 mb-1">Street Address / House No.</label>
                        <input
                          type="text"
                          value={newStreet}
                          onChange={(e) => setNewStreet(e.target.value)}
                          placeholder="e.g. 15 Admiralty Way, Lekki"
                          className="w-full text-xs border border-gray-300 rounded p-2"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-gray-600 mb-1">State</label>
                        <select
                          value={newState}
                          onChange={(e) => {
                            const st = e.target.value;
                            setNewState(st);
                            setNewLGA(NIGERIAN_STATES_LGAS[st]?.[0] || '');
                          }}
                          className="w-full text-xs border border-gray-300 rounded p-2"
                        >
                          {Object.keys(NIGERIAN_STATES_LGAS).map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] text-gray-600 mb-1">City / LGA</label>
                        <select
                          value={newLGA}
                          onChange={(e) => setNewLGA(e.target.value)}
                          className="w-full text-xs border border-gray-300 rounded p-2"
                        >
                          {(NIGERIAN_STATES_LGAS[newState] || []).map((lga) => (
                            <option key={lga} value={lga}>{lga}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingNewAddress(false)}
                        className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-[#f68b1e] text-white text-xs font-bold rounded uppercase"
                      >
                        Save Address
                      </button>
                    </div>
                  </form>
                )}

                <div className="pt-3">
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-2.5 bg-[#f68b1e] hover:bg-[#e07b14] text-white font-bold text-xs rounded uppercase flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Proceed to Delivery Method</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              selectedAddress && (
                <div className="p-4 text-xs text-gray-700">
                  <span className="font-bold text-gray-900">{selectedAddress.fullName}</span> ·{' '}
                  {selectedAddress.address}, {selectedAddress.cityLGA}, {selectedAddress.state} ({selectedAddress.phone})
                </div>
              )
            )}
          </div>

          {/* STEP 2: Delivery Method */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#f68b1e]" />
                <h2 className="text-sm font-bold text-gray-900 uppercase">
                  2. Delivery Method
                </h2>
              </div>
              {step > 2 && (
                <button
                  onClick={() => setStep(2)}
                  className="text-xs font-bold text-[#f68b1e] hover:underline"
                >
                  Change
                </button>
              )}
            </div>

            {step === 2 && (
              <div className="p-5 space-y-4">
                <div className="space-y-3">
                  <label
                    onClick={() => setDeliveryMethod('door')}
                    className={`block p-4 rounded-lg border cursor-pointer transition-all ${
                      deliveryMethod === 'door'
                        ? 'border-[#f68b1e] bg-orange-50/40 ring-1 ring-[#f68b1e]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Truck className="w-5 h-5 text-[#f68b1e]" />
                        <div>
                          <p className="text-xs font-bold text-gray-900">Door Delivery</p>
                          <p className="text-[11px] text-gray-500">
                            Delivered directly to your door via Jumia Express within 24-48 hours.
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-gray-900">₦1,200</span>
                    </div>
                  </label>

                  <label
                    onClick={() => setDeliveryMethod('pickup')}
                    className={`block p-4 rounded-lg border cursor-pointer transition-all ${
                      deliveryMethod === 'pickup'
                        ? 'border-[#f68b1e] bg-orange-50/40 ring-1 ring-[#f68b1e]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Building className="w-5 h-5 text-[#0b4c8c]" />
                        <div>
                          <p className="text-xs font-bold text-gray-900">Pickup Station</p>
                          <p className="text-[11px] text-gray-500">
                            Pick up at your nearest Jumia Station in {selectedAddress?.cityLGA || 'Lagos'}.
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-emerald-600">₦500</span>
                    </div>
                  </label>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 text-xs font-bold rounded uppercase"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="px-6 py-2.5 bg-[#f68b1e] hover:bg-[#e07b14] text-white font-bold text-xs rounded uppercase flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Proceed to Payment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {step > 2 && (
              <div className="p-4 text-xs text-gray-700 flex justify-between items-center">
                <span>
                  <strong>{deliveryMethod === 'door' ? 'Door Delivery' : 'Pickup Station'}</strong> · Delivery within 24–48 hours
                </span>
                <span className="font-bold text-gray-900">{formatNaira(deliveryFee)}</span>
              </div>
            )}
          </div>

          {/* STEP 3: Payment Method */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#f68b1e]" />
              <h2 className="text-sm font-bold text-gray-900 uppercase">
                3. Payment Method
              </h2>
            </div>

            {step === 3 && (
              <div className="p-5 space-y-4">
                <p className="text-xs text-gray-500">
                  Select your preferred secure payment method:
                </p>

                <div className="space-y-3">
                  {/* JumiaPay */}
                  <label
                    onClick={() => setPaymentMethod('jumiapay')}
                    className={`block p-4 rounded-lg border cursor-pointer transition-all ${
                      paymentMethod === 'jumiapay'
                        ? 'border-[#f68b1e] bg-orange-50/40 ring-1 ring-[#f68b1e]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-[#282828] text-white text-[10px] font-black px-2 py-1 rounded">
                          <span className="text-[#f68b1e]">JUMIA</span>PAY
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900">
                            JumiaPay (Fast, Secure & Instant Confirmation)
                          </p>
                          <p className="text-[11px] text-gray-500">
                            Pay with linked bank account, wallet, or saved cards.
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                        Recommended
                      </span>
                    </div>
                  </label>

                  {/* Card Payment */}
                  <label
                    onClick={() => setPaymentMethod('card')}
                    className={`block p-4 rounded-lg border cursor-pointer transition-all ${
                      paymentMethod === 'card'
                        ? 'border-[#f68b1e] bg-orange-50/40 ring-1 ring-[#f68b1e]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-gray-700" />
                        <div>
                          <p className="text-xs font-bold text-gray-900">
                            Debit / Credit Card (Mastercard, Visa, Verve)
                          </p>
                          <p className="text-[11px] text-gray-500">
                            Safe and encrypted via 3D-Secure Nigerian payment gateway.
                          </p>
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* Bank Transfer */}
                  <label
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`block p-4 rounded-lg border cursor-pointer transition-all ${
                      paymentMethod === 'bank_transfer'
                        ? 'border-[#f68b1e] bg-orange-50/40 ring-1 ring-[#f68b1e]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Building className="w-5 h-5 text-blue-700" />
                        <div>
                          <p className="text-xs font-bold text-gray-900">Bank Transfer</p>
                          <p className="text-[11px] text-gray-500">
                            Transfer directly to Jumia dynamic dedicated account.
                          </p>
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label
                    onClick={() => setPaymentMethod('cod')}
                    className={`block p-4 rounded-lg border cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-[#f68b1e] bg-orange-50/40 ring-1 ring-[#f68b1e]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Truck className="w-5 h-5 text-emerald-700" />
                        <div>
                          <p className="text-xs font-bold text-gray-900">Pay on Delivery</p>
                          <p className="text-[11px] text-gray-500">
                            Pay with card or cash to the dispatch rider upon inspection.
                          </p>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 text-xs font-bold rounded uppercase"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleCompleteOrder}
                    disabled={isPlacingOrder}
                    className="flex-1 py-3 bg-[#f68b1e] hover:bg-[#e07b14] active:bg-[#c96a0f] disabled:opacity-50 text-white font-extrabold text-sm uppercase rounded shadow-lg flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
                  >
                    <ShieldCheck className="w-5 h-5" />
                    <span>
                      {isPlacingOrder
                        ? 'Saving Order to Firestore...'
                        : `CONFIRM & PAY ${formatNaira(finalTotal)}`}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary Sidebar (col-span-4) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900 pb-3 border-b border-gray-100">
              ORDER SUMMARY
            </h2>

            {/* Items miniature list */}
            <div className="py-3 max-h-56 overflow-y-auto space-y-2.5 divide-y divide-gray-50 text-xs">
              {cart.map((item) => (
                <div key={item.product.id} className="pt-2 flex items-center justify-between gap-2">
                  <div className="truncate flex-1">
                    <p className="font-medium text-gray-800 truncate">{item.product.title}</p>
                    <p className="text-[10px] text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-bold text-gray-900 tabular-nums">
                    {formatNaira(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="pt-3 border-t border-gray-100 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Items Subtotal</span>
                <span className="font-bold text-gray-900 tabular-nums">{formatNaira(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span className="font-bold text-gray-900 tabular-nums">{formatNaira(deliveryFee)}</span>
              </div>
              {effectiveDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span className="tabular-nums">-{formatNaira(effectiveDiscount)}</span>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
              <span className="text-sm font-bold text-gray-900">Total to Pay</span>
              <span className="text-xl font-black text-gray-900 tabular-nums">
                {formatNaira(finalTotal)}
              </span>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-400 space-y-1">
              <p>✔ Free returns within 7 days for eligible items.</p>
              <p>✔ Genuine products directly from verified sellers.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
