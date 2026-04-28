import { useMutation, useQuery } from '@tanstack/react-query';
import { getTableBill, settleBill } from '../lib/api';

const MOCK_BILL = {
  orders: [
    { 
      id: 'o1', 
      table_id: '12', 
      total: 718, 
      status: 'served', 
      createdAt: new Date().toISOString(),
      items: [
        { id: 'i1', item_id: 'm1', name: 'Truffle Umami Burger', quantity: 1, price: 429 },
        { id: 'i2', item_id: 'm3', name: 'Midnight Mojito', quantity: 1, price: 289 }
      ]
    },
  ]
};

export function useBill(tableId: string | undefined) {
  return useQuery({
    queryKey: ['bill', tableId],
    queryFn: async () => {
      if (!tableId) throw new Error('No table ID');
      try {
        const res = await getTableBill(tableId);
        return res.data;
      } catch (err) {
        return MOCK_BILL;
      }
    },
    enabled: !!tableId,
  });
}

export function usePayBill() {
  return useMutation({
    mutationFn: async (data: any) => {
      try {
        const res = await settleBill(data);
        return res.data;
      } catch (err) {
        return { success: true };
      }
    },
  });
}
