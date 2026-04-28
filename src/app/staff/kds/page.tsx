import React, { useState, useEffect } from 'react';
import { ChefHat, Wifi, WifiOff } from 'lucide-react';
import { OrderCard } from '../../../components/staff/OrderCard';
import { KDSOrder } from '../../../types';
import { getActiveOrders, updateOrderStatus } from '../../../lib/api';
import { wsManager } from '../../../lib/websocket';

const KDSPage: React.FC = () => {
  const [orders, setOrders] = useState<KDSOrder[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    loadActiveOrders();
    return () => clearInterval(timer);
  }, []);

  const loadActiveOrders = async () => {
    try {
      const res = await getActiveOrders();
      setOrders(res.data);
    } catch (err) {
      // Mock data for demo
      setOrders([
        { 
          id: 'o1', table_id: '12', status: 'pending', total: 600, elapsedSeconds: 120, createdAt: '',
          items: [{id: 'i1', item_id: 'm1', name: 'Manchow Soup', quantity: 2, price: 180, notes: 'Extra spicy please'}]
        },
        { 
          id: 'o2', table_id: '04', status: 'preparing', total: 450, elapsedSeconds: 610, createdAt: '',
          items: [{id: 'i2', item_id: 'm3', name: 'Chicken Clear Soup', quantity: 1, price: 210}]
        },
        { 
          id: 'o3', table_id: '08', status: 'ready', total: 300, elapsedSeconds: 450, createdAt: '',
          items: [{id: 'i3', item_id: 'm5', name: 'Vegetable Grills', quantity: 1, price: 300}]
        }
      ]);
    }
  };

  useEffect(() => {
    const handleNewOrder = (newOrder: any) => {
      setOrders(prev => [newOrder, ...prev]);
    };
    wsManager.connect('/ws/kitchen');
    wsManager.on('NEW_ORDER', handleNewOrder);
    return () => {
      wsManager.off('NEW_ORDER', handleNewOrder);
      wsManager.disconnect();
    };
  }, []);

  const handleStatusUpdate = async (orderId: string, nextStatus: any) => {
    try {
      await updateOrderStatus(orderId, nextStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: nextStatus } : o));
    } catch (err) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: nextStatus } : o));
    }
  };

  return (
    <main className="bg-[#000] min-h-screen p-6 text-white overflow-hidden flex flex-col">
      <header className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[var(--color-primary)] rounded-xl flex items-center justify-center">
            <ChefHat size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">KITCHEN DISPLAY</h1>
            <div className="flex items-center gap-2">
              <span className={isConnected ? "text-[var(--color-success)]" : "text-[var(--color-error)]"}>
                {isConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
              </span>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                {isConnected ? "Live Connection Active" : "Offline Mode"}
              </span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-3xl font-black tabular-nums">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Tuesday, April 28 2026</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {Array.isArray(orders) && orders.filter(o => o.status !== 'served').map(order => (
            <OrderCard 
              key={order.id} 
              order={order} 
              onStatusUpdate={handleStatusUpdate} 
            />
          ))}
        </div>
      </div>

      {orders.length === 0 && (
         <div className="flex-1 flex flex-col items-center justify-center opacity-20">
            <ChefHat size={120} />
            <p className="text-2xl font-bold mt-4">Kitchen is currently empty</p>
         </div>
      )}
    </main>
  );
};

export default KDSPage;
