import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, ArrowRight, Utensils } from 'lucide-react';
import { motion } from 'motion/react';
import { useCartStore } from '../../../store/cartStore';
import { useOrderStore } from '../../../store/orderStore';
import { formatPrice } from '../../../lib/utils';

const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const clearCart = useCartStore(state => state.clearCart);
  const clearOrders = useOrderStore(state => state.clearOrders);
  
  const amount = location.state?.amount || 936;
  const method = location.state?.method || 'UPI';

  useEffect(() => {
    // Clear state on mount
    clearCart();
    clearOrders();
    // Keep orderId for receipt view if needed, but clear for new session
  }, [clearCart, clearOrders]);

  return (
    <main className="bg-[var(--color-bg-primary)] min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-10">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200 }}
          className="w-24 h-24 bg-[var(--color-primary)] rounded-full flex items-center justify-center z-10 relative"
        >
          <Check size={48} className="text-white" strokeWidth={4} />
        </motion.div>
        <motion.div 
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
          className="absolute inset-0 bg-[var(--color-primary)] rounded-full -z-10"
        />
      </div>

      <motion.h1 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-3xl font-black text-white mb-2"
      >
        Payment Successful!
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-[var(--color-text-muted)] mb-10"
      >
        Thank you for dining with us. See you again!
      </motion.p>

      {/* Mock Receipt Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        className="w-full max-w-[340px] bg-[var(--color-bg-surface)] p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-elevated)] space-y-4 mb-10"
      >
        <div className="flex justify-between text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
          <span>Order Ref</span>
          <span>#MEW-2941-K</span>
        </div>
        <div className="h-[1px] bg-dashed border-b border-[var(--color-border)] w-full" />
        <div className="flex justify-between items-center px-2">
           <div className="text-left">
              <span className="text-[10px] text-[var(--color-text-muted)] uppercase block">Amount Paid</span>
              <span className="text-xl font-bold text-white">{formatPrice(amount)}</span>
           </div>
           <div className="text-right">
              <span className="text-[10px] text-[var(--color-text-muted)] uppercase block">Method</span>
              <span className="text-sm font-semibold text-[var(--color-success)] uppercase">{method}</span>
           </div>
        </div>
        <div className="text-[10px] text-[var(--color-text-muted)] pt-2">
           {new Date().toLocaleString()}
        </div>
      </motion.div>

      <div className="w-full max-w-[340px] flex flex-col gap-4">
        <button 
          onClick={() => navigate('/feedback')}
          className="w-full h-[52px] bg-[var(--color-primary)] text-white rounded-[var(--radius-md)] font-bold shadow-[var(--shadow-glow)] flex items-center justify-center gap-2 group transition-all active:scale-95"
        >
          Rate Your Experience
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
        <button 
          onClick={() => {
            clearOrders();
            navigate('/menu');
          }}
          className="w-full h-[52px] text-[var(--color-text-muted)] hover:text-white rounded-[var(--radius-md)] font-bold flex items-center justify-center gap-2 transition-colors"
        >
          <Utensils size={18} />
          Back to Menu
        </button>
      </div>
    </main>
  );
};

export default PaymentSuccessPage;
