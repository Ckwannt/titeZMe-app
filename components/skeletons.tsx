import React from 'react';

export function BarberCardSkeleton() {
  return (
    <div className="bg-brand-surface border border-brand-border rounded-3xl overflow-hidden block">
      <div className="h-[180px] bg-[#1a1a1a] relative animate-pulse flex items-center justify-center">
        <div className="w-12 h-12 bg-[#2a2a2a] rounded-full"></div>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="h-6 w-32 bg-[#2a2a2a] animate-pulse rounded-md mb-2"></div>
            <div className="h-3 w-20 bg-[#2a2a2a] animate-pulse rounded-md"></div>
          </div>
          <div className="flex flex-col items-end">
            <div className="h-4 w-12 bg-[#2a2a2a] animate-pulse rounded-md mb-1"></div>
            <div className="h-3 w-16 bg-[#2a2a2a] animate-pulse rounded-md"></div>
          </div>
        </div>
        <div className="flex gap-1.5 flex-wrap my-3">
          <div className="h-5 w-16 bg-[#2a2a2a] animate-pulse rounded-md"></div>
          <div className="h-5 w-20 bg-[#2a2a2a] animate-pulse rounded-md"></div>
        </div>
        <div className="h-3 w-24 bg-[#2a2a2a] animate-pulse rounded-md mb-3"></div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-brand-border">
          <div className="h-4 w-16 bg-[#2a2a2a] animate-pulse rounded-md"></div>
          <div className="h-4 w-20 bg-[#2a2a2a] animate-pulse rounded-md"></div>
        </div>
      </div>
    </div>
  );
}

export function BookingRowSkeleton() {
  return (
    <div className="bg-brand-surface border border-brand-border rounded-2xl p-5 border-l-[4px] border-l-[#2a2a2a] mb-3.5">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="h-5 w-32 bg-[#2a2a2a] animate-pulse rounded-md mb-2"></div>
          <div className="h-4 w-24 bg-[#2a2a2a] animate-pulse rounded-md mb-1"></div>
          <div className="h-3 w-20 bg-[#2a2a2a] animate-pulse rounded-md"></div>
        </div>
        <div className="h-8 w-16 bg-[#2a2a2a] animate-pulse rounded-lg"></div>
      </div>
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#2a2a2a]">
        <div className="h-3 w-24 bg-[#2a2a2a] animate-pulse rounded-md"></div>
        <div className="h-6 w-24 bg-[#2a2a2a] animate-pulse rounded-lg"></div>
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-[#1A1A1B] border border-[#2a2a2a] rounded-2xl p-6">
       <div className="h-4 w-24 bg-[#2a2a2a] animate-pulse rounded-md mb-2"></div>
       <div className="h-8 w-16 bg-[#2a2a2a] animate-pulse rounded-md"></div>
    </div>
  );
}

export function BarberProfileSkeleton() {
  return (
    <div className="max-w-[1000px] mx-auto px-4 md:px-6 py-6 md:py-10">
      <div className="flex flex-col md:flex-row gap-6 md:gap-10">
        <div className="w-full md:w-1/3">
          <div className="aspect-square bg-[#1a1a1a] animate-pulse rounded-3xl mb-6"></div>
          <div className="h-8 w-48 bg-[#2a2a2a] animate-pulse rounded-xl mb-4"></div>
          <div className="h-4 w-32 bg-[#2a2a2a] animate-pulse rounded-lg mb-4"></div>
          <div className="space-y-3">
             <div className="h-4 w-full bg-[#2a2a2a] animate-pulse rounded-lg"></div>
             <div className="h-4 w-full bg-[#2a2a2a] animate-pulse rounded-lg"></div>
             <div className="h-4 w-2/3 bg-[#2a2a2a] animate-pulse rounded-lg"></div>
          </div>
        </div>
        <div className="flex-1">
          <div className="h-10 w-48 bg-[#2a2a2a] animate-pulse rounded-xl mb-8"></div>
          <div className="space-y-4">
            <div className="h-24 w-full bg-[#1a1a1a] animate-pulse rounded-2xl"></div>
            <div className="h-24 w-full bg-[#1a1a1a] animate-pulse rounded-2xl"></div>
            <div className="h-24 w-full bg-[#1a1a1a] animate-pulse rounded-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
