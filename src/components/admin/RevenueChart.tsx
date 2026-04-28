import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const data = [
  { day: 'Mon', revenue: 42000 },
  { day: 'Tue', revenue: 38000 },
  { day: 'Wed', revenue: 52000 },
  { day: 'Thu', revenue: 48000 },
  { day: 'Fri', revenue: 71000 },
  { day: 'Sat', revenue: 84000 },
  { day: 'Sun', revenue: 79000 },
];

export const RevenueChart: React.FC = () => {
  return (
    <div className="h-[350px] w-full bg-[var(--color-bg-surface)] p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-card)]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-white">Weekly Revenue</h3>
        <select className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-md text-xs px-3 py-1 outline-none text-[var(--color-text-muted)] cursor-pointer">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
          <XAxis 
            dataKey="day" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#888', fontSize: 12 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#888', fontSize: 12 }} 
            tickFormatter={(value) => `₹${value/1000}k`}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px' }}
            itemStyle={{ color: '#E8341C' }}
          />
          <Area 
            type="monotone" 
            dataKey="revenue" 
            stroke="#E8341C" 
            strokeWidth={3} 
            fillOpacity={1} 
            fill="url(#colorRev)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
