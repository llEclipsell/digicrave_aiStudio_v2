import React from 'react';
import { OrderStatus } from '../../types';
import { cn } from '../../lib/utils';

interface StatusBadgeProps {
  status: OrderStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = {
    pending: { color: 'text-[var(--color-warning)]', bg: 'bg-[var(--color-warning)]/10', label: 'Pending' },
    preparing: { color: 'text-[var(--color-primary)]', bg: 'bg-[var(--color-primary)]/10', label: 'Preparing' },
    ready: { color: 'text-[var(--color-success)]', bg: 'bg-[var(--color-success)]/10', label: 'Ready' },
    served: { color: 'text-[var(--color-success)]', bg: 'bg-[var(--color-success)]/10', label: 'Served' },
    cancelled: { color: 'text-[var(--color-error)]', bg: 'bg-[var(--color-error)]/10', label: 'Cancelled' },
  };

  const { color, bg, label } = config[status];

  return (
    <span className={cn(
      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
      color,
      bg
    )}>
      {label}
    </span>
  );
};
