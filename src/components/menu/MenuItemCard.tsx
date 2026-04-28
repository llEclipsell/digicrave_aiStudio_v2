import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { MenuItem } from '../../types';
import { useCartStore } from '../../store/cartStore';
import { formatPrice } from '../../lib/utils';

interface MenuItemCardProps {
  item: MenuItem;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item }) => {
  const { items, addItem, updateQuantity } = useCartStore();
  const cartItem = items.find((i) => i.id === item.id);

  return (
    <div className="flex items-center gap-4 bg-[var(--color-bg-surface)] p-4 rounded-[var(--radius-md)] border border-[var(--color-border)] mb-4 transition-all hover:border-[var(--color-primary)]/30">
      <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold truncate mb-1">{item.name}</h3>
        <p className="text-xs text-[var(--color-text-muted)] truncate mb-2">{item.description}</p>
        <span className="text-[var(--color-primary)] font-bold">{formatPrice(item.price)}</span>
      </div>
      <div className="flex-shrink-0">
        {cartItem ? (
          <div className="flex items-center gap-3 bg-[var(--color-bg-elevated)] rounded-full p-1 border border-[var(--color-border)]">
            <button 
              onClick={() => updateQuantity(item.id, -1)}
              className="w-7 h-7 rounded-full flex items-center justify-center bg-[var(--color-bg-surface)] text-[var(--color-primary)]"
            >
              <Minus size={14} />
            </button>
            <span className="text-xs font-bold w-4 text-center">{cartItem.quantity}</span>
            <button 
              onClick={() => updateQuantity(item.id, 1)}
              className="w-7 h-7 rounded-full flex items-center justify-center bg-[var(--color-primary)] text-white"
            >
              <Plus size={14} />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => addItem(item)}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--color-primary)] text-white shadow-[var(--shadow-glow)] transition-transform active:scale-90"
          >
            <Plus size={20} />
          </button>
        )}
      </div>
    </div>
  );
};
