import { useState } from 'react';
import Modal from '../common/Modal';
import CurrencyInput from '../common/CurrencyInput';
import { addSavingsDeposit, withdrawSavings } from '../../db/useSavings';
import { formatCurrency } from '../../utils/formatCurrency';
import { AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SavingsDepositForm({ isOpen, onClose, goal, mode = 'deposit' }) {
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState('');

  if (!goal) return null;

  const remaining = goal.targetAmount - goal.savedAmount;
  const isDeposit = mode === 'deposit';
  const maxAmount = isDeposit ? remaining : goal.savedAmount;
  const isOverflow = amount > maxAmount;
  const isValid = amount > 0 && !isOverflow;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      toast.error('Masukkan jumlah yang valid');
      return;
    }
    if (isDeposit && amount > remaining) {
      toast.error(`Nominal melebihi sisa target tabungan (${formatCurrency(remaining)})`);
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

          {/* Real-time overflow error */}
          {isOverflow && (
            <div className="flex items-start gap-2 mt-2 p-2.5 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
              <AlertTriangle size={14} className="text-red-500 mt-0.5 shrink-0" />
              <p className="text-xs text-red-600 dark:text-red-400">
                {isDeposit
                  ? `Nominal melebihi sisa target! Maksimal pengisian saat ini: ${formatCurrency(remaining)}`
                  : `Nominal melebihi saldo tabungan! Maksimal penarikan: ${formatCurrency(goal.savedAmount)}`}
              </p>
            </div>
          )}

          {/* Max helper text */}
          {!isOverflow && (
            <p className="mt-2 text-xs text-surface-400">
              Maks. {isDeposit ? 'pengisian' : 'penarikan'}: {formatCurrency(maxAmount)}
            </p>
          )}

          {isDeposit && remaining > 0 && !isOverflow && (
            <button type="button" onClick={() => setAmount(remaining)}
              className="mt-1 text-xs font-medium text-primary-500 hover:text-primary-600 transition-colors">
              Penuhi target ({formatCurrency(remaining)})
            </button>
          )}
          {!isDeposit && goal.savedAmount > 0 && !isOverflow && (
            <button type="button" onClick={() => setAmount(goal.savedAmount)}
              className="mt-1 text-xs font-medium text-red-500 hover:text-red-600 transition-colors">
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
        <button
          type="submit"
          disabled={!isValid}
          className={`btn w-full py-3.5 text-base ${isDeposit ? 'btn-primary' : 'btn-danger'} ${!isValid ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isDeposit ? 'Tabung' : 'Tarik'} {amount > 0 ? formatCurrency(amount) : ''}
        </button>
      </form>
    </Modal>
  );
}
