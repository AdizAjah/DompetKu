import SavingsItem from './SavingsItem';
import EmptyState from '../common/EmptyState';
import { PiggyBank } from 'lucide-react';

export default function SavingsList({ goals, onEdit, onDelete, onDeposit, onWithdraw }) {
  if (!goals || goals.length === 0) {
    return (
      <EmptyState
        icon={PiggyBank}
        title="Belum ada target tabungan"
        description="Buat target pertamamu dan mulai menabung!"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {goals.map((goal) => (
        <SavingsItem
          key={goal.id}
          goal={goal}
          onEdit={() => onEdit(goal)}
          onDelete={() => onDelete(goal.id)}
          onDeposit={() => onDeposit(goal)}
          onWithdraw={() => onWithdraw(goal)}
        />
      ))}
    </div>
  );
}
