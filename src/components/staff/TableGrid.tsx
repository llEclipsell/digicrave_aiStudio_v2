import React from 'react';
import { Users, Clock, ShoppingBag } from 'lucide-react';
import { Table } from '../../types';
import { cn } from '../../lib/utils';

interface TableGridProps {
  tables: Table[];
  onTableSelect: (table: Table) => void;
}

export const TableGrid: React.FC<TableGridProps> = ({ tables, onTableSelect }) => {
  if (!Array.isArray(tables)) return null;
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {tables.map((table) => (
        <button
          key={table.id}
          onClick={() => onTableSelect(table)}
          className={cn(
            "bg-[var(--color-bg-surface)] p-5 rounded-[var(--radius-md)] border text-left transition-all hover:scale-[1.02] active:scale-95 group",
            table.status === 'occupied' ? "border-[var(--color-warning)] bg-[var(--color-warning)]/5" :
            table.status === 'bill_requested' ? "border-[var(--color-primary)] animate-pulse" :
            "border-[var(--color-border)] opacity-60"
          )}
        >
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-2xl font-black text-white group-hover:text-[var(--color-primary)] transition-colors">T{table.number}</h4>
            <div className={cn(
              "w-2 h-2 rounded-full",
              table.status === 'occupied' ? "bg-[var(--color-warning)]" :
              table.status === 'bill_requested' ? "bg-[var(--color-primary)]" :
              "bg-gray-600"
            )} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] text-[var(--color-text-muted)] font-bold uppercase tracking-wider">
              <Users size={12} />
              {table.status !== 'available' ? '4 Guests' : 'Vacant'}
            </div>
            {table.status !== 'available' && (
              <>
                <div className="flex items-center gap-2 text-[10px] text-[var(--color-text-muted)] font-bold uppercase tracking-wider">
                   <Clock size={12} />
                   45m seated
                </div>
                <div className="flex items-center gap-2 text-[10px] text-[var(--color-primary)] font-bold uppercase tracking-wider">
                   <ShoppingBag size={12} />
                   3 orders
                </div>
              </>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};
