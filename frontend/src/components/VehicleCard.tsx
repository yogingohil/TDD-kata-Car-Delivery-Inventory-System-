import React from 'react';
import { IVehicle, VehicleStatus } from '../types/index.js';
import { Link } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext.js';
import { useCompareStore } from '../store/compareStore.js';
import { useUIStore } from '../store/uiStore.js';

interface VehicleCardProps {
  vehicle: IVehicle;
  onPurchase?: (vehicle: IVehicle) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onPurchase }) => {
  const { formatPrice } = useCurrency();
  const { addToCompare, vehicles: compareList } = useCompareStore();
  const { addToast } = useUIStore();

  const isCompared = compareList.some((v) => v._id === vehicle._id);

  const handleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCompared) return;
    if (compareList.length >= 3) {
      addToast('You can compare up to 3 vehicles at a time', 'info');
      return;
    }
    addToCompare(vehicle);
    addToast(`Added ${vehicle.make} ${vehicle.model} to comparison!`, 'success');
  };

  const getStatusBadge = (status: VehicleStatus, quantity: number) => {
    if (status === VehicleStatus.OUT_OF_STOCK || quantity === 0) {
      return (
        <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
          Out Of Stock
        </span>
      );
    }
    if (status === VehicleStatus.LOW_STOCK || quantity <= 3) {
      return (
        <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
          Low Stock ({quantity})
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
        In Stock ({quantity})
      </span>
    );
  };

  return (
    <div className="group rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 backdrop-blur-xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
      <div>
        <div className="relative h-48 overflow-hidden bg-slate-950">
          <img
            src={
              vehicle.image ||
              'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80'
            }
            alt={`${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3 flex items-center gap-2">
            {getStatusBadge(vehicle.status, vehicle.quantity)}
          </div>

          <button
            onClick={handleCompare}
            className={`absolute top-3 left-3 px-2.5 py-1 text-[11px] font-bold rounded-lg backdrop-blur-md transition-all ${
              isCompared
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'bg-slate-950/80 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            {isCompared ? '✓ Comparing' : '+ Compare'}
          </button>

          <div className="absolute bottom-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-950/80 text-slate-300 border border-slate-700/60 backdrop-blur-md">
            {vehicle.category}
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors truncate">
              {vehicle.make} {vehicle.model}
            </h3>
            <span className="text-xs font-semibold text-slate-400">{vehicle.year}</span>
          </div>

          <p className="text-xs text-slate-400 line-clamp-2 mb-4">
            {vehicle.description || `${vehicle.engineCapacity} • ${vehicle.transmission} • ${vehicle.fuelType}`}
          </p>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60 mb-4">
            <div>
              <span className="text-slate-500 block">Fuel:</span> {vehicle.fuelType}
            </div>
            <div>
              <span className="text-slate-500 block">Transmission:</span> {vehicle.transmission}
            </div>
            <div>
              <span className="text-slate-500 block">Color:</span> {vehicle.color}
            </div>
            <div>
              <span className="text-slate-500 block">VIN:</span> {vehicle.vin.substring(0, 10)}...
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 pt-0 flex items-center justify-between gap-3">
        <div>
          <span className="text-xs text-slate-400 block">Price</span>
          <span className="text-xl font-extrabold text-white">
            {formatPrice(vehicle.price)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/vehicles/${vehicle._id}`}
            className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
          >
            Details
          </Link>

          {onPurchase && (
            <button
              disabled={vehicle.quantity === 0}
              onClick={() => onPurchase(vehicle)}
              className="px-4 py-2 text-xs font-bold rounded-xl text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Purchase
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
