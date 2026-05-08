import { ArrowDownLeft, ArrowUpRight, ChevronRight } from 'lucide-react';
import { useTransactions } from '../../db/useTransactions';
import { formatCurrency } from '../../utils/formatCurrency';
import { timeAgo } from '../../utils/dateHelpers';
import { getCategoryIcon } from '../../utils/categories';
import { useCategories } from '../../db/useSettings';
import { Link } from 'react-router-dom';
import EmptyState from '../common/EmptyState';

export default function RecentTransactions() {
  const transactions = useTransactions({ limit: 5 });
  const categories = useCategories();

  return (
    <div id="dashboard-recent-transactions" className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-surface-500 dark:text-surface-400">
          Transaksi Terakhir
        </h3>
        <Link
          to="/transactions"
          className="flex items-center gap-1 text-xs font-medium text-primary-500 hover:text-primary-600 transition-colors"
        >
          Lihat semua
          <ChevronRight size={14} />
        </Link>
      </div>

      {!transactions || transactions.length === 0 ? (
        <EmptyState
          title="Belum ada transaksi"
          description="Mulai catat pemasukan dan pengeluaranmu"
        />
      ) : (
        <div className="space-y-2">
          {transactions.map((t) => {
            const cat = categories?.find(c => c.name === t.category && c.type === t.type);
            const IconComponent = getCategoryIcon(cat?.icon);
            const isIncome = t.type === 'income';

            return (
              <div
                key={t.id}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-colors"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${cat?.color || '#64748b'}15` }}
                >
                  <IconComponent size={18} style={{ color: cat?.color || '#64748b' }} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-surface-800 dark:text-surface-200 truncate">
                    {t.description || t.category}
                  </p>
                  <p className="text-xs text-surface-400 dark:text-surface-500">
                    {t.category} · {timeAgo(t.date)}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <p className={`text-sm font-semibold ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                    {isIncome ? '+' : '-'}{formatCurrency(t.amount)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
