import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageWrapper } from '../../components/shared/PageWrapper';
import { HeroBanner } from '../../components/menu/HeroBanner';
import { CategoryPills } from '../../components/menu/CategoryPills';
import { MenuItemCard } from '../../components/menu/MenuItemCard';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';
import { useCategories, useMenuItems } from '../../hooks/useMenu';
import { useSessionStore } from '../../store/sessionStore';
import { OrderTrackerIcon } from '../../components/shared/OrderTrackerIcon'; // We will create this

const MenuPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const setSession = useSessionStore((state) => state.setSession);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const tableId = searchParams.get('table');
    if (tableId) {
      setSession({
        tableId,
        sessionId: Math.random().toString(36).substring(7),
        restaurantId: 'digicrave-01',
      });
    }
  }, [searchParams, setSession]);

  const { data: categories, isLoading: catsLoading } = useCategories();
  const { data: menuItems, isLoading: itemsLoading } = useMenuItems(selectedCategory);

  return (
    <main className="bg-[var(--color-bg-primary)] min-h-screen">
      <header className="sticky top-0 z-50 bg-blur border-b border-[var(--color-border)] px-5 h-16 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest">Welcome to</span>
          <h1 className="text-xl font-bold text-white tracking-tighter">DigiCrave</h1>
        </div>
        <div className="flex items-center gap-3">
          <OrderTrackerIcon />
          <div className="bg-[var(--color-bg-elevated)] px-3 py-1.5 rounded-lg border border-[var(--color-border)]">
            <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider block">Table</span>
            <span className="text-sm font-black text-white">#12</span>
          </div>
        </div>
      </header>

      <PageWrapper>
        <HeroBanner />
        
        {catsLoading ? (
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-6">
            {[1, 2, 3, 4].map(i => <LoadingSkeleton key={i} variant="category" />)}
          </div>
        ) : (
          <CategoryPills 
            categories={categories || []} 
            selectedId={selectedCategory} 
            onSelect={setSelectedCategory} 
          />
        )}

        <div className="space-y-4">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            Popular Items
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-pulse" />
          </h2>
          
          {itemsLoading ? (
            [1, 2, 3, 4, 5].map(i => <LoadingSkeleton key={i} variant="menu-item" />)
          ) : (
            menuItems?.map((item: any) => (
              <MenuItemCard key={item.id} item={item} />
            ))
          )}
        </div>
      </PageWrapper>
    </main>
  );
};

export default MenuPage;
