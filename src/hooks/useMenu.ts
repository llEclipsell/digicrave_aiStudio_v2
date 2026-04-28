import { useQuery } from '@tanstack/react-query';
import { getRestaurantMenu } from '../lib/api';
import { Category, MenuItem } from '../types';

const MOCK_CATEGORIES: Category[] = [
  { id: 'c1', name: 'Burgers', icon: '' },
  { id: 'c2', name: 'Pizza', icon: '' },
  { id: 'c3', name: 'Sushi', icon: '' },
  { id: 'c4', name: 'Drinks', icon: '' },
];

const MOCK_ITEMS: MenuItem[] = [
  { 
    id: 'm1', 
    name: 'Truffle Umami Burger', 
    description: 'Caramelized onions, Swiss cheese, truffle aioli', 
    price: 429, 
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=200', 
    categoryId: 'c1' 
  },
  { 
    id: 'm2', 
    name: 'Garden Fresh Pizza', 
    description: 'Bell peppers, olives, mushrooms, farm mozzarella', 
    price: 599, 
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=200', 
    categoryId: 'c2' 
  },
  { 
    id: 'm3', 
    name: 'Midnight Mojito', 
    description: 'Blackberries, fresh mint, lime, brown sugar soda', 
    price: 289, 
    image: 'https://images.unsplash.com/photo-1544145945-f904253d0c7b?auto=format&fit=crop&q=80&w=200', 
    categoryId: 'c4' 
  },
  {
    id: 'm4',
    name: 'Smoky Texas Ribs',
    description: 'Slow-cooked ribs with hickory BBQ sauce',
    price: 849,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800',
    categoryId: 'c1'
  }
];

export function useRestaurantMenu(slug: string = 'digicrave-01') {
  return useQuery({
    queryKey: ['menu', slug],
    queryFn: async () => {
      try {
        const res = await getRestaurantMenu(slug);
        return res.data;
      } catch (err) {
        return { categories: MOCK_CATEGORIES, items: MOCK_ITEMS };
      }
    },
  });
}

export function useCategories() {
  const { data, isLoading } = useRestaurantMenu();
  return { data: data?.categories || [], isLoading };
}

export function useMenuItems(categoryId: string) {
  const { data, isLoading } = useRestaurantMenu();
  const items = data?.items || [];
  if (categoryId === 'all') return { data: items, isLoading };
  return { data: items.filter((item: any) => item.categoryId === categoryId || item.category_id === categoryId), isLoading };
}
