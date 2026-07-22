import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { vehicleService } from '../services/api.js';
import { VehicleCard } from '../components/VehicleCard.js';
import { SkeletonGrid } from '../components/SkeletonLoader.js';

export const Home: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['featuredVehicles'],
    queryFn: () => vehicleService.getVehicles({ limit: 3 }),
  });

  return (
    <div className="space-y-24 py-12">
      {/* Hero Section */}
      <section className="relative text-center space-y-8 max-w-4xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-widest animate-pulse">
          ⚡ Next-Gen Inventory Architecture
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold text-white tracking-tight leading-tight">
          Precision Car Delivery &{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
            Inventory System
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-300 font-normal max-w-2xl mx-auto leading-relaxed">
          Engineered with Clean Architecture, SOLID Principles, and TDD. Experience seamless stock management, automated restock flows, and instant car purchases.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            to="/inventory"
            className="px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 rounded-2xl shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 hover:-translate-y-1"
          >
            Explore Inventory Catalog →
          </Link>
          <Link
            to="/register"
            className="px-8 py-4 text-base font-bold text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-2xl transition-all duration-300"
          >
            Create Account
          </Link>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-2xl font-bold border border-cyan-500/20">
            🏎️
          </div>
          <h3 className="text-xl font-bold text-white">Automated Inventory</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Real-time stock adjustments upon purchase, automatic LOW_STOCK and OUT_OF_STOCK threshold detection.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-2xl font-bold border border-blue-500/20">
            🔒
          </div>
          <h3 className="text-xl font-bold text-white">Strict Security & RBAC</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Role-Based Access Control protecting Admin endpoints, BCrypt password hashing, JWT authorization, and rate limiting.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-2xl font-bold border border-indigo-500/20">
            🧪
          </div>
          <h3 className="text-xl font-bold text-white">Strict TDD Verified</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Engineered using Red → Green → Refactor TDD cycle with over 90% backend test coverage.
          </p>
        </div>
      </section>

      {/* Featured Vehicles Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Featured Luxury Inventory
            </h2>
            <p className="text-sm text-slate-400">
              Discover top vehicles available for immediate delivery
            </p>
          </div>
          <Link
            to="/inventory"
            className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            View All ({data?.data?.total || 0}) →
          </Link>
        </div>

        {isLoading ? (
          <SkeletonGrid count={3} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data?.data?.vehicles.map((v) => (
              <VehicleCard key={v._id} vehicle={v} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
