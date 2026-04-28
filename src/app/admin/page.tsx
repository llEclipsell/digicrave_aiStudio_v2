import React from 'react';
import { LayoutDashboard, ShoppingCart, Users, CreditCard, Flame, Settings, LogOut, TrendingUp } from 'lucide-react';
import { StatCard } from '../../components/admin/StatCard';
import { RevenueChart } from '../../components/admin/RevenueChart';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { formatPrice } from '../../lib/utils';
import { cn } from '../../lib/utils';

const AdminDashboard: React.FC = () => {
  const recentOrders = [
    { id: 'ORD-001', table: '12', items: 'Ramen, Gyoza', total: 840, status: 'ready' as const, time: '10m ago' },
    { id: 'ORD-002', table: '04', items: 'Miso Soup', total: 210, status: 'preparing' as const, time: '14m ago' },
    { id: 'ORD-003', table: '08', items: 'Sushi Platter', total: 1450, status: 'pending' as const, time: '2m ago' },
    { id: 'ORD-004', table: '15', items: 'Soda, Fries', total: 320, status: 'served' as const, time: '1h ago' },
  ];

  return (
    <main className="bg-[#000] min-h-screen flex text-white font-sans">
      {/* Sidebar */}
      <aside className="w-[260px] bg-[var(--color-bg-surface)] border-r border-[var(--color-border)] flex flex-col p-6">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-[var(--color-primary)] rounded-xl flex items-center justify-center font-black text-xl italic shadow-[var(--shadow-glow)]">D</div>
          <span className="text-xl font-black tracking-tighter">DigiCrave</span>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { icon: LayoutDashboard, label: 'Dashboard', active: true },
            { icon: Flame, label: 'Live KDS' },
            { icon: CreditCard, label: 'Payments' },
            { icon: Users, label: 'Staff Management' },
            { icon: Settings, label: 'Settings' },
          ].map((item) => (
            <button
               key={item.label}
               className={cn(
                 "w-full flex items-center gap-4 px-4 py-3 rounded-[var(--radius-md)] text-xs font-bold uppercase tracking-widest transition-all",
                 item.active ? "bg-[var(--color-primary-muted)] text-[var(--color-primary)]" : "text-gray-500 hover:text-white"
               )}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <button className="flex items-center gap-4 px-4 py-3 rounded-[var(--radius-md)] text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-[var(--color-error)] transition-all">
          <LogOut size={18} />
          Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-10 overflow-y-auto no-scrollbar">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black">Performance Dashboard</h1>
            <p className="text-[var(--color-text-muted)] text-sm font-medium mt-1">Real-time overview of DigiCrave restaurant metrics</p>
          </div>
          <button className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:border-white transition-all">
             Export Report
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard label="Today's Revenue" value={84250} isCurrency trend={12.4} />
          <StatCard label="Orders Today" value={142} trend={-2.1} />
          <StatCard label="Active Tables" value="18/24" />
          <StatCard label="Avg. Order Value" value={593} isCurrency trend={5.2} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="xl:col-span-2">
            <RevenueChart />
          </div>

          {/* Top Items */}
          <div className="bg-[var(--color-bg-surface)] p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-card)]">
             <div className="flex items-center justify-between mb-8">
               <h3 className="text-lg font-bold text-white">Top Selling Items</h3>
               <TrendingUp size={18} className="text-[var(--color-primary)]" />
             </div>
             <div className="space-y-6">
                {[
                  { name: 'House Ramen', sales: 42, percentage: 80 },
                  { name: 'Dragon Sushi', sales: 38, percentage: 70 },
                  { name: 'Miso Chicken', sales: 31, percentage: 55 },
                  { name: 'Iced Matcha', sales: 28, percentage: 45 },
                ].map(item => (
                  <div key={item.name} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                       <span className="text-white uppercase tracking-wider">{item.name}</span>
                       <span className="text-[var(--color-primary)]">{item.sales} sold</span>
                    </div>
                    <div className="h-1.5 bg-gray-900 rounded-full overflow-hidden">
                       <div className="h-full bg-[var(--color-primary)] rounded-full" style={{ width: `${item.percentage}%` }} />
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="mt-10 bg-[var(--color-bg-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-card)] overflow-hidden">
          <div className="p-6 border-b border-[var(--color-border)] flex justify-between items-center">
            <h3 className="text-lg font-bold text-white">Recent Orders</h3>
            <button className="text-[var(--color-primary)] text-xs font-bold uppercase tracking-widest hover:underline">View All</button>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[var(--color-bg-elevated)]/50">
                <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Order ID</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Table</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Items</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Total</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {Array.isArray(recentOrders) && recentOrders.map(order => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors cursor-pointer">
                  <td className="px-6 py-4 text-xs font-bold text-white">{order.id}</td>
                  <td className="px-6 py-4 text-xs font-semibold text-gray-400">#{order.table}</td>
                  <td className="px-6 py-4 text-xs text-gray-400">{order.items}</td>
                  <td className="px-6 py-4 text-xs font-bold text-[var(--color-primary)]">{formatPrice(order.total)}</td>
                  <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                  <td className="px-6 py-4 text-xs text-[var(--color-text-muted)] italic">{order.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;
