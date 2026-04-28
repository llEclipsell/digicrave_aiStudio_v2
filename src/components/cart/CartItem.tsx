import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { CartItem } from '../../types';
import { useCartStore } from '../../store/cartStore';
import { formatPrice } from '../../lib/utils';

interface CartItemCompProps {
  item: CartItem;
}

export const CartItemComp: React.FC<CartItemCompProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex items-center gap-4 bg-[var(--color-bg-surface)] p-4 rounded-[var(--radius-md)] border border-[var(--color-border)] mb-4">
      <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-semibold mb-1">{item.name}</h3>
        <span className="text-xs text-[var(--color-primary)] font-bold">{formatPrice(item.price)}</span>
      </div>
      <div className="flex items-center gap-3">
        {item.quantity === 1 ? (
          <button 
            onClick={() => removeItem(item.id)}
            className="w-8 h-8 rounded-md flex items-center justify-center bg-[var(--color-error)]/10 text-[var(--color-error)]"
          >
            <Trash2 size={16} />
          </button>
        ) : (
          <button 
            onClick={() => updateQuantity(item.id, -1)}
            className="w-8 h-8 rounded-md flex items-center justify-center bg-[var(--color-bg-elevated)] text-[var(--color-text-body)]"
          >
            <Minus size={16} />
          </button>
        )}
        <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
        <button 
          onClick={() => updateQuantity(item.id, 1)}
          className="w-8 h-8 rounded-md flex items-center justify-center bg-[var(--color-primary)] text-white"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
};
