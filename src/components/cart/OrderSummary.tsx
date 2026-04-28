import React from 'react';
import { formatPrice } from '../../lib/utils';
import { useCartStore } from '../../store/cartStore';

export const OrderSummary: React.FC = () => {
  const { getTotal, getItemCount } = useCartStore();
  const total = getTotal();
  const tax = total * 0.05; // 5% mock tax
  const grandTotal = total + tax;

  return (
    <div className="bg-[var(--color-bg-surface)] p-5 rounded-[var(--radius-lg)] border border-[var(--color-border)] space-y-4">
      <div className="flex justify-between text-sm text-[var(--color-text-muted)]">
        <span>Items ({getItemCount()})</span>
        <span>{formatPrice(total)}</span>
      </div>
      <div className="flex justify-between text-sm text-[var(--color-text-muted)]">
        <span>GST (5%)</span>
        <span>{formatPrice(tax)}</span>
      </div>
      <div className="h-[1px] bg-[var(--color-border)] w-full" />
      <div className="flex justify-between items-center pt-2">
        <span className="text-lg font-bold text-white">Grand Total</span>
        <span className="text-xl font-bold text-[var(--color-primary)]">{formatPrice(grandTotal)}</span>
      </div>
    </div>
  );
};
