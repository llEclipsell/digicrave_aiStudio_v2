import React from 'react';
import { Smartphone, CreditCard, Banknote } from 'lucide-react';
import { cn } from '../../lib/utils';

interface PaymentMethodSelectorProps {
  selected: string;
  onSelect: (id: string) => void;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ selected, onSelect }) => {
  const methods = [
    { id: 'upi', label: 'UPI', icon: Smartphone },
    { id: 'card', label: 'Card', icon: CreditCard },
    { id: 'cash', label: 'Cash', icon: Banknote },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {methods.map((method) => {
        const Icon = method.icon;
        const isActive = selected === method.id;
        
        return (
          <button
            key={method.id}
            onClick={() => onSelect(method.id)}
            className={cn(
              "flex flex-col items-center gap-3 p-4 rounded-[var(--radius-md)] border-2 transition-all",
              isActive 
                ? "bg-[var(--color-primary-muted)] border-[var(--color-primary)] text-[var(--color-primary)]" 
                : "bg-[var(--color-bg-surface)] border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-text-muted)]"
            )}
          >
            <Icon size={24} />
            <span className="text-[10px] font-bold uppercase tracking-wider">{method.label}</span>
          </button>
        );
      })}
    </div>
  );
};
