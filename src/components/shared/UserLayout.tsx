import React from 'react';
import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';

export const UserLayout: React.FC = () => {
  return (
    <div className="relative min-h-screen">
      <Outlet />
      <BottomNav />
    </div>
  );
};
