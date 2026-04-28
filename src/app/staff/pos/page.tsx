import React, { useState, useEffect } from 'react';
import { LayoutGrid, ScrollText, Calendar } from 'lucide-react';
import { TableGrid } from '../../../components/staff/TableGrid';
import { Table } from '../../../types';
import { getStaffTables, clearTable } from '../../../lib/api';
import { cn, formatTime } from '../../../lib/utils';

const POSPage: React.FC = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    try {
      const res = await getStaffTables();
      setTables(res.data);
    } catch (err) {
      // Mock tables
      const mock: Table[] = Array.from({ length: 24 }, (_, i) => ({
        id: `t${i+1}`,
        number: (i+1).toString().padStart(2, '0'),
        status: i % 5 === 0 ? 'bill_requested' : (i % 3 === 0 ? 'occupied' : 'available')
      }));
      setTables(mock);
    }
  };

  const handleClearTable = async (id: string) => {
    try {
      await clearTable(id);
      setTables(prev => prev.map(t => t.id === id ? { ...t, status: 'available' } : t));
      setSelectedTable(null);
    } catch (err) {
      setTables(prev => prev.map(t => t.id === id ? { ...t, status: 'available' } : t));
      setSelectedTable(null);
    }
  };

  return (
    <main className="bg-[var(--color-bg-primary)] min-h-screen flex text-white relative">
      <div className="flex-1 p-8 overflow-y-auto no-scrollbar">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black tracking-tight">Table Management</h1>
            <div className="flex items-center gap-4 mt-2 text-gray-500 font-bold uppercase text-[10px] tracking-widest">
               <div className="flex items-center gap-2"><Calendar size={12} /> Apr 28, 2026</div>
               <div className="flex items-center gap-2"><LayoutGrid size={12} /> 24 Total Tables</div>
            </div>
          </div>
          
          <div className="flex gap-4">
             {['available', 'occupied', 'bill_requested'].map(status => (
                <div key={status} className="flex items-center gap-2">
                   <div className={cn(
                      "w-2 h-2 rounded-full",
                      status === 'occupied' ? "bg-[var(--color-warning)]" :
                      status === 'bill_requested' ? "bg-[var(--color-primary)]" : "bg-gray-600"
                   )} />
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{status.replace('_', ' ')}</span>
                </div>
             ))}
          </div>
        </header>

        <TableGrid tables={tables} onTableSelect={setSelectedTable} />
      </div>

      {/* Side Panel */}
      {selectedTable && (
        <div className="w-[400px] bg-[var(--color-bg-surface)] border-l border-[var(--color-border)] p-8 animate-in slide-in-from-right duration-300 shadow-2xl flex flex-col">
          <div className="flex justify-between items-start mb-10">
             <div>
                <h2 className="text-4xl font-black text-white">Table {selectedTable.number}</h2>
                <p className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-[0.3em] mt-2">{selectedTable.status.replace('_', ' ')}</p>
             </div>
             <button onClick={() => setSelectedTable(null)} className="text-gray-500 hover:text-white transition-colors">
                CLOSE
             </button>
          </div>

          <div className="flex-1">
             <div className="bg-[var(--color-bg-elevated)] p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] mb-8">
                <h3 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-4 flex items-center gap-2">
                   <ScrollText size={14} /> Active Orders
                </h3>
                <div className="space-y-4">
                   <div className="flex justify-between text-sm">
                      <span className="text-white">Ordered Items (8)</span>
                      <span className="font-bold">₹1,240</span>
                   </div>
                   <p className="text-xs text-gray-500">Seated at {formatTime(new Date())}</p>
                </div>
             </div>
          </div>

          <div className="space-y-3">
             <button className="w-full py-4 rounded-[var(--radius-md)] bg-[var(--color-bg-elevated)] text-[var(--color-text-body)] font-bold text-sm transition-all hover:bg-gray-800">
                View Detailed Bill
             </button>
             <button className="w-full py-4 rounded-[var(--radius-md)] bg-[var(--color-bg-elevated)] text-[var(--color-text-body)] font-bold text-sm transition-all hover:bg-gray-800">
                Add New Order
             </button>
             {selectedTable.status === 'bill_requested' && (
                <button 
                  onClick={() => handleClearTable(selectedTable.id)}
                  className="w-full py-4 rounded-[var(--radius-md)] bg-[var(--color-success)] text-white font-bold text-sm shadow-lg shadow-green-500/10 active:scale-95 transition-all"
                >
                  Confirm Settle & Clear Table
                </button>
             )}
          </div>
        </div>
      )}
    </main>
  );
};

export default POSPage;
