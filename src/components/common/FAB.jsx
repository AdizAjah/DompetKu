import { useState } from 'react';
import { Plus, X, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export default function FAB({ onAddIncome, onAddExpense }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-24 sm:bottom-8 right-6 z-40 flex flex-col items-end gap-3">
      {/* Sub buttons */}
      {isOpen && (
        <div className="flex flex-col gap-3 animate-slide-up">
          {/* Income */}
          <button
            onClick={() => { onAddIncome(); setIsOpen(false); }}
            className="flex items-center gap-3 pl-4 pr-5 py-3 rounded-2xl shadow-lg
              bg-primary-500 text-white font-medium text-sm
              hover:bg-primary-600 active:scale-95 transition-all"
          >
            <ArrowDownLeft size={18} />
            <span>Pemasukan</span>
          </button>

          {/* Expense */}
          <button
            onClick={() => { onAddExpense(); setIsOpen(false); }}
            className="flex items-center gap-3 pl-4 pr-5 py-3 rounded-2xl shadow-lg
              bg-red-500 text-white font-medium text-sm
              hover:bg-red-600 active:scale-95 transition-all"
          >
            <ArrowUpRight size={18} />
            <span>Pengeluaran</span>
          </button>
        </div>
      )}

      {/* Main FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center
          gradient-primary text-white transition-all duration-300
          hover:shadow-2xl active:scale-90
          ${isOpen ? 'rotate-45' : 'rotate-0'}`}
        aria-label="Tambah transaksi"
      >
        {isOpen ? <X size={24} /> : <Plus size={24} />}
      </button>
    </div>
  );
}
