import React from 'react';
import { NavLink } from 'react-router-dom';
import { Utensils, ShoppingCart, Clock, User } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { cn } from '../../lib/utils';

export const BottomNav: React.FC = () => {
  const itemCount = useCartStore((state) => state.getItemCount());

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] h-[84px] bg-blur border-t border-[var(--color-border)] flex items-center justify-around z-50 px-2 pb-safe">
      <NavLink
        to="/menu"
        className={({ isActive }) =>
          cn("flex flex-col items-center gap-1 transition-colors", isActive ? "text-[var(--color-primary)]" : "text-[var(--color-text-muted)]")
        }
      >
        <Utensils size={24} />
        <span className="text-[10px] font-medium uppercase tracking-wider">Menu</span>
      </NavLink>

      <NavLink
        to="/cart"
        className={({ isActive }) =>
          cn("flex flex-col items-center gap-1 transition-colors relative", isActive ? "text-[var(--color-primary)]" : "text-[var(--color-text-muted)]")
        }
      >
        <ShoppingCart size={24} />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-2 bg-[var(--color-primary)] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {itemCount}
          </span>
        )}
        <span className="text-[10px] font-medium uppercase tracking-wider">Cart</span>
      </NavLink>

      <NavLink
        to="/orders"
        className={({ isActive }) =>
          cn("flex flex-col items-center gap-1 transition-colors", isActive ? "text-[var(--color-primary)]" : "text-[var(--color-text-muted)]")
        }
      >
        <Clock size={24} />
        <span className="text-[10px] font-medium uppercase tracking-wider">Orders</span>
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          cn("flex flex-col items-center gap-1 transition-colors", isActive ? "text-[var(--color-primary)]" : "text-[var(--color-text-muted)]")
        }
      >
        <User size={24} />
        <span className="text-[10px] font-medium uppercase tracking-wider">Profile</span>
      </NavLink>
    </nav>
  );
};
