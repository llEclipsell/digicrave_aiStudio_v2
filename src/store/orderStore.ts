import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OrderStatus } from '../types';

interface OrderInfo {
  id: string;
  status: OrderStatus;
  fullOrder?: any;
}

interface OrderState {
  orderId: string | null; // Keep for backward compatibility 
  orderStatus: OrderStatus | null; // Keep for backward compatibility
  orders: OrderInfo[];
  paymentId: string | null;
  paymentDetails: any | null;
  addOrder: (id: string, status: OrderStatus, fullOrder?: any) => void;
  setOrder: (id: string, status: OrderStatus, fullOrder?: any) => void;
  updateStatus: (id: string, status: OrderStatus) => void;
  updateCurrentStatus: (status: OrderStatus) => void;
  setPayment: (id: string, details: any) => void;
  clearOrders: () => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      orderId: null,
      orderStatus: null,
      orders: [],
      paymentId: null,
      paymentDetails: null,
      addOrder: (id, status, fullOrder) => set((state) => {
        const currentOrders = state.orders || [];
        const existing = currentOrders.find(o => o.id === id);
        if (existing) return state;
        return { 
          orders: [...currentOrders, { id, status, fullOrder }],
          orderId: id,
          orderStatus: status
        };
      }),
      setOrder: (id, status, fullOrder) => set((state) => {
        const currentOrders = state.orders || [];
        return { 
          orderId: id, 
          orderStatus: status,
          orders: currentOrders.some(o => o.id === id) ? currentOrders.map(o => o.id === id ? { ...o, status, fullOrder: fullOrder || o.fullOrder } : o) : [...currentOrders, { id, status, fullOrder }]
        };
      }),
      updateStatus: (id, status) => set((state) => {
        const currentOrders = state.orders || [];
        return {
          orders: currentOrders.map(o => o.id === id ? { ...o, status } : o),
          orderStatus: state.orderId === id ? status : state.orderStatus
        };
      }),
      updateCurrentStatus: (status) => set((state) => {
        const currentOrders = state.orders || [];
        return {
          orderStatus: status,
          orders: state.orderId ? currentOrders.map(o => o.id === state.orderId ? { ...o, status } : o) : currentOrders
        };
      }),
      setPayment: (id, details) => set({ paymentId: id, paymentDetails: details }),
      clearOrders: () => set({ orderId: null, orderStatus: null, orders: [], paymentId: null, paymentDetails: null }),
    }),
    {
      name: 'order-storage',
    }
  )
);
