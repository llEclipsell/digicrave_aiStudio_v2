import React from 'react';
import { Category } from '../../types';
import { cn } from '../../lib/utils';

interface CategoryPillsProps {
  categories: Category[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({ categories, selectedId, onSelect }) => {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-6">
      <button
        onClick={() => onSelect('all')}
        className={cn(
          "px-6 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border border-[var(--color-border)]",
          selectedId === 'all' 
            ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-[var(--shadow-glow)]" 
            : "bg-[var(--color-bg-surface)] text-[var(--color-text-muted)]"
        )}
      >
        All
      </button>
      {Array.isArray(categories) && categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={cn(
            "px-6 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border border-[var(--color-border)]",
            selectedId === cat.id 
              ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-[var(--shadow-glow)]" 
              : "bg-[var(--color-bg-surface)] text-[var(--color-text-muted)]"
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};
