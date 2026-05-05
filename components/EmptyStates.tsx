import React from 'react';
import Link from 'next/link';

export function EmptySearch({ city }: { city?: string }) {
  return (
    <div className="bg-[#111111] border border-[#2a2a2a] rounded-[16px] p-[48px] text-center flex flex-col items-center justify-center">
      <div className="text-5xl mb-4">🔍</div>
      <h3 className="text-xl font-bold mb-2">No barbers found{city ? ` in ${city}` : ''}.</h3>
      <p className="text-[#888888]">Try a different city or style.</p>
    </div>
  );
}

export function EmptyClientBookings() {
  return (
    <div className="bg-[#111111] border border-[#2a2a2a] rounded-[16px] p-[48px] text-center flex flex-col items-center justify-center">
      <div className="text-5xl mb-4">📅</div>
      <h3 className="text-xl font-bold mb-2">No bookings yet.</h3>
      <p className="text-[#888888] mb-6">Find your barber.</p>
      <Link 
        href="/" 
        className="bg-brand-primary text-black px-6 py-2.5 rounded-full font-bold hover:bg-brand-primary/90 transition-colors inline-block"
      >
        Find a Barber
      </Link>
    </div>
  );
}

export function EmptyBarberBookings() {
  return (
    <div className="bg-[#111111] border border-[#2a2a2a] rounded-[16px] p-[48px] text-center flex flex-col items-center justify-center">
      <div className="text-5xl mb-4">✂️</div>
      <h3 className="text-xl font-bold mb-2">No appointments today.</h3>
      <p className="text-[#888888]">Share your barber code to get booked.</p>
    </div>
  );
}

export function EmptyFavourites() {
  return (
    <div className="bg-[#111111] border border-[#2a2a2a] rounded-[16px] p-[48px] text-center flex flex-col items-center justify-center">
      <div className="text-5xl mb-4">❤️</div>
      <h3 className="text-xl font-bold mb-2">No favourites yet.</h3>
      <p className="text-[#888888]">Save barbers you love.</p>
    </div>
  );
}
