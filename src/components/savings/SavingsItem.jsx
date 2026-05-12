import { Trash2, Edit3, PiggyBank, Clock, CheckCircle, ArrowDownToLine, ArrowUpFromLine, Calendar } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/dateHelpers';
import { calculateDailySaving, getSavingsProgressColor } from '../../db/useSavings';
import { isPast, parseISO, differenceInDays } from 'date-fns';

export default function SavingsItem({ goal, onEdit, onDelete, onDeposit, onWithdraw }) {
  const progress = goal.targetAmount > 0 ? (goal.savedAmount / goal.targetAmount) * 100 : 0;
  const remaining = goal.targetAmount - goal.savedAmount;
  const isReached = goal.status === 'reached';
  const progressColor = getSavingsProgressColor(progress);
  const dailySaving = calculateDailySaving(goal.targetAmount, goal.savedAmount, goal.targetDate);

  const isOverdue = goal.targetDate && !isReached && isPast(parseISO(goal.targetDate));
  const daysLeft = goal.targetDate && !isReached
    ? differenceInDays(parseISO(goal.targetDate), new Date())
    : null;

  return (
    <div className={`card p-5 transition-all overflow-hidden ${isReached ? 'opacity-80' : 'card-hover'}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${goal.color || '#6366f1'}20` }}>
            <PiggyBank size={20} style={{ color: goal.color || '#6366f1' }} />
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-surface-800 dark:text-surface-200 truncate">
              {goal.name}
            </h3>
            {goal.description && (
              <p className="text-xs text-surface-400 dark:text-surface-500 truncate">{goal.description}</p>
            )}
          </div>
        </div>
        <span className={`badge shrink-0 ml-2 ${isReached ? 'badge-paid' : 'badge-debt'}`}>
          {isReached ? '✓ Tercapai' : 'Aktif'}
        </span>
      </div>

      {/* Amount info */}
      <div className="mb-3">
        <div className="flex items-baseline justify-between">
          <p className="text-xl font-bold text-surface-900 dark:text-white">
            {formatCurrency(goal.savedAmount)}
          </p>
          <p className="text-sm text-surface-400 dark:text-surface-500">
            / {formatCurrency(goal.targetAmount)}
          </p>
        </div>
      </div>

      {/* Progress bar — color transitions red→orange→yellow→green→emerald */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-surface-500 dark:text-surface-400">Progres</span>
          <span className="font-semibold" style={{ color: progressColor }}>
            {Math.min(Math.round(progress), 100)}%
          </span>
        </div>
        <div className="h-2.5 bg-surface-100 dark:bg-surface-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${Math.min(progress, 100)}%`, backgroundColor: progressColor }}
          />
        </div>
      </div>

      {/* Remaining & estimate */}
      {!isReached && (
        <div className="space-y-1.5 mb-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-surface-400">Sisa dibutuhkan</span>
            <span className="font-semibold text-surface-700 dark:text-surface-300">{formatCurrency(remaining)}</span>
          </div>

          {dailySaving !== null && dailySaving > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-indigo-500 dark:text-indigo-400">
              <Calendar size={12} />
              <span>Tabung {formatCurrency(dailySaving)}/hari untuk tepat waktu</span>
            </div>
          )}
        </div>
      )}

      {/* Target date */}
      {goal.targetDate && (
        <div className={`flex items-center gap-1.5 text-xs mb-3 ${
          isOverdue ? 'text-red-500' : 'text-surface-400 dark:text-surface-500'
        }`}>
          <Clock size={12} />
          <span>
            {isOverdue
              ? `Terlambat! Target: ${formatDate(goal.targetDate)}`
              : daysLeft !== null
                ? `${daysLeft} hari lagi · ${formatDate(goal.targetDate)}`
                : formatDate(goal.targetDate)
            }
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-surface-100 dark:border-surface-700">
        {!isReached ? (
          <>
            <button onClick={onDeposit} className="btn btn-primary flex-1 py-2.5 text-xs">
              <ArrowDownToLine size={14} />
              Tabung
            </button>
            {goal.savedAmount > 0 && (
              <button onClick={onWithdraw} className="btn btn-secondary py-2.5 text-xs">
                <ArrowUpFromLine size={14} />
              </button>
            )}
          </>
        ) : (
          <div className="flex items-center gap-2 text-emerald-500 flex-1">
            <CheckCircle size={14} />
            <span className="text-xs font-medium">Target tercapai! 🎉</span>
          </div>
        )}
        <button onClick={onEdit} className="btn btn-ghost p-2.5" aria-label="Edit">
          <Edit3 size={14} />
        </button>
        <button onClick={onDelete}
          className="btn btn-ghost p-2.5 hover:!bg-red-100 dark:hover:!bg-red-900/30 hover:!text-red-500"
          aria-label="Hapus">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
