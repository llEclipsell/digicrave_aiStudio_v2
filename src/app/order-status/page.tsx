import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, ChevronDown, ArrowLeft } from 'lucide-react';
import { PageWrapper } from '../../components/shared/PageWrapper';
import { OrderStepper } from '../../components/order-status/OrderStepper';
import { useOrderStore } from '../../store/orderStore';
import { useOrderStatus } from '../../hooks/useOrders';
import { wsManager } from '../../lib/websocket';

const OrderStatusPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const storeOrderId = useOrderStore((state) => state.orderId);
  const updateStatus = useOrderStore((state) => state.updateStatus);
  const updateCurrentStatus = useOrderStore((state) => state.updateCurrentStatus);
  
  const orderId = searchParams.get('id') || storeOrderId;

  const { data: order, isLoading } = useOrderStatus(orderId);

  // Hook into WebSocket for live updates
  useEffect(() => {
    if (!orderId) return;
    const path = `/orders/${orderId}`;
    const handleUpdate = (payload: any) => {
      updateStatus(orderId, payload.status);
      if (orderId === storeOrderId) {
        updateCurrentStatus(payload.status);
      }
    };
    
    wsManager.connect(path);
    wsManager.on('ORDER_UPDATE', handleUpdate);

    return () => {
      wsManager.off('ORDER_UPDATE', handleUpdate);
      wsManager.disconnect();
    };
  }, [orderId, updateStatus, storeOrderId, updateCurrentStatus]);

  if (!orderId) {
    return (
      <PageWrapper className="flex flex-col items-center justify-center pt-24 text-center">
        <h2 className="text-xl font-bold text-white mb-2">No active order found</h2>
        <p className="text-[var(--color-text-muted)] mb-8 max-w-[240px]">It looks like you haven't placed an order recently.</p>
        <button 
          onClick={() => navigate('/menu')}
          className="bg-[var(--color-primary)] text-white px-10 py-3 rounded-[var(--radius-md)] font-bold"
        >
          Go to Menu
        </button>
      </PageWrapper>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--color-text-muted)] font-medium">Connecting to kitchen...</p>
        </div>
      </div>
    );
  }

  const isServed = order?.status === 'served' || order?.status === 'ready';

  return (
    <main className="bg-[var(--color-bg-primary)] min-h-screen">
      <header className="sticky top-0 z-50 bg-blur border-b border-[var(--color-border)] px-5 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/menu')} className="text-white hover:text-[var(--color-primary)] transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-bold text-white">Track Your Order</h1>
        </div>
        <span className="text-xs font-bold bg-[var(--color-bg-elevated)] px-3 py-1 rounded-full border border-[var(--color-border)] text-[var(--color-text-muted)]">
          Table 12
        </span>
      </header>

      <PageWrapper>
        <div className="text-center mb-10 py-6">
          <div className="text-5xl font-black text-white mb-2 tabular-nums">
            {order?.status === 'served' ? "00:00" : "15:00"}
          </div>
          <p className="text-[var(--color-text-muted)] text-sm font-medium">Estimated Arrival Time</p>
        </div>

        <div className="bg-[var(--color-bg-surface)] p-8 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-card)] mb-8">
          <OrderStepper status={order?.status || 'pending'} />
        </div>

        {/* Action Button shown when served */}
        {isServed && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button 
              onClick={() => navigate('/pay-bill')}
              className="w-full h-[52px] bg-[var(--color-primary)] text-white rounded-[var(--radius-md)] font-bold shadow-[var(--shadow-glow)] flex items-center justify-center gap-2 group"
            >
              View My Bill
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* Collapsible Summary */}
        <div className="mt-8 border-t border-[var(--color-border)] pt-6">
          <button className="w-full flex justify-between items-center text-sm font-semibold text-white">
            Order Items
            <ChevronDown size={18} className="text-[var(--color-text-muted)]" />
          </button>
          <div className="mt-4 space-y-3">
             {Array.isArray(order?.items) && order?.items.map((item: any, index: number) => (
                <div key={item.id || index} className="flex justify-between text-xs text-[var(--color-text-muted)]">
                  <span>{item.quantity} × {item.name}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
             ))}
          </div>
        </div>
      </PageWrapper>
    </main>
  );
};

export default OrderStatusPage;
