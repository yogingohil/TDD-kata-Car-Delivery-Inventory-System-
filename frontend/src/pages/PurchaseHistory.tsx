import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { purchaseService } from '../services/api.js';

export const PurchaseHistory: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['purchaseHistory'],
    queryFn: () => purchaseService.getUserPurchases(),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Purchase History & Receipts
        </h1>
        <p className="text-sm text-slate-400">
          All verified transactions and delivery receipts for your account
        </p>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-slate-400">Loading purchase records...</div>
      ) : data?.data?.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 space-y-2">
          <p className="text-slate-300 font-semibold">No purchase history found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data?.data?.map((p) => (
            <div
              key={p._id}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-4 shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-semibold text-slate-400">
                  Order #{p._id.substring(18)}
                </span>
                <span className="px-2.5 py-1 text-[11px] font-bold uppercase rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Completed
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {p.vehicleId ? `${p.vehicleId.make} ${p.vehicleId.model}` : 'Vehicle'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Quantity: {p.quantity} unit(s)
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Total Amount</span>
                  <span className="text-xl font-extrabold text-cyan-400">
                    ${p.totalPrice?.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-500 pt-2 border-t border-slate-800/60 flex justify-between">
                <span>Date: {new Date(p.purchasedAt).toLocaleString()}</span>
                <span>Delivery Status: Scheduled 🚚</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
