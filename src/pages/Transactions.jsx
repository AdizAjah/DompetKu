import { useState } from 'react';
import Header from '../components/layout/Header';
import TransactionList from '../components/transactions/TransactionList';
import TransactionForm from '../components/transactions/TransactionForm';
import FAB from '../components/common/FAB';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useTransactions, deleteTransaction } from '../db/useTransactions';
import { formatCurrency } from '../utils/formatCurrency';
import { Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Transactions() {
  const [filter, setFilter] = useState('all'); // all, income, expense
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState('expense');
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const typeFilter = filter === 'all' ? undefined : filter;
  const transactions = useTransactions({ type: typeFilter });

  // Apply search filter
  const filtered = transactions?.filter(t => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      t.description?.toLowerCase().includes(q) ||
      t.category?.toLowerCase().includes(q)
    );
  });

  // Calculate totals
  const totals = filtered?.reduce(
    (acc, t) => {
      if (t.type === 'income') acc.income += t.amount;
      else acc.expense += t.amount;
      return acc;
    },
    { income: 0, expense: 0 }
  ) || { income: 0, expense: 0 };

  const handleEdit = (transaction) => {
    setEditData(transaction);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteTransaction(deleteId);
      toast.success('Transaksi dihapus');
      setDeleteId(null);
    } catch (error) {
      toast.error('Gagal menghapus');
    }
  };

  const handleAddIncome = () => {
    setEditData(null);
    setFormType('income');
    setShowForm(true);
  };

  const handleAddExpense = () => {
    setEditData(null);
    setFormType('expense');
    setShowForm(true);
  };

  return (
    <div>
      <Header title="Transaksi" subtitle="Kelola pemasukan & pengeluaran" />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="card p-4">
          <p className="text-xs text-surface-400 dark:text-surface-500 mb-1">Total Masuk</p>
          <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
            +{formatCurrency(totals.income)}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-surface-400 dark:text-surface-500 mb-1">Total Keluar</p>
          <p className="text-lg font-bold text-red-500 dark:text-red-400">
            -{formatCurrency(totals.expense)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Type filter */}
        <div className="flex gap-1 p-1 bg-surface-100 dark:bg-surface-800 rounded-xl">
          {[
            { value: 'all', label: 'Semua' },
            { value: 'income', label: 'Masuk' },
            { value: 'expense', label: 'Keluar' },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${filter === value
                  ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-white shadow-sm'
                  : 'text-surface-500 dark:text-surface-400'
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari transaksi..."
            className="input-field pl-10 py-2.5"
          />
        </div>
      </div>

      {/* Transaction List */}
      <TransactionList
        transactions={filtered}
        onEdit={handleEdit}
        onDelete={(id) => setDeleteId(id)}
      />

      {/* FAB */}
      <FAB onAddIncome={handleAddIncome} onAddExpense={handleAddExpense} />

      {/* Transaction Form Modal */}
      <TransactionForm
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditData(null); }}
        type={formType}
        editData={editData}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        title="Hapus Transaksi"
        message="Transaksi ini akan dihapus permanen. Lanjutkan?"
      />
    </div>
  );
}
