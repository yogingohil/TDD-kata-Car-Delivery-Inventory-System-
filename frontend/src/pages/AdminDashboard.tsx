import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { purchaseService, vehicleService, apiClient } from '../services/api.js';
import { IVehicle } from '../types/index.js';
import { useUIStore } from '../store/uiStore.js';
import { useCurrency } from '../context/CurrencyContext.js';

export const AdminDashboard: React.FC = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<IVehicle | null>(null);
  const [restockQty, setRestockQty] = useState(5);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<IVehicle | null>(null);

  const { formatPrice } = useCurrency();
  const { addToast } = useUIStore();

  const [formData, setFormData] = useState<Partial<IVehicle>>({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    category: 'Sports',
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    color: 'Black',
    vin: '',
    mileage: 0,
    engineCapacity: '3.0L V6',
    price: 50000,
    quantity: 5,
    description: '',
  });

  const { data: analytics, refetch: refetchAnalytics } = useQuery({
    queryKey: ['adminAnalytics'],
    queryFn: () => purchaseService.getAnalyticsSummary(),
  });

  const { data: vehiclesData, refetch: refetchVehicles } = useQuery({
    queryKey: ['adminVehicles'],
    queryFn: () => vehicleService.getVehicles({ limit: 100 }),
  });

  const { data: testDrives, refetch: refetchTestDrives } = useQuery({
    queryKey: ['adminTestDrives'],
    queryFn: async () => {
      const res = await apiClient.get('/test-drives');
      return res.data.data;
    },
  });

  const handleRestock = async () => {
    if (!selectedVehicle) return;
    try {
      await vehicleService.restockVehicle(selectedVehicle._id, restockQty);
      addToast(`Restocked ${restockQty} units for ${selectedVehicle.make} ${selectedVehicle.model}!`, 'success');
      setSelectedVehicle(null);
      refetchVehicles();
      refetchAnalytics();
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Restock failed', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      await vehicleService.deleteVehicle(id);
      addToast('Vehicle deleted successfully', 'info');
      refetchVehicles();
      refetchAnalytics();
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Delete failed', 'error');
    }
  };

  const handleUpdateTestDriveStatus = async (id: string, status: string) => {
    try {
      await apiClient.patch(`/test-drives/${id}/status`, { status });
      addToast(`Test drive status updated to ${status}!`, 'success');
      refetchTestDrives();
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Failed to update test drive', 'error');
    }
  };

  const handleSaveVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingVehicle) {
        await vehicleService.updateVehicle(editingVehicle._id, formData);
        addToast('Vehicle updated successfully!', 'success');
      } else {
        await vehicleService.createVehicle(formData);
        addToast('New vehicle added to inventory!', 'success');
      }
      setShowAddModal(false);
      setEditingVehicle(null);
      refetchVehicles();
      refetchAnalytics();
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Save failed. Check VIN uniqueness.', 'error');
    }
  };

  const openEdit = (v: IVehicle) => {
    setEditingVehicle(v);
    setFormData(v);
    setShowAddModal(true);
  };

  const summary = analytics?.data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            Executive Control Panel
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Inventory Operations & Real-Time Analytics
          </h1>
        </div>

        <button
          onClick={() => {
            setEditingVehicle(null);
            setFormData({
              make: '',
              model: '',
              year: new Date().getFullYear(),
              category: 'Sports',
              fuelType: 'Gasoline',
              transmission: 'Automatic',
              color: 'Black',
              vin: `VIN${Date.now()}`,
              mileage: 0,
              engineCapacity: '3.0L V6',
              price: 75000,
              quantity: 5,
              description: '',
            });
            setShowAddModal(true);
          }}
          className="px-5 py-3 font-bold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 rounded-xl shadow-lg shadow-cyan-500/25 transition-all"
        >
          + Add New Vehicle
        </button>
      </div>

      {/* Analytics KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <span className="text-xs font-semibold text-slate-400 block">Total Fleet</span>
          <span className="text-3xl font-black text-white mt-2 block">
            {summary?.totalVehicles || 0}
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <span className="text-xs font-semibold text-slate-400 block">Available</span>
          <span className="text-3xl font-black text-emerald-400 mt-2 block">
            {summary?.availableVehicles || 0}
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <span className="text-xs font-semibold text-slate-400 block">Low Stock Alert</span>
          <span className="text-3xl font-black text-amber-400 mt-2 block">
            {summary?.lowStockVehicles || 0}
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <span className="text-xs font-semibold text-slate-400 block">Out Of Stock</span>
          <span className="text-3xl font-black text-rose-400 mt-2 block">
            {summary?.outOfStockVehicles || 0}
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
          <span className="text-xs font-semibold text-slate-400 block">Inventory Valuation</span>
          <span className="text-2xl font-black text-cyan-400 mt-2 block">
            {formatPrice(summary?.totalInventoryValue || 0)}
          </span>
        </div>
      </div>

      {/* Category Stock Distribution Bar Visualizer */}
      {summary?.categoryDistribution && (
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 backdrop-blur-xl space-y-4">
          <h3 className="text-lg font-bold text-white">Fleet Category Distribution</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {Object.entries(summary.categoryDistribution).map(([cat, qty]) => (
              <div key={cat} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                <span className="text-xs text-slate-400 block font-semibold">{cat}</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-bold text-white">{qty} units</span>
                  <span className="text-[10px] text-cyan-400 font-bold">
                    {Math.round((qty / (summary.totalVehicles || 1)) * 100)}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 rounded-full"
                    style={{ width: `${Math.min(100, (qty / 10) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Test Drives Schedule Manager */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">Customer Test Drive Appointments</h3>
        {!testDrives || testDrives.length === 0 ? (
          <div className="p-6 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-xs text-slate-400">
            No customer test drives requested yet.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-xl">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-xs uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Vehicle</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {testDrives.map((td: any) => (
                  <tr key={td._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-white">{td.userId?.name || 'Customer'}</td>
                    <td className="px-6 py-4 text-slate-300">
                      {td.vehicleId ? `${td.vehicleId.make} ${td.vehicleId.model}` : 'Vehicle'}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {td.preferredDate} ({td.preferredTimeSlot})
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-cyan-400">{td.type}</td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-400">{td.contactPhone}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 text-[10px] font-bold rounded-md bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                        {td.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-1">
                      <button
                        onClick={() => handleUpdateTestDriveStatus(td._id, 'CONFIRMED')}
                        className="px-2 py-1 text-[11px] font-bold rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => handleUpdateTestDriveStatus(td._id, 'COMPLETED')}
                        className="px-2 py-1 text-[11px] font-bold rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                      >
                        Complete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Vehicle Management Table */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">Manage Vehicle Inventory</h3>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-xl">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-xs uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Make & Model</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">VIN</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {vehiclesData?.data?.vehicles.map((v) => (
                <tr key={v._id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-white">
                    {v.make} {v.model} ({v.year})
                  </td>
                  <td className="px-6 py-4 text-slate-400">{v.category}</td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-400">{v.vin}</td>
                  <td className="px-6 py-4 font-bold text-white">{formatPrice(v.price)}</td>
                  <td className="px-6 py-4 font-bold text-cyan-400">{v.quantity}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-md border ${
                        v.quantity === 0
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                          : v.quantity <= 3
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      }`}
                    >
                      {v.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => setSelectedVehicle(v)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20"
                    >
                      Restock
                    </button>
                    <button
                      onClick={() => openEdit(v)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(v._id)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Restock Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="max-w-md w-full p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-xl font-bold text-white">Restock Vehicle Inventory</h3>
            <p className="text-xs text-slate-400">
              {selectedVehicle.make} {selectedVehicle.model} (Current Stock: {selectedVehicle.quantity})
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Restock Units to Add
              </label>
              <input
                type="number"
                min={1}
                value={restockQty}
                onChange={(e) => setRestockQty(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setSelectedVehicle(null)}
                className="flex-1 py-2.5 font-semibold rounded-xl bg-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleRestock}
                className="flex-1 py-2.5 font-bold rounded-xl text-white bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg"
              >
                Confirm Restock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Vehicle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="max-w-2xl w-full p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 my-8">
            <h3 className="text-2xl font-bold text-white">
              {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle to Inventory'}
            </h3>

            <form onSubmit={handleSaveVehicle} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Make</label>
                <input
                  type="text"
                  required
                  value={formData.make}
                  onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Model</label>
                <input
                  type="text"
                  required
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Year</label>
                <input
                  type="number"
                  required
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">VIN (Unique)</label>
                <input
                  type="text"
                  required
                  value={formData.vin}
                  onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Price ($)</label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Stock Quantity</label>
                <input
                  type="number"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Color</label>
                <input
                  type="text"
                  required
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white"
                />
              </div>

              <div className="sm:col-span-2 flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 font-semibold rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 font-bold rounded-xl text-white bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg"
                >
                  {editingVehicle ? 'Update Vehicle' : 'Save Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
