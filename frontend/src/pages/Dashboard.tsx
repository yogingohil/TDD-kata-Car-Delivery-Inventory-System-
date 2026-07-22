import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { purchaseService } from '../services/api.js';
import { useAuthStore } from '../store/authStore.js';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();

  const { data: purchases, isLoading } = useQuery({
    queryKey: ['myPurchases'],
    queryFn: () => purchaseService.getUserPurchases(),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="p-8 rounded-3xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-indigo-950/60 border border-slate-800 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            Customer Portal
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-1">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your garage, view order receipts, and discover new inventory.
          </p>
        </div>

        <Link
          to="/inventory"
          className="px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl shadow-lg hover:from-cyan-400 hover:to-blue-500 transition-all"
        >
          Browse Vehicles →
        </Link>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Recent Purchase History
        </h2>

        {isLoading ? (
          <div className="p-8 text-center text-slate-400">Loading purchase history...</div>
        ) : purchases?.data?.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 space-y-3">
            <div className="text-3xl">🛒</div>
            <p className="text-slate-300 font-semibold">No purchases yet</p>
            <p className="text-xs text-slate-500">
              Explore our inventory catalog to place your first vehicle order.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-xl">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-xs uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Vehicle</th>
                  <th className="px-6 py-4">VIN</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4">Total Paid</th>
                  <th className="px-6 py-4">Order Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {purchases?.data?.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-white">
                      {p.vehicleId ? `${p.vehicleId.make} ${p.vehicleId.model}` : 'Vehicle'}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">
                      {p.vehicleId?.vin || 'N/A'}
                    </td>
                    <td className="px-6 py-4 font-semibold">{p.quantity}</td>
                    <td className="px-6 py-4 font-extrabold text-cyan-400">
                      ${p.totalPrice?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {new Date(p.purchasedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
