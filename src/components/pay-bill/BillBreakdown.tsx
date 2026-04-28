import React from 'react';
import { formatPrice } from '../../lib/utils';
import { Order } from '../../types';

interface BillBreakdownProps {
  orders: Order[];
}

export const BillBreakdown: React.FC<BillBreakdownProps> = ({ orders }) => {
  if (!Array.isArray(orders)) return null;
  const subtotal = orders.reduce((acc, order) => acc + (order.total || 0), 0);
  const tax = subtotal * 0.12; // Mapped GST
  const serviceCharge = subtotal * 0.05;
  const total = subtotal + tax + serviceCharge;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {orders.map((order, idx) => (
          <div key={order.id} className="bg-[var(--color-bg-surface)] p-4 rounded-[var(--radius-md)] border border-[var(--color-border)]">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Order Batch #{idx + 1}</span>
              <span className="text-xs text-[var(--color-text-muted)]">{new Date(order.createdAt).toLocaleTimeString()}</span>
            </div>
            <div className="space-y-2">
              {Array.isArray(order.items) && order.items.map((item, itemIdx) => (
                <div key={item.id || itemIdx} className="flex justify-between text-sm">
                  <span className="text-[var(--color-text-body)]">
                    {item.quantity} × {item.name}
                  </span>
                  <span className="text-white font-medium">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[var(--color-bg-elevated)] p-6 rounded-[var(--radius-lg)] space-y-4 border border-[var(--color-border)] shadow-[var(--shadow-elevated)]">
        <div className="flex justify-between text-sm text-[var(--color-text-muted)]">
          <span>Sub-total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-[var(--color-text-muted)]">
          <span>GST (12%)</span>
          <span>{formatPrice(tax)}</span>
        </div>
        <div className="flex justify-between text-sm text-[var(--color-text-muted)]">
          <span>Service Charge (5%)</span>
          <span>{formatPrice(serviceCharge)}</span>
        </div>
        <div className="h-[1px] bg-[var(--color-border)] w-full my-2" />
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-white">Grand Total</span>
          <span className="text-2xl font-bold text-[var(--color-primary)]">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
};
