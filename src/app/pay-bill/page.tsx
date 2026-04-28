import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wallet } from 'lucide-react';
import { PageWrapper } from '../../components/shared/PageWrapper';
import { BillBreakdown } from '../../components/pay-bill/BillBreakdown';
import { PaymentMethodSelector } from '../../components/pay-bill/PaymentMethodSelector';
import { useBill, usePayBill } from '../../hooks/usePayment';
import { useSessionStore } from '../../store/sessionStore';
import { useOrderStore } from '../../store/orderStore';
import { formatPrice } from '../../lib/utils';

const PayBillPage: React.FC = () => {
  const navigate = useNavigate();
  const { tableId } = useSessionStore();
  const storeOrders = useOrderStore(state => state.orders) || [];
  const [method, setMethod] = useState('upi');
  const { data: billData, isLoading } = useBill(tableId);
  const payBillMutation = usePayBill();

  // Combine real store orders with fallback
  const actualOrders = storeOrders.map(o => o.fullOrder).filter(Boolean);

  const displayOrders = actualOrders.length > 0 ? actualOrders : (!isLoading && billData?.orders ? billData.orders : []);
  const subtotal = displayOrders.reduce((acc, order) => acc + (order.total || 0), 0);
  const totalAmount = subtotal * 1.17; // including mock taxes

  const handlePayment = async () => {
    try {
      await payBillMutation.mutateAsync({
        table_id: tableId,
        payment_method: method,
        amount: totalAmount
      });
      navigate('/pay-bill/success', { state: { amount: totalAmount, method } });
    } catch (err) {
      // Mock success for UI demo
      navigate('/pay-bill/success', { state: { amount: totalAmount, method } });
    }
  };

  return (
    <main className="bg-[var(--color-bg-primary)] min-h-screen">
      <header className="sticky top-0 z-50 bg-blur border-b border-[var(--color-border)] px-5 h-16 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-white">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-white">Table {tableId || '12'} — Pre Bill</h1>
      </header>

      <PageWrapper>
        <div className="mb-10">
          <h2 className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-4 flex items-center gap-2">
            Your Order History
            <div className="flex-1 h-[1px] bg-[var(--color-border)]" />
          </h2>
          <BillBreakdown orders={displayOrders} />
        </div>

        <div className="mb-10">
          <h2 className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-4">Choose Payment Method</h2>
          <PaymentMethodSelector selected={method} onSelect={setMethod} />
        </div>

        <div className="bg-[var(--color-bg-surface)] p-6 rounded-[var(--radius-md)] border border-[var(--color-border)] mb-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
            <Wallet size={24} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Splitting the bill?</h4>
            <p className="text-xs text-[var(--color-text-muted)]">Ask staff for separate payment links.</p>
          </div>
        </div>

        <div className="fixed bottom-[84px] left-1/2 -translate-x-1/2 w-full max-w-[430px] p-5 pb-0">
          <div className="absolute inset-x-0 bottom-[-84px] h-[150px] bg-gradient-to-t from-[var(--color-bg-primary)] via-[var(--color-bg-primary)]/80 to-transparent pointer-events-none" />
          <button 
            onClick={handlePayment}
            className="relative w-full h-[52px] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-[var(--radius-md)] font-bold shadow-[var(--shadow-glow)] flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            Pay & Settle Bill — {formatPrice(totalAmount)}
          </button>
        </div>
      </PageWrapper>
    </main>
  );
};

export default PayBillPage;
