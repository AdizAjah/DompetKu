import TransactionItem from './TransactionItem';
import EmptyState from '../common/EmptyState';
import { ArrowLeftRight } from 'lucide-react';
import { groupByDate } from '../../utils/dateHelpers';

export default function TransactionList({ transactions, onEdit, onDelete }) {
  if (!transactions || transactions.length === 0) {
    return (
      <EmptyState
        icon={ArrowLeftRight}
        title="Belum ada transaksi"
        description="Tap tombol + untuk mulai mencatat pemasukan atau pengeluaran"
      />
    );
  }

  const groups = groupByDate(transactions);

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group.date}>
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider">
              {group.label}
            </h3>
            <div className="flex-1 h-px bg-surface-200 dark:bg-surface-700" />
          </div>
          <div className="space-y-1">
            {group.transactions.map((t) => (
              <TransactionItem
                key={t.id}
                transaction={t}
                onEdit={() => onEdit(t)}
                onDelete={() => onDelete(t.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
