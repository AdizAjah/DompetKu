import { Trash2, Edit3, CreditCard, Clock, CheckCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/dateHelpers';
import { isPast, parseISO } from 'date-fns';

export default function DebtItem({ debt, onEdit, onDelete, onPay }) {
  const progress = debt.totalAmount > 0 ? (debt.paidAmount / debt.totalAmount) * 100 : 0;
  const remaining = debt.totalAmount - debt.paidAmount;
  const isPaid = debt.status === 'paid';
  const isOverdue = debt.dueDate && !isPaid && isPast(parseISO(debt.dueDate));

  return (
    <div className={`card p-5 transition-all overflow-hidden ${isPaid ? 'opacity-75' : 'card-hover'}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-surface-800 dark:text-surface-200 truncate">
            {debt.creditorName}
          </h3>
          {debt.description && (
            <p className="text-xs text-surface-400 dark:text-surface-500 mt-0.5 truncate">{debt.description}</p>
          )}
        </div>
        <span className={`badge ${isPaid ? 'badge-paid' : 'badge-debt'}`}>
          {isPaid ? '✓ Lunas' : 'Aktif'}
        </span>
      </div>

      {/* Amount */}
      <div className="mb-3">
        <p className="text-xl font-bold text-surface-900 dark:text-white">
          {formatCurrency(debt.totalAmount)}
        </p>
        {!isPaid && (
          <p className="text-xs text-surface-400 dark:text-surface-500 mt-0.5">
            Sisa: <span className="font-semibold text-amber-600 dark:text-amber-400">{formatCurrency(remaining)}</span>
          </p>
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-surface-500 dark:text-surface-400">Dibayar</span>
          <span className="font-medium text-surface-700 dark:text-surface-300">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-surface-100 dark:bg-surface-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${
              isPaid ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      {/* Due date */}
      {debt.dueDate && (
        <div className={`flex items-center gap-1.5 text-xs mb-3 ${
          isOverdue ? 'text-red-500' : 'text-surface-400 dark:text-surface-500'
        }`}>
          <Clock size={12} />
          <span>
            {isOverdue ? 'Terlambat! ' : 'Jatuh tempo: '}
            {formatDate(debt.dueDate)}
          </span>
        </div>
      )}

      {/* Actions */}
      {!isPaid && (
        <div className="flex items-center gap-2 pt-3 border-t border-surface-100 dark:border-surface-700">
          <button
            onClick={onPay}
            className="btn btn-primary flex-1 py-2.5 text-xs"
          >
            <CreditCard size={14} />
            Bayar
          </button>
          <button
            onClick={onEdit}
            className="btn btn-ghost p-2.5"
            aria-label="Edit"
          >
            <Edit3 size={14} />
          </button>
          <button
            onClick={onDelete}
            className="btn btn-ghost p-2.5 hover:!bg-red-100 dark:hover:!bg-red-900/30 hover:!text-red-500"
            aria-label="Hapus"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}

      {isPaid && (
        <div className="flex items-center gap-2 pt-3 border-t border-surface-100 dark:border-surface-700 text-emerald-500">
          <CheckCircle size={14} />
          <span className="text-xs font-medium">Hutang telah dilunasi</span>
        </div>
      )}
    </div>
  );
}
