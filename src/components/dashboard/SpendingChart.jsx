import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useWeeklySpending } from '../../db/useTransactions';
import { formatCompactCurrency } from '../../utils/formatCurrency';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-surface-800 px-4 py-3 rounded-xl shadow-lg border border-surface-200 dark:border-surface-700">
        <p className="text-sm font-semibold text-surface-700 dark:text-surface-200 mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-xs" style={{ color: entry.color }}>
            {entry.name === 'expense' ? 'Pengeluaran' : 'Pemasukan'}: {formatCompactCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function SpendingChart() {
  const data = useWeeklySpending();

  return (
    <div className="card p-6">
      <h3 className="text-sm font-semibold text-surface-500 dark:text-surface-400 mb-4">
        Pengeluaran Minggu Ini
      </h3>
      
      <div className="h-[200px]">
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" vertical={false} />
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 12, fill: '#94a3b8' }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                tickFormatter={(v) => formatCompactCurrency(v)}
                width={60}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148,163,184,0.08)' }} />
              <Bar dataKey="income" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={24} name="income" />
              <Bar dataKey="expense" fill="#ef4444" radius={[6, 6, 0, 0]} maxBarSize={24} name="expense" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-surface-400 dark:text-surface-500 text-sm">
            Belum ada data minggu ini
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-6 mt-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary-500" />
          <span className="text-xs text-surface-500 dark:text-surface-400">Pemasukan</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-xs text-surface-500 dark:text-surface-400">Pengeluaran</span>
        </div>
      </div>
    </div>
  );
}
