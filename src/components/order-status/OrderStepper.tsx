import React from 'react';
import { CheckCircle2, ChefHat, Bell, Utensils, Flame } from 'lucide-react';
import { motion } from 'motion/react';
import { OrderStatus } from '../../types';
import { cn } from '../../lib/utils';

interface OrderStepperProps {
  status: OrderStatus;
}

export const OrderStepper: React.FC<OrderStepperProps> = ({ status }) => {
  const steps = [
    { key: 'pending', label: 'Order Placed', desc: 'We have received your order', icon: CheckCircle2 },
    { key: 'preparing', label: 'Preparing', desc: 'Chefs are working their magic', icon: Flame },
    { key: 'ready', label: 'Ready', desc: 'Piping hot and ready to serve', icon: Bell },
    { key: 'served', label: 'Served', desc: 'Enjoy your delicious meal', icon: Utensils },
  ];

  const getStatusIndex = (s: OrderStatus) => {
    if (s === 'cancelled') return -1;
    return steps.findIndex(step => step.key === s);
  };

  const currentIndex = getStatusIndex(status);

  return (
    <div className="space-y-8 relative before:content-[''] before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[var(--color-border)]">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex || status === 'served';
        const isActive = index === currentIndex && status !== 'served';
        const Icon = step.icon;

        return (
          <div key={step.key} className="flex gap-6 relative">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-500",
              isCompleted ? "bg-[var(--color-success)] text-white" : 
              isActive ? "bg-[var(--color-primary)] text-white shadow-[var(--shadow-glow)] animate-pulse-ring" :
              "bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] border border-[var(--color-border)]"
            )}>
              <Icon size={20} />
            </div>
            <div className="flex-1 pt-1">
              <h3 className={cn(
                "text-sm font-bold transition-colors",
                isActive ? "text-[var(--color-primary)]" : isCompleted ? "text-[var(--color-success)]" : "text-[var(--color-text-muted)]"
              )}>
                {step.label}
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">{step.desc}</p>
              {isActive && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 text-[var(--color-primary)] text-[10px] font-bold uppercase tracking-widest"
                >
                  In Progress...
                </motion.div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
