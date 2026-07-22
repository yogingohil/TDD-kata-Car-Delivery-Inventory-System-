import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="rounded-2xl bg-slate-900/40 border border-slate-800/60 p-4 animate-pulse">
      <div className="h-44 bg-slate-800/60 rounded-xl mb-4"></div>
      <div className="h-5 bg-slate-800/60 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-slate-800/60 rounded w-1/2 mb-4"></div>
      <div className="h-16 bg-slate-800/40 rounded mb-4"></div>
      <div className="flex justify-between items-center">
        <div className="h-6 bg-slate-800/60 rounded w-1/3"></div>
        <div className="h-9 bg-slate-800/60 rounded w-1/4"></div>
      </div>
    </div>
  );
};

export const SkeletonGrid: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};
