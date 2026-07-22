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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    addToast('Logged out successfully', 'info');
    navigate('/login');
  };

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-2 sm:gap-4">
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-300">
              <span className="text-lg sm:text-xl font-bold text-white">V</span>
            </div>
            <div>
              <span className="text-lg sm:text-xl font-extrabold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent tracking-tight">
                APEX<span className="text-cyan-400">MOTORS</span>
              </span>
              <span className="block text-[9px] sm:text-[10px] text-cyan-400/80 uppercase font-semibold tracking-widest -mt-1">
                Inventory System
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
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

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Compare Drawer Trigger */}
            <button
              onClick={() => setIsCompareOpen(true)}
              className="relative px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5"
            >
              <span>⚖️ <span className="hidden sm:inline">Compare</span></span>
              {vehicles.length > 0 && (
                <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-black flex items-center justify-center">
                  {vehicles.length}
                </span>
              )}
            </button>

            {/* Currency Selector */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              className="px-2 py-1.5 text-xs font-bold rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 focus:outline-none cursor-pointer"
            >
              <option value="USD">$ USD</option>
              <option value="EUR">€ EUR</option>
              <option value="GBP">£ GBP</option>
              <option value="INR">₹ INR</option>
            </select>

            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-3">
                <div className="text-right">
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
              <div className="hidden sm:flex items-center gap-2">
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

            {/* Mobile Hamburger Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-slate-950/95 border-b border-slate-800 px-4 py-6 space-y-4 animate-in slide-in-from-top duration-200">
            <div className="flex flex-col space-y-3 font-medium text-sm">
              <Link
                to="/inventory"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-slate-200 hover:text-cyan-400 flex items-center justify-between"
              >
                <span>🏎️ Inventory Catalog</span>
                <span className="text-xs text-slate-500">→</span>
              </Link>

              {isAuthenticated && (
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-slate-200 hover:text-cyan-400 flex items-center justify-between"
                >
                  <span>📊 My Dashboard</span>
                  <span className="text-xs text-slate-500">→</span>
                </Link>
              )}

              {isAuthenticated && (
                <Link
                  to="/purchases"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-slate-200 hover:text-cyan-400 flex items-center justify-between"
                >
                  <span>📄 Purchase History</span>
                  <span className="text-xs text-slate-500">→</span>
                </Link>
              )}

              {user?.role === UserRole.ADMIN && (
                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold flex items-center justify-between"
                >
                  <span>⚡ Executive Admin Panel</span>
                  <span className="text-xs">→</span>
                </Link>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-2">
                    <div>
                      <span className="block text-sm font-bold text-white">{user?.name}</span>
                      <span className="block text-[10px] text-cyan-400 uppercase font-semibold">
                        Role: {user?.role}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full py-2.5 text-xs font-bold rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30 text-center"
                  >
                    Logout Account
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-2.5 text-center text-xs font-semibold rounded-xl bg-slate-900 text-slate-300 border border-slate-800"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="py-2.5 text-center text-xs font-bold rounded-xl text-white bg-gradient-to-r from-cyan-500 to-blue-600 shadow-md"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <CompareModal isOpen={isCompareOpen} onClose={() => setIsCompareOpen(false)} />
    </>
  );
};
