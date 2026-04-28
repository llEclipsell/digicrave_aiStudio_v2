import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { KDSOrder } from '../../types';
import { cn } from '../../lib/utils';

interface OrderCardProps {
  order: KDSOrder;
  onStatusUpdate: (orderId: string, nextStatus: string) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onStatusUpdate }) => {
  const [timer, setTimer] = useState(order.elapsedSeconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatElapsed = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isUrgent = timer > 600; // 10 minutes

  const getNextStatusData = () => {
    switch (order.status) {
      case 'pending': return { label: 'Start Preparing', next: 'preparing', color: 'bg-[var(--color-primary)]' };
      case 'preparing': return { label: 'Mark Ready', next: 'ready', color: 'bg-[var(--color-warning)]' };
      case 'ready': return { label: 'Mark Served', next: 'served', color: 'bg-[var(--color-success)]' };
      default: return null;
    }
  };

  const statusAction = getNextStatusData();

  return (
    <div className={cn(
      "bg-[var(--color-bg-surface)] rounded-[var(--radius-md)] border-l-4 p-5 flex flex-col h-full shadow-[var(--shadow-card)]",
      order.status === 'pending' ? "border-[var(--color-primary)]" :
      order.status === 'preparing' ? "border-[var(--color-warning)]" :
      "border-[var(--color-success)]"
    )}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="bg-[var(--color-bg-elevated)] px-3 py-1 rounded-full text-lg font-black text-white">#{order.table_id}</span>
          <p className="text-xs text-[var(--color-text-muted)] mt-2">ID: {order.id.slice(0, 8)}</p>
        </div>
        <div className={cn(
          "flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold",
          isUrgent ? "bg-[var(--color-error)] text-white" : "bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)]"
        )}>
          <Clock size={14} />
          {formatElapsed(timer)}
        </div>
      </div>

      <div className="flex-1 space-y-3 mb-6">
        {Array.isArray(order.items) && order.items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <span className="font-bold text-[var(--color-primary)] text-sm">{item.quantity}×</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">{item.name}</p>
              {item.notes && <p className="text-[10px] italic text-[var(--color-text-muted)] mt-1">{item.notes}</p>}
            </div>
          </div>
        ))}
      </div>

      {statusAction && (
        <button
          onClick={() => onStatusUpdate(order.id, statusAction.next)}
          className={cn(
            "w-full py-3 rounded-[var(--radius-md)] text-white text-xs font-bold uppercase tracking-wider transition-all active:scale-95",
            statusAction.color
          )}
        >
          {statusAction.label}
        </button>
      )}
    </div>
  );
};
