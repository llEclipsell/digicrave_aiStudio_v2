import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, ShoppingBag } from 'lucide-react';
import { PageWrapper } from '../../components/shared/PageWrapper';
import { useOrderStore } from '../../store/orderStore';
import { useQuery } from '@tanstack/react-query';
import { useOrderStatus } from '../../hooks/useOrders';

const OrderItemCard: React.FC<{ orderId: string }> = ({ orderId }) => {
  const navigate = useNavigate();
  const { data: order, isLoading } = useOrderStatus(orderId);

  if (isLoading) {
    return <div className="p-4 rounded-[var(--radius-md)] border border-[var(--color-border)] animate-pulse bg-[var(--color-bg-surface)] h-24 mb-4" />;
  }

  if (!order) return null;

  return (
    <div className="bg-[var(--color-bg-surface)] rounded-[var(--radius-md)] border border-[var(--color-border)] p-4 flex flex-col gap-3 mb-4">
      <div className="flex justify-between items-center">
        <span className="font-mono text-xs text-white">#{order.id?.substring(0,8).toUpperCase()}</span>
        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-500/20 text-blue-400 uppercase">
          {order.status}
        </span>
      </div>
      
      <div className="text-sm">
        {order.items?.map((item: any, i: number) => (
          <div key={i} className="flex justify-between text-[var(--color-text-body)]">
            <span>{item.quantity}× {item.name}</span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-[var(--color-border)]">
        <span className="text-xs font-bold text-[var(--color-warning)]">UNPAID</span>
        <button 
          onClick={() => navigate(`/order-status?id=${order.id}`)}
          className="text-xs font-bold text-[var(--color-primary)] flex items-center gap-1 hover:underline"
        >
          Track Status
        </button>
      </div>
    </div>
  );
};

const OrdersListPage: React.FC = () => {
  const navigate = useNavigate();
  const orders = useOrderStore((state) => state.orders) || [];

  return (
    <main className="bg-[var(--color-bg-primary)] min-h-screen">
      <header className="sticky top-0 z-50 bg-blur border-b border-[var(--color-border)] px-5 h-16 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-white">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-white">My Orders</h1>
      </header>

      <PageWrapper>
        {!orders || orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-24 text-center">
             <div className="w-32 h-32 bg-[var(--color-bg-surface)] rounded-full flex items-center justify-center mb-6 border border-[var(--color-border)]">
               <Clock size={48} className="text-[var(--color-text-muted)]" />
             </div>
             <h2 className="text-xl font-bold text-white mb-2">No orders yet</h2>
             <p className="text-[var(--color-text-muted)] mb-8">You haven't placed any orders so far.</p>
             <button 
               onClick={() => navigate('/menu')}
               className="bg-[var(--color-primary)] text-white px-10 py-3 rounded-[var(--radius-md)] font-bold"
             >
               Start Ordering
             </button>
          </div>
        ) : (
          <div className="mb-24">
            {orders.map((o) => (
              <OrderItemCard key={o.id} orderId={o.id} />
            ))}

            <div className="fixed bottom-[84px] left-1/2 -translate-x-1/2 w-full max-w-[430px] p-5 pb-0">
              <div className="absolute inset-x-0 bottom-[-84px] h-[150px] bg-gradient-to-t from-[var(--color-bg-primary)] via-[var(--color-bg-primary)]/80 to-transparent pointer-events-none" />
              <button 
                onClick={() => navigate('/pay-bill')}
                className="relative w-full h-[52px] bg-[var(--color-primary)] text-white rounded-[var(--radius-md)] font-bold shadow-[var(--shadow-glow)] flex items-center justify-center"
              >
                Pay Full Bill
              </button>
            </div>
          </div>
        )}
      </PageWrapper>
    </main>
  );
};

export default OrdersListPage;
