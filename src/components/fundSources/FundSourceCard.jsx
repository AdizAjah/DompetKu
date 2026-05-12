import { Banknote, Wallet, Smartphone, MoreHorizontal, Edit3, Trash2, Star } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

const TYPE_ICONS = {
  cash: Wallet,
  bank: Banknote,
  ewallet: Smartphone,
  other: MoreHorizontal,
};

const TYPE_LABELS = {
  cash: 'Tunai',
  bank: 'Bank',
  ewallet: 'E-Wallet',
  other: 'Lainnya',
};

export default function FundSourceCard({ source, stats, onEdit, onDelete }) {
  const Icon = TYPE_ICONS[source.type] || Wallet;
  const typeLabel = TYPE_LABELS[source.type] || 'Lainnya';

  // Build subtitle
  let subtitle = typeLabel;
  if (source.type === 'bank' && source.bankName) {
    subtitle = source.bankName;
    if (source.accountNumber) {
      // Mask account number, show last 4 digits
      const masked = source.accountNumber.length > 4
        ? '••••' + source.accountNumber.slice(-4)
        : source.accountNumber;
      subtitle += ` • ${masked}`;
    }
  } else if (source.type === 'ewallet' && source.bankName) {
    subtitle = source.bankName;
  }

  return (
    <div className="fund-source-card group card card-hover p-4 flex items-start gap-4 relative overflow-hidden">
      {/* Color accent bar */}
      <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl" style={{ backgroundColor: source.color }} />

      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${source.color}15` }}
      >
        <Icon size={22} style={{ color: source.color }} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="text-sm font-semibold text-surface-800 dark:text-surface-200 truncate">
            {source.name}
          </h3>
          {source.isDefault && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              <Star size={10} className="fill-current" />
              Default
            </span>
          )}
        </div>
        <p className="text-xs text-surface-400 dark:text-surface-500 truncate">{subtitle}</p>

        {/* Stats row */}
        {stats && (
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[11px] text-surface-500 dark:text-surface-400">
                {formatCurrency(stats.income)}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span className="text-[11px] text-surface-500 dark:text-surface-400">
                {formatCurrency(stats.expense)}
              </span>
            </div>
            <span className="text-[11px] text-surface-400 dark:text-surface-500 ml-auto">
              {stats.transactionCount} transaksi
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="hidden group-hover:flex items-center gap-1 shrink-0">
        <button
          onClick={() => onEdit(source)}
          className="p-2 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-600 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors"
          aria-label="Edit"
        >
          <Edit3 size={14} />
        </button>
        <button
          onClick={() => onDelete(source.id)}
          className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-surface-400 hover:text-red-500 transition-colors"
          aria-label="Hapus"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
