import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { vehicleService } from '../services/api.js';

export const VehicleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => vehicleService.getVehicleById(id || ''),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-400">
        Loading vehicle specifications...
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Vehicle Not Found</h2>
        <Link to="/inventory" className="text-cyan-400 font-semibold hover:underline">
          ← Back to Catalog
        </Link>
      </div>
    );
  }

  const v = data.data;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Link to="/inventory" className="text-sm font-semibold text-slate-400 hover:text-cyan-400 transition-colors">
        ← Back to Inventory Catalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl h-[400px]">
          <img
            src={
              v.image ||
              'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80'
            }
            alt={`${v.make} ${v.model}`}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-6">
          <div>
            <div className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 mb-2">
              {v.category}
            </div>
            <h1 className="text-4xl font-extrabold text-white">
              {v.make} {v.model} ({v.year})
            </h1>
            <p className="text-sm text-slate-400 mt-2">
              VIN: <span className="text-slate-200 font-mono">{v.vin}</span>
            </p>
          </div>

          <div className="text-3xl font-black text-cyan-400">
            ${v.price.toLocaleString()}
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-500 block text-xs">Engine</span>
              <span className="font-semibold text-white">{v.engineCapacity}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-xs">Transmission</span>
              <span className="font-semibold text-white">{v.transmission}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-xs">Fuel Type</span>
              <span className="font-semibold text-white">{v.fuelType}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-xs">Color</span>
              <span className="font-semibold text-white">{v.color}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-xs">Mileage</span>
              <span className="font-semibold text-white">{v.mileage} miles</span>
            </div>
            <div>
              <span className="text-slate-500 block text-xs">Stock Quantity</span>
              <span className="font-bold text-emerald-400">{v.quantity} units</span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Overview & Description
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              {v.description || 'High performance luxury vehicle verified with complete delivery history.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
