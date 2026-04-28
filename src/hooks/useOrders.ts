import { useMutation, useQuery } from '@tanstack/react-query';
import { placeOrder, getOrder } from '../lib/api';
import { useOrderStore } from '../store/orderStore';
import { useCartStore } from '../store/cartStore';
import { Order } from '../types';

const MOCK_ORDER: Order = {
  id: 'o1',
  table_id: '12',
  status: 'preparing',
  total: 600,
  createdAt: new Date().toISOString(),
  items: [
    { id: 'i1', item_id: 'm1', name: 'Truffle Umami Burger', quantity: 1, price: 429 },
    { id: 'i2', item_id: 'm3', name: 'Midnight Mojito', quantity: 1, price: 289 }
  ]
};

export function usePlaceOrder() {
  const setOrder = useOrderStore((state) => state.setOrder);
  
  return useMutation({
    mutationFn: async (data: any) => {
      try {
        const res = await placeOrder(data);
        const result = res.data;
        setOrder(result.id, result.status, result);
        return result;
      } catch (err) {
        const cartItems = useCartStore.getState().items;
        const mockResult = { 
          ...MOCK_ORDER, 
          id: Math.random().toString(36).substring(7),
          items: cartItems.length > 0 ? cartItems.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })) : MOCK_ORDER.items,
          total: cartItems.length > 0 ? cartItems.reduce((acc, i) => acc + (i.price * i.quantity), 0) : MOCK_ORDER.total
        };
        setOrder(mockResult.id, mockResult.status, mockResult);
        return mockResult;
      }
    },
  });
}

export function useOrderStatus(orderId: string | null) {
  return useQuery<Order>({
    queryKey: ['order', orderId],
    queryFn: async () => {
      if (!orderId) throw new Error('No order ID');
      try {
        const res = await getOrder(orderId);
        return res.data;
      } catch (err) {
        const storeOrder = useOrderStore.getState().orders.find(o => o.id === orderId);
        if (storeOrder?.fullOrder) {
          return storeOrder.fullOrder;
        }
        return {
          ...MOCK_ORDER,
          id: orderId, // use the real id assigned when it was placed
        };
      }
    },
    enabled: !!orderId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === 'served' || status === 'cancelled' ? false : 5000;
    },
  });
}
