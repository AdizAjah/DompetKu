import { PiggyBank, ChevronRight } from 'lucide-react';
import { useActiveSavingsPreview, getSavingsProgressColor } from '../../db/useSavings';
import { formatCurrency } from '../../utils/formatCurrency';
import { Link } from 'react-router-dom';
import EmptyState from '../common/EmptyState';

export default function SavingsWidget() {
  const goals = useActiveSavingsPreview(3);

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-surface-500 dark:text-surface-400">
          Target Tabungan
        </h3>
        <Link to="/savings"
          className="flex items-center gap-1 text-xs font-medium text-primary-500 hover:text-primary-600 transition-colors">
          Lihat semua <ChevronRight size={14} />
        </Link>
      </div>

      {!goals || goals.length === 0 ? (
        <div className="py-8 text-center">
          <PiggyBank size={32} className="mx-auto text-surface-300 dark:text-surface-600 mb-2" />
          <p className="text-sm text-surface-400 dark:text-surface-500">Belum ada target tabungan</p>
          <Link to="/savings" className="text-xs text-primary-500 font-medium mt-1 inline-block">
            Buat target pertama →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => {
            const progress = goal.targetAmount > 0 ? (goal.savedAmount / goal.targetAmount) * 100 : 0;
            const color = getSavingsProgressColor(progress);

            return (
              <div key={goal.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${goal.color}20` }}>
                      <PiggyBank size={12} style={{ color: goal.color }} />
                    </div>
                    <span className="text-sm font-medium text-surface-700 dark:text-surface-300 truncate">
                      {goal.name}
                    </span>
                  </div>
                  <span className="text-xs font-semibold shrink-0 ml-2" style={{ color }}>
                    {Math.min(Math.round(progress), 100)}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-2 bg-surface-100 dark:bg-surface-700 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${Math.min(progress, 100)}%`, backgroundColor: color }} />
                </div>

                <div className="flex items-center justify-between mt-1">
                  <span className="text-[11px] text-surface-400">
                    {formatCurrency(goal.savedAmount)}
                  </span>
                  <span className="text-[11px] text-surface-400">
                    {formatCurrency(goal.targetAmount)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
