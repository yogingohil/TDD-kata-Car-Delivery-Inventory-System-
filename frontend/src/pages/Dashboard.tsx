import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { purchaseService, apiClient } from '../services/api.js';
import { useAuthStore } from '../store/authStore.js';
import { useCurrency } from '../context/CurrencyContext.js';
import { downloadPdfInvoice } from '../utils/pdfGenerator.js';
import { OrderTrackingModal } from '../components/OrderTrackingModal.js';
import { IPurchase } from '../types/index.js';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { formatPrice } = useCurrency();
  const [trackingOrder, setTrackingOrder] = useState<IPurchase | null>(null);

  const { data: purchases, isLoading: purchasesLoading } = useQuery({
    queryKey: ['myPurchases'],
    queryFn: () => purchaseService.getUserPurchases(),
  });

  const { data: testDrives, isLoading: testDrivesLoading } = useQuery({
    queryKey: ['myTestDrives'],
    queryFn: async () => {
      const res = await apiClient.get('/test-drives/my');
      return res.data.data;
    },
  });

  const userPurchases = purchases?.data || [];
  const totalSpent = userPurchases.reduce((acc, p) => acc + (p.totalPrice || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Customer Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-cyan-950/80 via-slate-900 to-indigo-950/80 border border-slate-800 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            VIP Customer Garage Portal
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-1">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track vehicle deliveries in real time, view PDF invoices, and manage test drive appointments.
          </p>
        </div>

        <Link
          to="/inventory"
          className="px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl shadow-lg hover:from-cyan-400 transition-all"
        >
          Browse Inventory →
        </Link>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <span className="text-xs font-semibold text-slate-400 block">Garage Vehicles</span>
          <span className="text-3xl font-black text-white mt-2 block">
            {userPurchases.length} Units
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <span className="text-xs font-semibold text-slate-400 block">Total Invested</span>
          <span className="text-2xl font-black text-cyan-400 mt-2 block">
            {formatPrice(totalSpent)}
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <span className="text-xs font-semibold text-slate-400 block">Active Deliveries</span>
          <span className="text-3xl font-black text-emerald-400 mt-2 block">
            {userPurchases.length > 0 ? '1 In Transit' : '0 Active'}
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <span className="text-xs font-semibold text-slate-400 block">Test Drives Booked</span>
          <span className="text-3xl font-black text-indigo-400 mt-2 block">
            {testDrives?.length || 0}
          </span>
        </div>
      </div>

      {/* Purchases & Order Tracking Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Garage Orders & Live Tracking
          </h2>
        </div>

        {purchasesLoading ? (
          <div className="p-8 text-center text-slate-400">Loading purchase records...</div>
        ) : userPurchases.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 space-y-3">
            <div className="text-3xl">🛒</div>
            <p className="text-slate-300 font-semibold">Your garage is empty</p>
            <p className="text-xs text-slate-500">
              Explore our inventory catalog to place your first vehicle order.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-xl">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-xs uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Vehicle Description</th>
                  <th className="px-6 py-4">VIN</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4">Total Paid</th>
                  <th className="px-6 py-4">Order Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {userPurchases.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-white">
                      {p.vehicleId ? `${p.vehicleId.make} ${p.vehicleId.model}` : 'Vehicle'}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">
                      {p.vehicleId?.vin || 'N/A'}
                    </td>
                    <td className="px-6 py-4 font-semibold">{p.quantity}</td>
                    <td className="px-6 py-4 font-extrabold text-cyan-400">
                      {formatPrice(p.totalPrice || 0)}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {new Date(p.purchasedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => setTrackingOrder(p)}
                        className="px-3 py-1.5 text-xs font-bold rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20"
                      >
                        🚚 Track Delivery
                      </button>
                      <button
                        onClick={() => downloadPdfInvoice(p)}
                        className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700"
                      >
                        📄 PDF Invoice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Booked Test Drives Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Booked Test Drive Appointments
        </h2>

        {testDrivesLoading ? (
          <div className="p-6 text-center text-slate-400">Loading appointments...</div>
        ) : !testDrives || testDrives.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-xs text-slate-400">
            No test drives scheduled yet. Visit any vehicle details page to book a test drive!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testDrives.map((td: any) => (
              <div key={td._id} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-white">
                    {td.vehicleId?.make} {td.vehicleId?.model}
                  </h4>
                  <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-md bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    {td.status}
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  <span>📅 Date: {td.preferredDate} ({td.preferredTimeSlot})</span>
                </div>
                <div className="text-xs text-slate-400">
                  <span>📍 Experience Type: {td.type}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Delivery Tracker Modal */}
      {trackingOrder && (
        <OrderTrackingModal
          purchase={trackingOrder}
          isOpen={!!trackingOrder}
          onClose={() => setTrackingOrder(null)}
        />
      )}
    </div>
  );
};
