import React from 'react';

export const HeroBanner: React.FC = () => {
  return (
    <div className="relative w-full h-[200px] rounded-[var(--radius-md)] overflow-hidden mb-6 shadow-[var(--shadow-card)]">
      <img 
        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1470&auto=format&fit=crop" 
        alt="Special of the day"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-5 flex flex-col justify-end">
        <span className="text-[var(--color-primary)] text-[10px] font-bold tracking-[0.2em] uppercase mb-1">Today's Special</span>
        <h1 className="text-2xl font-bold text-white mb-1">Flaming Dragon Ramen</h1>
        <p className="text-[var(--color-primary)] font-bold text-lg">₹499</p>
      </div>
    </div>
  );
};
