import { useState } from 'react';
import Header from '../components/layout/Header';
import TransactionList from '../components/transactions/TransactionList';
import TransactionForm from '../components/transactions/TransactionForm';
import FAB from '../components/common/FAB';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useTransactions, deleteTransaction } from '../db/useTransactions';
import { useFundSources } from '../db/useFundSources';
import { formatCurrency } from '../utils/formatCurrency';
import { Search, ArrowDownLeft, ArrowUpRight, TrendingUp, TrendingDown } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Transactions() {
  const [filter, setFilter] = useState('all'); // all, income, expense
  const [fundSourceFilter, setFundSourceFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState('expense');
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const typeFilter = filter === 'all' ? undefined : filter;
  const transactions = useTransactions({ type: typeFilter });
  const fundSources = useFundSources();

  // Apply search filter
  const filtered = transactions?.filter(t => {
    if (fundSourceFilter !== 'all') {
      if (fundSourceFilter === 'none' && t.fundSourceId) return false;
      if (fundSourceFilter !== 'none' && t.fundSourceId !== Number(fundSourceFilter)) return false;
    }
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="card p-5 overflow-hidden">
          <div className="flex items-center gap-4 min-w-0">
            <div className="p-3 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 shrink-0">
              <TrendingUp size={24} className="text-emerald-500" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-surface-500 dark:text-surface-400">Total Masuk</p>
              <p className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 truncate">
                +{formatCurrency(totals.income)}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-5 overflow-hidden">
          <div className="flex items-center gap-4 min-w-0">
            <div className="p-3 rounded-xl bg-red-500/10 dark:bg-red-500/15 shrink-0">
              <TrendingDown size={24} className="text-red-500" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-surface-500 dark:text-surface-400">Total Keluar</p>
              <p className="text-xl sm:text-2xl font-bold text-red-500 dark:text-red-400 truncate">
                -{formatCurrency(totals.expense)}
              </p>
            </div>
          </div>
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

        <div className="flex gap-2 flex-1">
          {/* Source Filter */}
          <div className="relative min-w-[130px] sm:min-w-[150px]">
            <select
              value={fundSourceFilter}
              onChange={(e) => setFundSourceFilter(e.target.value)}
              className="input-field py-2.5 px-3 appearance-none text-sm"
            >
              <option value="all">Semua Dana</option>
              <option value="none">Tanpa Dana</option>
              {fundSources?.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-surface-500">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>

          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari..."
              className="input-field !pl-9 py-2.5 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <TransactionList
        transactions={filtered}
        onEdit={handleEdit}
        onDelete={(id) => setDeleteId(id)}
      />

      {/* FAB */}
      <FAB
        actions={[
          { label: 'Pemasukan', icon: <ArrowDownLeft size={18} />, onClick: handleAddIncome, colorClass: 'bg-primary-500 hover:bg-primary-600' },
          { label: 'Pengeluaran', icon: <ArrowUpRight size={18} />, onClick: handleAddExpense, colorClass: 'bg-red-500 hover:bg-red-600' }
        ]}
      />

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
