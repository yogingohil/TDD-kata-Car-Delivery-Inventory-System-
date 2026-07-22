import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 text-sm py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-lg font-bold text-white tracking-tight">
            APEX<span className="text-cyan-400">MOTORS</span>
          </span>
          <p className="text-xs text-slate-500 mt-1">
            Enterprise Car Delivery & Inventory Management Platform. Built with TDD & Clean Architecture.
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-400">
          <span>React 19 + TypeScript</span>
          <span>•</span>
          <span>Node.js Express API</span>
          <span>•</span>
          <span>MongoDB Atlas</span>
        </div>

        <div className="text-xs text-slate-500">
          © {new Date().getFullYear()} APEX MOTORS Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
