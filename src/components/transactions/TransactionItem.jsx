import { Trash2, Edit3 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import { getCategoryIcon } from '../../utils/categories';
import { useCategories } from '../../db/useSettings';
import { useFundSources } from '../../db/useFundSources';
import { format, parseISO } from 'date-fns';

export default function TransactionItem({ transaction: t, onEdit, onDelete }) {
  const categories = useCategories(t.type);
  const fundSources = useFundSources();
  const cat = categories?.find(c => c.name === t.category);
  const Icon = getCategoryIcon(cat?.icon);
  const isIncome = t.type === 'income';
  const fundSource = t.fundSourceId ? fundSources?.find(s => s.id === t.fundSourceId) : null;

  return (
    <div className="group flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-all">
      {/* Category icon */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${cat?.color || '#64748b'}15` }}
      >
        <Icon size={20} style={{ color: cat?.color || '#64748b' }} />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-surface-800 dark:text-surface-200 truncate">
          {t.description || t.category}
        </p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className={`badge text-[10px] py-0.5 px-2 ${isIncome ? 'badge-income' : 'badge-expense'}`}>
            {t.category}
          </span>
          {fundSource && (
            <span
              className="badge badge-fund-source text-[10px] py-0.5 px-2"
              style={{ backgroundColor: `${fundSource.color}15`, color: fundSource.color }}
            >
              {fundSource.name}
            </span>
          )}
          <span className="text-[11px] text-surface-400 dark:text-surface-500">
            {t.date ? format(parseISO(t.date), 'HH:mm') : ''}
          </span>
        </div>
      </div>

      {/* Amount */}
      <div className="text-right shrink-0">
        <p className={`text-sm font-bold ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
          {isIncome ? '+' : '-'}{formatCurrency(t.amount)}
        </p>
      </div>

      {/* Actions (show on hover) */}
      <div className="hidden group-hover:flex items-center gap-1 shrink-0">
        <button
          onClick={onEdit}
          className="p-2 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-600 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors"
          aria-label="Edit"
        >
          <Edit3 size={14} />
        </button>
        <button
          onClick={onDelete}
          className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-surface-400 hover:text-red-500 transition-colors"
          aria-label="Hapus"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
