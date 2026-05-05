import DebtItem from './DebtItem';
import EmptyState from '../common/EmptyState';
import { Landmark } from 'lucide-react';

export default function DebtList({ debts, onEdit, onDelete, onPay }) {
  if (!debts || debts.length === 0) {
    return (
      <EmptyState
        icon={Landmark}
        title="Belum ada hutang"
        description="Semua kewajiban finansial sudah bersih!"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {debts.map((debt) => (
        <DebtItem
          key={debt.id}
          debt={debt}
          onEdit={() => onEdit(debt)}
          onDelete={() => onDelete(debt.id)}
          onPay={() => onPay(debt)}
        />
      ))}
    </div>
  );
}
