import React from 'react';
import { useCompareStore } from '../store/compareStore.js';
import { useCurrency } from '../context/CurrencyContext.js';

export const CompareModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { vehicles, removeFromCompare, clearCompare } = useCompareStore();
  const { formatPrice } = useCurrency();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="max-w-5xl w-full p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 my-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Side-by-Side Vehicle Comparison</h2>
            <p className="text-xs text-slate-400">Comparing {vehicles.length} of 3 luxury vehicles</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={clearCompare}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              Clear All
            </button>
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-slate-800 text-white"
            >
              Close ✕
            </button>
          </div>
        </div>

        {vehicles.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <p className="text-lg font-semibold text-white">No vehicles added for comparison</p>
            <p className="text-xs">Click "+ Compare" on any vehicle card in the inventory catalog to add it here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {vehicles.map((v) => (
              <div
                key={v._id}
                className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-4 relative"
              >
                <button
                  onClick={() => removeFromCompare(v._id)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-rose-400 text-sm font-bold"
                >
                  ✕
                </button>

                <img
                  src={
                    v.image ||
                    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={v.model}
                  className="h-36 w-full object-cover rounded-xl border border-slate-800"
                />

                <h3 className="text-lg font-bold text-white">
                  {v.make} {v.model} ({v.year})
                </h3>

                <div className="text-xl font-extrabold text-cyan-400">
                  {formatPrice(v.price)}
                </div>

                <div className="space-y-2 text-xs text-slate-300 border-t border-slate-800/80 pt-3">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Category:</span>
                    <span className="font-semibold">{v.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Engine:</span>
                    <span className="font-semibold">{v.engineCapacity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Transmission:</span>
                    <span className="font-semibold">{v.transmission}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Fuel Type:</span>
                    <span className="font-semibold">{v.fuelType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Mileage:</span>
                    <span className="font-semibold">{v.mileage} miles</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Stock Availability:</span>
                    <span className="font-bold text-emerald-400">{v.quantity} units</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
