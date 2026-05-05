import { useState } from 'react';
import Modal from '../common/Modal';
import CurrencyInput from '../common/CurrencyInput';
import { addDebtPayment } from '../../db/useDebts';
import { formatCurrency } from '../../utils/formatCurrency';
import toast from 'react-hot-toast';

export default function DebtPaymentForm({ isOpen, onClose, debt }) {
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState('');

  if (!debt) return null;

  const remaining = debt.totalAmount - debt.paidAmount;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || amount <= 0) {
      toast.error('Masukkan jumlah pembayaran');
      return;
    }
    if (amount > remaining) {
      toast.error(`Jumlah melebihi sisa hutang (${formatCurrency(remaining)})`);
      return;
    }

    try {
      await addDebtPayment(debt.id, amount, note.trim());
      
      if (amount >= remaining) {
        toast.success('🎉 Hutang telah lunas!');
      } else {
        toast.success('Pembayaran dicatat!');
      }
      
      setAmount(0);
      setNote('');
      onClose();
    } catch (error) {
      toast.error('Gagal mencatat pembayaran: ' + error.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bayar Hutang" size="sm">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Debt info */}
        <div className="p-4 rounded-xl bg-surface-50 dark:bg-surface-900">
          <p className="text-sm text-surface-500 dark:text-surface-400">Hutang kepada</p>
          <p className="text-lg font-bold text-surface-900 dark:text-white">{debt.creditorName}</p>
          <div className="flex items-center justify-between mt-2 text-sm">
            <span className="text-surface-400">Sisa hutang:</span>
            <span className="font-semibold text-amber-600 dark:text-amber-400">
              {formatCurrency(remaining)}
            </span>
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Jumlah Pembayaran
          </label>
          <CurrencyInput value={amount} onChange={setAmount} />
          <button
            type="button"
            onClick={() => setAmount(remaining)}
            className="mt-2 text-xs font-medium text-primary-500 hover:text-primary-600 transition-colors"
          >
            Bayar lunas ({formatCurrency(remaining)})
          </button>
        </div>

        {/* Note */}
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Catatan <span className="text-surface-400 font-normal">(opsional)</span>
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Contoh: Transfer via BCA"
            className="input-field"
          />
        </div>

        {/* Submit */}
        <button type="submit" className="btn btn-primary w-full py-3.5 text-base">
          Bayar {amount > 0 ? formatCurrency(amount) : ''}
        </button>
      </form>
    </Modal>
  );
}
