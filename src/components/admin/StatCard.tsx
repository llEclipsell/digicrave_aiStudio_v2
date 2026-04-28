import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatPrice } from '../../lib/utils';
import { cn } from '../../lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  isCurrency?: boolean;
  trend?: number;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, isCurrency, trend }) => {
  return (
    <div className="bg-[var(--color-bg-surface)] p-6 rounded-[var(--radius-md)] border border-[var(--color-border)] shadow-[var(--shadow-card)]">
      <div className="flex justify-between items-start mb-4">
        <span className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest">{label}</span>
        {trend && (
          <div className={cn(
            "flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full",
            trend > 0 ? "bg-[var(--color-success)]/10 text-[var(--color-success)]" : "bg-[var(--color-error)]/10 text-[var(--color-error)]"
          )}>
            {trend > 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <h2 className="text-2xl font-black text-white">
        {isCurrency ? formatPrice(Number(value)) : value}
      </h2>
    </div>
  );
};
