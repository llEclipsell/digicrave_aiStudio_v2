import React from 'react';

interface LoadingSkeletonProps {
  variant: 'menu-item' | 'category' | 'order-card';
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ variant }) => {
  if (variant === 'menu-item') {
    return (
      <div className="flex items-center gap-4 bg-[var(--color-bg-surface)] p-4 rounded-[var(--radius-md)] border border-[var(--color-border)] animate-pulse">
        <div className="w-20 h-20 bg-[var(--color-bg-elevated)] rounded-md" />
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-[var(--color-bg-elevated)] rounded-full w-3/4" />
          <div className="h-3 bg-[var(--color-bg-elevated)] rounded-full w-1/2" />
          <div className="h-4 bg-[var(--color-bg-elevated)] rounded-full w-1/4" />
        </div>
      </div>
    );
  }

  if (variant === 'category') {
    return (
      <div className="h-10 w-24 bg-[var(--color-bg-surface)] rounded-full border border-[var(--color-border)] animate-pulse" />
    );
  }

  return (
    <div className="bg-[var(--color-bg-surface)] p-4 rounded-[var(--radius-md)] border border-[var(--color-border)] animate-pulse space-y-4">
      <div className="h-4 bg-[var(--color-bg-elevated)] rounded-full w-1/2" />
      <div className="space-y-2">
        <div className="h-3 bg-[var(--color-bg-elevated)] rounded-full" />
        <div className="h-3 bg-[var(--color-bg-elevated)] rounded-full w-5/6" />
      </div>
    </div>
  );
};
