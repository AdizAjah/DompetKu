import { useState, useEffect } from 'react';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import Modal from '../common/Modal';
import CurrencyInput from '../common/CurrencyInput';
import CategoryPicker from './CategoryPicker';
import { addTransaction, updateTransaction } from '../../db/useTransactions';
import { getTodayISO } from '../../utils/dateHelpers';
import toast from 'react-hot-toast';

export default function TransactionForm({ isOpen, onClose, type: initialType = 'expense', editData = null }) {
  const [type, setType] = useState(initialType);
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(getTodayISO());

  useEffect(() => {
    if (editData) {
      setType(editData.type);
      setAmount(editData.amount);
      setCategory(editData.category);
      setDescription(editData.description || '');
      setDate(editData.date?.split('T')[0] || getTodayISO());
    } else {
      setType(initialType);
      setAmount(0);
      setCategory('');
      setDescription('');
      setDate(getTodayISO());
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
