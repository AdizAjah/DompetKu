import { useState, useEffect } from 'react';
import { ArrowDownLeft, ArrowUpRight, Wallet, Banknote, Smartphone, MoreHorizontal, ChevronDown } from 'lucide-react';
import Modal from '../common/Modal';
import CurrencyInput from '../common/CurrencyInput';
import CategoryPicker from './CategoryPicker';
import { addTransaction, updateTransaction } from '../../db/useTransactions';
import { useFundSources } from '../../db/useFundSources';
import { getTodayISO } from '../../utils/dateHelpers';
import toast from 'react-hot-toast';

const FUND_TYPE_ICONS = { cash: Wallet, bank: Banknote, ewallet: Smartphone, other: MoreHorizontal };

export default function TransactionForm({ isOpen, onClose, type: initialType = 'expense', editData = null }) {
  const [type, setType] = useState(initialType);
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(getTodayISO());
  const [fundSourceId, setFundSourceId] = useState(null);
  const [showSourcePicker, setShowSourcePicker] = useState(false);

  const fundSources = useFundSources();

  useEffect(() => {
    if (editData) {
      setType(editData.type);
      setAmount(editData.amount);
      setCategory(editData.category);
      setDescription(editData.description || '');
      setDate(editData.date?.split('T')[0] || getTodayISO());
      setFundSourceId(editData.fundSourceId || null);
    } else {
      setType(initialType);
      setAmount(0);
      setCategory('');
      setDescription('');
      setDate(getTodayISO());
      // Auto-select default fund source
      const defaultSource = fundSources?.find(s => s.isDefault);
      setFundSourceId(defaultSource?.id || null);
    }
  }, [editData, initialType, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!amount || amount <= 0) {
      toast.error('Masukkan nominal yang valid');
      return;
    }
    if (!category) {
      toast.error('Pilih kategori');
      return;
    }

    try {
      const data = {
        type,
        amount,
        category,
        description,
        fundSourceId: fundSourceId || null,
        date: new Date(date + 'T' + new Date().toTimeString().split(' ')[0]).toISOString()
      };

      if (editData) {
        await updateTransaction(editData.id, data);
        toast.success('Transaksi diperbarui!');
      } else {
        await addTransaction(data);
        toast.success(type === 'income' ? 'Pemasukan ditambahkan!' : 'Pengeluaran dicatat!');
      }
      onClose();
    } catch (error) {
      toast.error('Gagal menyimpan: ' + error.message);
    }
  };

  const selectedSource = fundSources?.find(s => s.id === fundSourceId);
  const SelectedIcon = selectedSource ? (FUND_TYPE_ICONS[selectedSource.type] || Wallet) : null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editData ? 'Edit Transaksi' : 'Tambah Transaksi'}>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Type Toggle */}
        <div className="flex gap-2 p-1 bg-surface-100 dark:bg-surface-700 rounded-xl">
          <button
            type="button"
            onClick={() => setType('income')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all
              ${type === 'income' 
                ? 'bg-emerald-500 text-white shadow-md' 
                : 'text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200'
              }`}
          >
            <ArrowDownLeft size={16} />
            Pemasukan
          </button>
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all
              ${type === 'expense' 
                ? 'bg-red-500 text-white shadow-md' 
                : 'text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200'
              }`}
          >
            <ArrowUpRight size={16} />
            Pengeluaran
          </button>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Nominal
          </label>
          <CurrencyInput value={amount} onChange={setAmount} />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Kategori
          </label>
          <CategoryPicker type={type} value={category} onChange={setCategory} />
        </div>

        {/* Fund Source Selector */}
        {fundSources && fundSources.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              Sumber Dana <span className="text-surface-400 font-normal">(opsional)</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSourcePicker(!showSourcePicker)}
                className="input-field flex items-center gap-3 cursor-pointer text-left"
              >
                {selectedSource ? (
                  <>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${selectedSource.color}20` }}>
                      <SelectedIcon size={14} style={{ color: selectedSource.color }} />
                    </div>
                    <span className="flex-1 truncate text-surface-800 dark:text-surface-200">{selectedSource.name}</span>
                  </>
                ) : (
                  <>
                    <div className="w-7 h-7 rounded-lg bg-surface-200 dark:bg-surface-600 flex items-center justify-center shrink-0">
                      <Wallet size={14} className="text-surface-400" />
                    </div>
                    <span className="flex-1 text-surface-400">Pilih sumber dana...</span>
                  </>
                )}
                <ChevronDown size={16} className={`text-surface-400 transition-transform ${showSourcePicker ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown */}
              {showSourcePicker && (
                <div className="absolute top-full left-0 right-0 mt-1 z-20 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl shadow-xl overflow-hidden animate-scale-in">
                  {/* None option */}
                  <button
                    type="button"
                    onClick={() => { setFundSourceId(null); setShowSourcePicker(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-50 dark:hover:bg-surface-700/50
                      ${!fundSourceId ? 'bg-primary-50 dark:bg-primary-900/20' : ''}`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-surface-200 dark:bg-surface-600 flex items-center justify-center">
                      <MoreHorizontal size={14} className="text-surface-400" />
                    </div>
                    <span className="text-sm text-surface-600 dark:text-surface-400">Tanpa sumber dana</span>
                  </button>

                  {fundSources.map(source => {
                    const SrcIcon = FUND_TYPE_ICONS[source.type] || Wallet;
                    return (
                      <button
                        key={source.id}
                        type="button"
                        onClick={() => { setFundSourceId(source.id); setShowSourcePicker(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-50 dark:hover:bg-surface-700/50
                          ${fundSourceId === source.id ? 'bg-primary-50 dark:bg-primary-900/20' : ''}`}
                      >
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${source.color}20` }}>
                          <SrcIcon size={14} style={{ color: source.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-surface-800 dark:text-surface-200 truncate">{source.name}</p>
                          {source.bankName && (
                            <p className="text-[11px] text-surface-400 truncate">{source.bankName}</p>
                          )}
                        </div>
                        {source.isDefault && (
                          <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-1.5 py-0.5 rounded-full">Default</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Deskripsi <span className="text-surface-400 font-normal">(opsional)</span>
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Contoh: Makan siang di kantin"
            className="input-field"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Tanggal
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input-field"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className={`btn w-full py-3.5 text-base ${
            type === 'income' 
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25' 
              : 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25'
          }`}
        >
          {editData ? 'Simpan Perubahan' : (type === 'income' ? 'Tambah Pemasukan' : 'Catat Pengeluaran')}
        </button>
      </form>
    </Modal>
  );
}
