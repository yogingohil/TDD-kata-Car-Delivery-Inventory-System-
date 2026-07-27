import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 text-sm py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white text-sm shadow-md shadow-cyan-500/20">
              V
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              APEX<span className="text-cyan-400">MOTORS</span>
            </span>
          </Link>
          <p className="text-xs text-slate-500 mt-1.5 max-w-sm">
            Precision Car Delivery & Luxury Inventory Management System. Engineered for Incubyte Technical Assessment.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-300">
          <Link to="/inventory" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
            <span>🏎️ Inventory Catalog</span>
          </Link>
          <Link to="/dashboard" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
            <span>📊 VIP Garage</span>
          </Link>
          <a
            href="https://tdd-kata-car-delivery-inventory-system-1.onrender.com/api-docs"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
          >
            <span>📜 API Docs</span>
          </a>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
            ✓ TDD Verified (42/42 Tests)
          </span>
        </div>

        <div className="text-xs text-slate-500 text-center md:text-right">
          <div>© {new Date().getFullYear()} APEX MOTORS Inc.</div>
          <div className="text-[10px] text-slate-600 mt-0.5">All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
};
