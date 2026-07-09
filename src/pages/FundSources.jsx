import { useState } from 'react';
import Header from '../components/layout/Header';
import FundSourceCard from '../components/fundSources/FundSourceCard';
import FundSourceForm from '../components/fundSources/FundSourceForm';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmptyState from '../components/common/EmptyState';
import FAB from '../components/common/FAB';
import { useFundSources, useFundSourceTotals, deleteFundSource } from '../db/useFundSources';
import { formatCurrency } from '../utils/formatCurrency';
import { Plus, Wallet, Banknote, TrendingUp, TrendingDown } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FundSources() {
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const sources = useFundSources();
  const sourceTotals = useFundSourceTotals();

  // Calculate summary
  const totalIncome = sourceTotals?.reduce((sum, s) => sum + s.income, 0) || 0;
  const totalExpense = sourceTotals?.reduce((sum, s) => sum + s.expense, 0) || 0;
  const totalSources = sources?.length || 0;

  const handleEdit = (source) => {
    setEditData(source);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditData(null);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteFundSource(deleteId);
      toast.success('Sumber dana dihapus');
      setDeleteId(null);
    } catch (error) {
      toast.error('Gagal menghapus');
    }
  };

  return (
    <div>
      <Header title="Sumber Dana" subtitle="Kelola sumber pembayaran" />

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="card p-4 min-w-0 overflow-hidden">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-primary-500/15 flex items-center justify-center">
              <Wallet size={14} className="text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <p className="text-[11px] text-surface-400 dark:text-surface-500 mb-0.5">Total Sumber</p>
          <p className="text-lg font-bold text-surface-800 dark:text-surface-200">{totalSources}</p>
        </div>

        <div className="card p-4 min-w-0 overflow-hidden">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center">
              <TrendingUp size={14} className="text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <p className="text-[11px] text-surface-400 dark:text-surface-500 mb-0.5">Total Masuk</p>
          <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 truncate">{formatCurrency(totalIncome)}</p>
        </div>

        <div className="card p-4 min-w-0 overflow-hidden">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-red-500/15 flex items-center justify-center">
              <TrendingDown size={14} className="text-red-500 dark:text-red-400" />
            </div>
          </div>
          <p className="text-[11px] text-surface-400 dark:text-surface-500 mb-0.5">Total Keluar</p>
          <p className="text-sm font-bold text-red-500 dark:text-red-400 truncate">{formatCurrency(totalExpense)}</p>
        </div>
      </div>

      {/* Fund Source List */}
      <div className="space-y-3">
        {sources === undefined ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="card p-4 animate-pulse-soft">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-200 dark:bg-surface-700" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 rounded bg-surface-200 dark:bg-surface-700" />
                    <div className="h-3 w-20 rounded bg-surface-200 dark:bg-surface-700" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : sources.length === 0 ? (
          <EmptyState
            icon="Wallet"
            message="Belum ada sumber dana. Tambahkan rekening bank, kas tunai, atau e-wallet untuk mulai melacak arus kas."
          />
        ) : (
          sources.map(source => {
            const stats = sourceTotals?.find(s => s.id === source.id);
            return (
              <FundSourceCard
                key={source.id}
                source={source}
                stats={stats}
                onEdit={handleEdit}
                onDelete={(id) => setDeleteId(id)}
              />
            );
          })
        )}
      </div>

      {/* FAB */}
      <FAB onClick={handleAdd} ariaLabel="Tambah Sumber Dana" />

      {/* Form Modal */}
      <FundSourceForm
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditData(null); }}
        editData={editData}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        title="Hapus Sumber Dana"
        message="Sumber dana ini akan dihapus. Transaksi terkait tidak akan dihapus, hanya referensi sumbernya yang dihilangkan. Lanjutkan?"
      />
    </div>
  );
}
