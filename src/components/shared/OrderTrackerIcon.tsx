import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Receipt, X, ChevronRight } from 'lucide-react';
import { useOrderStore } from '../../store/orderStore';
import { useOrderStatus } from '../../hooks/useOrders';
import { motion, AnimatePresence } from 'motion/react';

export const OrderTrackerIcon: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const orders = useOrderStore((state) => state.orders) || [];
  const navigate = useNavigate();

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="relative bg-[var(--color-bg-elevated)] p-2 rounded-lg border border-[var(--color-border)] text-white hover:bg-[var(--color-border)] transition-colors"
      >
        <Receipt size={24} />
        {orders.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-[var(--color-primary)] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {orders.length}
          </span>
        )}
      </button>

      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-[80dvh] max-h-[800px] bg-[var(--color-bg-primary)] z-[101] shadow-2xl flex flex-col rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden"
              >
                <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Receipt size={20} className="text-[var(--color-primary)]" />
                    My Orders
                  </h2>
                  <button onClick={() => setIsOpen(false)} className="p-2 text-[var(--color-text-muted)] hover:text-white rounded-full">
                    <X size={20} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {orders.length === 0 ? (
                    <div className="text-center text-[var(--color-text-muted)] pt-10">
                      No orders placed yet.
                    </div>
                  ) : (
                    orders.map(order => (
                      <OrderItemCard key={order.id} orderId={order.id} onClose={() => setIsOpen(false)} />
                    ))
                  )}
                </div>

                {orders.length > 0 && (
                  <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-bg-surface)]">
                    <button 
                      onClick={() => {
                        setIsOpen(false);
                        navigate('/pay-bill');
                      }}
                      className="w-full h-12 bg-[var(--color-primary)] text-white rounded-[var(--radius-md)] font-bold shadow-[var(--shadow-glow)] flex items-center justify-center"
                    >
                      Pay Full Bill
                    </button>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

const OrderItemCard: React.FC<{ orderId: string, onClose: () => void }> = ({ orderId, onClose }) => {
  const navigate = useNavigate();
  const { data: order, isLoading } = useOrderStatus(orderId);

  if (isLoading) {
    return <div className="p-4 rounded-lg border border-[var(--color-border)] animate-pulse bg-[var(--color-bg-surface)] h-24"></div>;
  }

  if (!order) return null;

  const total = order.items?.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0) || 0;

  return (
    <div className="bg-[var(--color-bg-surface)] rounded-lg border border-[var(--color-border)] p-4 flex flex-col gap-3">
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
          onClick={() => {
            onClose();
            navigate(`/order-status?id=${order.id}`);
          }}
          className="text-xs font-bold text-[var(--color-primary)] flex items-center gap-1 hover:underline"
        >
          Track Status <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};
