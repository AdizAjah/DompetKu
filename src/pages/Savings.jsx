import { useState } from 'react';
import Header from '../components/layout/Header';
import SavingsList from '../components/savings/SavingsList';
import SavingsForm from '../components/savings/SavingsForm';
import SavingsDepositForm from '../components/savings/SavingsDepositForm';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useSavings, useTotalSaved, deleteSavingsGoal } from '../db/useSavings';
import { formatCurrency } from '../utils/formatCurrency';
import { Plus, PiggyBank, Target } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Savings() {
  const [statusFilter, setStatusFilter] = useState('active');
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [depositGoal, setDepositGoal] = useState(null);
  const [withdrawGoal, setWithdrawGoal] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const goals = useSavings(statusFilter);
  const totalSaved = useTotalSaved();

  const activeGoals = useSavings('active');
  const totalTarget = activeGoals?.reduce((s, g) => s + g.targetAmount, 0) || 0;

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteSavingsGoal(deleteId);
      toast.success('Target dihapus');
      setDeleteId(null);
    } catch (error) {
      toast.error('Gagal menghapus');
    }
  };

  return (
    <div>
      <Header
        title="Tabungan"
        subtitle="Kelola target tabunganmu"
        action={
          <button onClick={() => { setEditData(null); setShowForm(true); }} className="btn btn-primary">
            <Plus size={18} />
            <span className="hidden sm:inline">Target Baru</span>
          </button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="card p-5">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/15">
              <PiggyBank size={24} className="text-indigo-500" />
            </div>
            <div>
              <p className="text-sm text-surface-500 dark:text-surface-400">Total Ditabung</p>
              <p className="text-2xl font-bold text-surface-900 dark:text-white animate-count-up">
                {formatCurrency(totalSaved || 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-violet-500/10 dark:bg-violet-500/15">
              <Target size={24} className="text-violet-500" />
            </div>
            <div>
              <p className="text-sm text-surface-500 dark:text-surface-400">Total Target</p>
              <p className="text-2xl font-bold text-surface-900 dark:text-white animate-count-up">
                {formatCurrency(totalTarget)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex gap-1 p-1 bg-surface-100 dark:bg-surface-800 rounded-xl mb-6 w-fit">
        {[
          { value: 'active', label: 'Aktif' },
          { value: 'reached', label: 'Tercapai' },
        ].map(({ value, label }) => (
          <button key={value} onClick={() => setStatusFilter(value)}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all
              ${statusFilter === value
                ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-white shadow-sm'
                : 'text-surface-500 dark:text-surface-400'
              }`}>
            {label}
          </button>
        ))}
      </div>

      {/* Savings List */}
      <SavingsList
        goals={goals}
        onEdit={(goal) => { setEditData(goal); setShowForm(true); }}
        onDelete={(id) => setDeleteId(id)}
        onDeposit={(goal) => setDepositGoal(goal)}
        onWithdraw={(goal) => setWithdrawGoal(goal)}
      />

      {/* Forms */}
      <SavingsForm isOpen={showForm} onClose={() => { setShowForm(false); setEditData(null); }} editData={editData} />
      <SavingsDepositForm isOpen={!!depositGoal} onClose={() => setDepositGoal(null)} goal={depositGoal} mode="deposit" />
      <SavingsDepositForm isOpen={!!withdrawGoal} onClose={() => setWithdrawGoal(null)} goal={withdrawGoal} mode="withdraw" />

      <ConfirmDialog isOpen={!!deleteId} onConfirm={handleDelete} onCancel={() => setDeleteId(null)}
        title="Hapus Target?" message="Target dan riwayat tabungannya akan dihapus permanen." confirmText="Ya, Hapus" />
    </div>
  );
}
