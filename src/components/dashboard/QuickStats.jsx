import { ArrowDownLeft, ArrowUpRight, Landmark, PiggyBank } from 'lucide-react';
import { useMonthlyStats } from '../../db/useTransactions';
import { useTotalDebt } from '../../db/useDebts';
import { useTotalSaved } from '../../db/useSavings';
import { formatCurrency } from '../../utils/formatCurrency';

export default function QuickStats() {
  const monthlyStats = useMonthlyStats();
  const totalDebt = useTotalDebt();
  const totalSaved = useTotalSaved();

  const stats = [
    {
      label: 'Pemasukan',
      value: monthlyStats?.income || 0,
      icon: ArrowDownLeft,
      bgIcon: 'bg-emerald-500/10 dark:bg-emerald-500/15',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      sub: 'Bulan ini'
    },
    {
      label: 'Pengeluaran',
      value: monthlyStats?.expense || 0,
      icon: ArrowUpRight,
      bgIcon: 'bg-red-500/10 dark:bg-red-500/15',
      textColor: 'text-red-600 dark:text-red-400',
      sub: 'Bulan ini'
    },
    {
      label: 'Total Hutang',
      value: totalDebt || 0,
      icon: Landmark,
      bgIcon: 'bg-amber-500/10 dark:bg-amber-500/15',
      textColor: 'text-amber-600 dark:text-amber-400',
      sub: 'Aktif'
    },
    {
      label: 'Tabungan',
      value: totalSaved || 0,
      icon: PiggyBank,
      bgIcon: 'bg-indigo-500/10 dark:bg-indigo-500/15',
      textColor: 'text-indigo-600 dark:text-indigo-400',
      sub: 'Terkumpul'
    }
  ];

  return (
    <div id="dashboard-quick-stats" className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="card card-hover p-4 sm:p-5 min-w-0 overflow-hidden">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className={`p-2 sm:p-2.5 rounded-xl shrink-0 ${stat.bgIcon}`}>
                <Icon size={18} className={stat.textColor} />
              </div>
              <span className="text-xs sm:text-sm font-medium text-surface-500 dark:text-surface-400 truncate">{stat.label}</span>
            </div>
            <p className={`text-base sm:text-xl font-bold ${stat.textColor} animate-count-up truncate`}>
              {formatCurrency(stat.value)}
            </p>
            <p className="text-xs text-surface-400 dark:text-surface-500 mt-1">{stat.sub}</p>
          </div>
        );
      })}
    </div>
  );
}
