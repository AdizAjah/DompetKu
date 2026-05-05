import { useState } from 'react';
import Header from '../components/layout/Header';
import DebtList from '../components/debts/DebtList';
import DebtForm from '../components/debts/DebtForm';
import DebtPaymentForm from '../components/debts/DebtPaymentForm';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useDebts, useTotalDebt, deleteDebt } from '../db/useDebts';
import { formatCurrency } from '../utils/formatCurrency';
import { Plus, Landmark } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Debts() {
  const [statusFilter, setStatusFilter] = useState('active');
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [payDebt, setPayDebt] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const debts = useDebts(statusFilter);
  const totalDebt = useTotalDebt();

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteDebt(deleteId);
      toast.success('Hutang dihapus');
      setDeleteId(null);
    } catch (error) {
      toast.error('Gagal menghapus');
    }
  };

  return (
    <div>
      <Header
        title="Hutang"
        subtitle="Pantau kewajiban finansialmu"
        action={
          <button
            onClick={() => { setEditData(null); setShowForm(true); }}
            className="btn btn-primary"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Tambah Hutang</span>
          </button>
        }
      />

      {/* Total Debt Card */}
      <div className="card p-5 mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-500/10 dark:bg-amber-500/15">
            <Landmark size={24} className="text-amber-500" />
          </div>
          <div>
            <p className="text-sm text-surface-500 dark:text-surface-400">Total Hutang Aktif</p>
            <p className="text-2xl font-bold text-surface-900 dark:text-white animate-count-up">
              {formatCurrency(totalDebt || 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex gap-1 p-1 bg-surface-100 dark:bg-surface-800 rounded-xl mb-6 w-fit">
        {[
          { value: 'active', label: 'Aktif' },
          { value: 'paid', label: 'Lunas' },
        ].map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setStatusFilter(value)}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all
              ${statusFilter === value
                ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-white shadow-sm'
                : 'text-surface-500 dark:text-surface-400'
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Debt List */}
      <DebtList
        debts={debts}
        onEdit={(debt) => { setEditData(debt); setShowForm(true); }}
        onDelete={(id) => setDeleteId(id)}
        onPay={(debt) => setPayDebt(debt)}
      />

      {/* Forms */}
      <DebtForm
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditData(null); }}
        editData={editData}
      />

      <DebtPaymentForm
        isOpen={!!payDebt}
        onClose={() => setPayDebt(null)}
        debt={payDebt}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        title="Hapus Hutang"
        message="Hutang ini beserta riwayat pembayarannya akan dihapus permanen."
      />
    </div>
  );
}
