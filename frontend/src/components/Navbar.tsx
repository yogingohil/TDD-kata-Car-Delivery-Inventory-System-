import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';
import { useUIStore } from '../store/uiStore.js';
import { useCompareStore } from '../store/compareStore.js';
import { useCurrency, CurrencyCode } from '../context/CurrencyContext.js';
import { CompareModal } from './CompareModal.js';
import { UserRole } from '../types/index.js';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { addToast } = useUIStore();
  const { vehicles } = useCompareStore();
  const { currency, setCurrency } = useCurrency();
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully', 'info');
    navigate('/login');
  };

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-300">
              <span className="text-xl font-bold text-white">V</span>
            </div>
            <div>
              <span className="text-xl font-extrabold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent tracking-tight">
                APEX<span className="text-cyan-400">MOTORS</span>
              </span>
              <span className="block text-[10px] text-cyan-400/80 uppercase font-semibold tracking-widest -mt-1">
                Inventory System
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link to="/inventory" className="text-slate-300 hover:text-cyan-400 transition-colors">
              Inventory Catalog
            </Link>

            {isAuthenticated && (
              <Link to="/dashboard" className="text-slate-300 hover:text-cyan-400 transition-colors">
                My Dashboard
              </Link>
            )}

            {isAuthenticated && (
              <Link to="/purchases" className="text-slate-300 hover:text-cyan-400 transition-colors">
                Purchase History
              </Link>
            )}

            {user?.role === UserRole.ADMIN && (
              <Link
                to="/admin"
                className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-all font-semibold"
              >
                ⚡ Executive Admin Panel
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {/* Compare Drawer Trigger */}
            <button
              onClick={() => setIsCompareOpen(true)}
              className="relative px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5"
            >
              <span>⚖️ Compare</span>
              {vehicles.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-black flex items-center justify-center">
                  {vehicles.length}
                </span>
              )}
            </button>

            {/* Currency Selector */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              className="px-2.5 py-1.5 text-xs font-bold rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 focus:outline-none"
            >
              <option value="USD">$ USD</option>
              <option value="EUR">€ EUR</option>
              <option value="GBP">£ GBP</option>
              <option value="INR">₹ INR</option>
            </select>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <span className="block text-sm font-bold text-white">{user?.name}</span>
                  <span className="block text-[10px] text-cyan-400 uppercase tracking-wider font-semibold">
                    {user?.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-800/80 hover:bg-rose-600/20 text-slate-300 hover:text-rose-400 border border-slate-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white">
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 rounded-xl shadow-lg shadow-cyan-500/25"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <CompareModal isOpen={isCompareOpen} onClose={() => setIsCompareOpen(false)} />
    </>
  );
};
