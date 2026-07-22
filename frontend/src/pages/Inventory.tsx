import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { vehicleService } from '../services/api.js';
import { VehicleCard } from '../components/VehicleCard.js';
import { SkeletonGrid } from '../components/SkeletonLoader.js';
import { IVehicle } from '../types/index.js';
import { useAuthStore } from '../store/authStore.js';
import { useUIStore } from '../store/uiStore.js';

export const Inventory: React.FC = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [make, setMake] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState<IVehicle | null>(null);
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [purchasing, setPurchasing] = useState(false);

  const { isAuthenticated } = useAuthStore();
  const { addToast } = useUIStore();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['vehicles', page, search, category, make, fuelType, sortBy, sortOrder],
    queryFn: () =>
      vehicleService.getVehicles({
        page,
        limit: 6,
        search,
        category,
        make,
        fuelType,
        sortBy,
        sortOrder,
      }),
  });

  const handlePurchase = async () => {
    if (!selectedVehicle) return;
    if (!isAuthenticated) {
      addToast('Please login to purchase a vehicle', 'error');
      return;
    }

    setPurchasing(true);
    try {
      await vehicleService.purchaseVehicle(selectedVehicle._id, purchaseQuantity);
      addToast(`Successfully purchased ${purchaseQuantity}x ${selectedVehicle.make} ${selectedVehicle.model}!`, 'success');
      setSelectedVehicle(null);
      refetch();
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Purchase failed', 'error');
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Inventory Catalog
          </h1>
          <p className="text-sm text-slate-400">
            Search, filter, and inspect luxury vehicles available in real-time
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Search</label>
          <input
            type="text"
            placeholder="Search make, model, VIN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="">All Categories</option>
            <option value="Sports">Sports</option>
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Wagon">Wagon</option>
            <option value="Electric">Electric</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Make</label>
          <select
            value={make}
            onChange={(e) => setMake(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="">All Makes</option>
            <option value="Porsche">Porsche</option>
            <option value="BMW">BMW</option>
            <option value="Audi">Audi</option>
            <option value="Mercedes-Benz">Mercedes-Benz</option>
            <option value="Ferrari">Ferrari</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Fuel Type</label>
          <select
            value={fuelType}
            onChange={(e) => setFuelType(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="">All Fuel Types</option>
            <option value="Gasoline">Gasoline</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Sort By</label>
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order as 'asc' | 'desc');
            }}
            className="w-full px-3.5 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="year-desc">Year: Newest</option>
          </select>
        </div>
      </div>

      {/* Grid Content */}
      {isLoading ? (
        <SkeletonGrid count={6} />
      ) : data?.data?.vehicles.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/20 rounded-3xl border border-slate-800 space-y-4">
          <div className="text-4xl">🚗</div>
          <h3 className="text-xl font-bold text-white">No vehicles found</h3>
          <p className="text-slate-400 text-sm">
            Try adjusting your search criteria or clearing filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.data?.vehicles.map((v) => (
            <VehicleCard
              key={v._id}
              vehicle={v}
              onPurchase={(vehicle) => setSelectedVehicle(vehicle)}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {data?.data && data.data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 text-sm font-semibold rounded-xl bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40"
          >
            ← Previous
          </button>
          <span className="text-sm font-semibold text-slate-400 px-3">
            Page {data.data.page} of {data.data.totalPages}
          </span>
          <button
            disabled={page === data.data.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 text-sm font-semibold rounded-xl bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      )}

      {/* Purchase Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="max-w-md w-full p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
            <h3 className="text-xl font-bold text-white">
              Confirm Purchase
            </h3>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="text-lg font-bold text-cyan-400">
                {selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.year})
              </div>
              <div className="text-xs text-slate-400">
                VIN: {selectedVehicle.vin}
              </div>
              <div className="text-sm font-semibold text-white">
                Price per unit: ${selectedVehicle.price.toLocaleString()}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Quantity (Available: {selectedVehicle.quantity})
              </label>
              <input
                type="number"
                min={1}
                max={selectedVehicle.quantity}
                value={purchaseQuantity}
                onChange={(e) => setPurchaseQuantity(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
              />
            </div>

            <div className="text-right text-lg font-extrabold text-white">
              Total Amount: ${(selectedVehicle.price * purchaseQuantity).toLocaleString()}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedVehicle(null)}
                className="flex-1 py-3 font-semibold rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                disabled={purchasing}
                onClick={handlePurchase}
                className="flex-1 py-3 font-bold rounded-xl text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25"
              >
                {purchasing ? 'Processing...' : 'Confirm Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
