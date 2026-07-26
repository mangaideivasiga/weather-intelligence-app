import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Hero Skeleton */}
      <div className="h-64 bg-slate-800/80 rounded-3xl border border-slate-700/50 p-6 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="h-8 w-48 bg-slate-700/70 rounded-xl" />
          <div className="h-4 w-32 bg-slate-700/50 rounded-lg" />
        </div>
        <div className="flex items-baseline gap-4">
          <div className="h-20 w-40 bg-slate-700/70 rounded-2xl" />
          <div className="h-10 w-32 bg-slate-700/50 rounded-xl" />
        </div>
      </div>

      {/* Grid Cards Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-24 bg-slate-800/60 rounded-2xl border border-slate-800 p-4" />
        ))}
      </div>

      {/* Hourly Section Skeleton */}
      <div className="h-48 bg-slate-800/60 rounded-3xl border border-slate-800 p-6" />

      {/* 7-Day Forecast Skeleton */}
      <div className="h-80 bg-slate-800/60 rounded-3xl border border-slate-800 p-6" />
    </div>
  );
};
