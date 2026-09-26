import React from 'react';



export const BedGridSkeleton = () => {

  return (

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

      {Array.from({ length: 12 }).map((_, i) => (

        <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse">

          <div className="flex justify-between items-start mb-4">

            <div className="h-5 w-24 bg-slate-200 rounded"></div>

            <div className="h-6 w-16 bg-slate-200 rounded-full"></div>

          </div>

          <div className="space-y-2">

            <div className="h-4 w-full bg-slate-200 rounded"></div>

            <div className="h-4 w-3/4 bg-slate-200 rounded"></div>

          </div>

          <div className="mt-4 flex gap-2">

            <div className="h-8 w-full bg-slate-200 rounded-lg"></div>

          </div>

        </div>

      ))}

    </div>

  );

};



export const MetricCardSkeleton = () => {

  return (

    <div className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">

      <div className="flex items-center justify-between">

        <div className="space-y-2">

          <div className="h-4 w-32 bg-slate-200 rounded"></div>

          <div className="h-8 w-16 bg-slate-200 rounded"></div>

        </div>

        <div className="h-12 w-12 bg-slate-200 rounded-xl"></div>

      </div>

    </div>

  );

};



export const AuditLogSkeleton = () => {

  return (

    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse">

      <div className="p-4 border-b border-slate-100 space-y-2">

        <div className="h-4 w-full bg-slate-200 rounded"></div>

      </div>

      {Array.from({ length: 8 }).map((_, i) => (

        <div key={i} className="p-4 border-b border-slate-50 flex gap-4">

          <div className="h-4 w-32 bg-slate-200 rounded"></div>

          <div className="h-4 w-24 bg-slate-200 rounded"></div>

          <div className="h-4 w-32 bg-slate-200 rounded"></div>

          <div className="h-4 w-24 bg-slate-200 rounded"></div>

        </div>

      ))}

    </div>

  );

};