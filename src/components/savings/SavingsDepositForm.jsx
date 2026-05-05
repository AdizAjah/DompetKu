import { useState } from 'react';
import Modal from '../common/Modal';
import CurrencyInput from '../common/CurrencyInput';
import { addSavingsDeposit, withdrawSavings } from '../../db/useSavings';
import { formatCurrency } from '../../utils/formatCurrency';
import toast from 'react-hot-toast';

export default function SavingsDepositForm({ isOpen, onClose, goal, mode = 'deposit' }) {
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState('');

  if (!goal) return null;

  const remaining = goal.targetAmount - goal.savedAmount;
  const isDeposit = mode === 'deposit';
  const maxAmount = isDeposit ? Infinity : goal.savedAmount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      toast.error('Masukkan jumlah yang valid');
      return;
    }
    if (!isDeposit && amount > goal.savedAmount) {
      toast.error(`Jumlah melebihi saldo tabungan (${formatCurrency(goal.savedAmount)})`);
      return;
    }

    try {
      if (isDeposit) {
        await addSavingsDeposit(goal.id, amount, note.trim());
        if (amount >= remaining) {
          toast.success('🎉 Target tabungan tercapai!');
        } else {
          toast.success('Tabungan ditambahkan!');
        }
      } else {
        await withdrawSavings(goal.id, amount, note.trim());
        toast.success('Penarikan berhasil');
      }
      setAmount(0);
      setNote('');
      onClose();
    } catch (error) {
      toast.error('Gagal: ' + error.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isDeposit ? 'Tabung Dana' : 'Tarik Dana'} size="sm">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Goal info */}
        <div className="p-4 rounded-xl bg-surface-50 dark:bg-surface-900">
          <p className="text-sm text-surface-500 dark:text-surface-400">{goal.name}</p>
          <div className="flex items-center justify-between mt-2">
            <div>
              <p className="text-lg font-bold text-surface-900 dark:text-white">
                {formatCurrency(goal.savedAmount)}
              </p>
              <p className="text-xs text-surface-400">dari {formatCurrency(goal.targetAmount)}</p>
            </div>
            {isDeposit && (
              <div className="text-right">
                <p className="text-xs text-surface-400">Sisa target</p>
                <p className="text-sm font-semibold" style={{ color: goal.color }}>
                  {formatCurrency(remaining)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            {isDeposit ? 'Jumlah Tabungan' : 'Jumlah Penarikan'}
          </label>
          <CurrencyInput value={amount} onChange={setAmount} />
          {isDeposit && remaining > 0 && (
            <button type="button" onClick={() => setAmount(remaining)}
              className="mt-2 text-xs font-medium text-primary-500 hover:text-primary-600 transition-colors">
              Penuhi target ({formatCurrency(remaining)})
            </button>
          )}
          {!isDeposit && goal.savedAmount > 0 && (
            <button type="button" onClick={() => setAmount(goal.savedAmount)}
              className="mt-2 text-xs font-medium text-red-500 hover:text-red-600 transition-colors">
              Tarik semua ({formatCurrency(goal.savedAmount)})
            </button>
          )}
        </div>

        {/* Note */}
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Catatan <span className="text-surface-400 font-normal">(opsional)</span>
          </label>
          <input type="text" value={note} onChange={(e) => setNote(e.target.value)}
            placeholder={isDeposit ? 'Contoh: Dari gaji bulanan' : 'Alasan penarikan...'} className="input-field" />
        </div>

        {/* Submit */}
        <button type="submit" className={`btn w-full py-3.5 text-base ${isDeposit ? 'btn-primary' : 'btn-danger'}`}>
          {isDeposit ? 'Tabung' : 'Tarik'} {amount > 0 ? formatCurrency(amount) : ''}
        </button>
      </form>
    </Modal>
  );
}
