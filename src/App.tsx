import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MenuPage from './app/menu/page';
import CartPage from './app/cart/page';
import OrderStatusPage from './app/order-status/page';
import OrdersListPage from './app/orders/page';
import PayBillPage from './app/pay-bill/page';
import PaymentSuccessPage from './app/pay-bill/success/page';
import FeedbackPage from './app/feedback/page';
import KDSPage from './app/staff/kds/page';
import POSPage from './app/staff/pos/page';
import AdminDashboard from './app/admin/page';
import { UserLayout } from './components/shared/UserLayout';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/menu" replace />} />
          
          {/* User Routes with BottomNav */}
          <Route element={<UserLayout />}>
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/order-status" element={<OrderStatusPage />} />
            <Route path="/orders" element={<OrdersListPage />} />
            <Route path="/pay-bill" element={<PayBillPage />} />
            <Route path="/pay-bill/success" element={<PaymentSuccessPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/profile" element={<div className="p-10 text-center text-[var(--color-text-body)]">Profile Page Placeholder</div>} />
          </Route>
          
          {/* Staff & Admin Routes */}
          <Route path="/staff/kds" element={<KDSPage />} />
          <Route path="/staff/pos" element={<POSPage />} />
          <Route path="/admin" element={<AdminDashboard />} />

        </Routes>
      </Router>
    </QueryClientProvider>
  );
}
