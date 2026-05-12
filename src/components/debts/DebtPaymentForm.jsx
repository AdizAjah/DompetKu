import { useState } from 'react';
import Modal from '../common/Modal';
import CurrencyInput from '../common/CurrencyInput';
import { addDebtPayment } from '../../db/useDebts';
import { useFundSourceTotals } from '../../db/useFundSources';
import { formatCurrency } from '../../utils/formatCurrency';
import { Wallet, ChevronDown, MoreHorizontal } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DebtPaymentForm({ isOpen, onClose, debt }) {
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState('');
  const [fundSourceId, setFundSourceId] = useState(null);
  const [showSourcePicker, setShowSourcePicker] = useState(false);

  const fundSources = useFundSourceTotals();

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

    if (fundSourceId) {
      const source = fundSources?.find(s => s.id === fundSourceId);
      if (source && source.balance < amount) {
        toast.error(`Saldo sumber dana tidak mencukupi (${formatCurrency(source.balance)})`);
        return;
      }
    }

    try {
      await addDebtPayment(debt.id, amount, note.trim(), fundSourceId);
      
      if (amount >= remaining) {
        toast.success('🎉 Hutang telah lunas!');
      } else {
        toast.success('Pembayaran dicatat!');
      }
      
      setAmount(0);
      setNote('');
      setFundSourceId(null);
      onClose();
    } catch (error) {
      toast.error('Gagal mencatat pembayaran: ' + error.message);
    }
  };

  const selectedSource = fundSources?.find(s => s.id === fundSourceId);

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
                      <Wallet size={14} style={{ color: selectedSource.color }} />
                    </div>
                    <span className="flex-1 truncate text-surface-800 dark:text-surface-200">
                      {selectedSource.name}
                    </span>
                    <span className="text-xs font-medium text-surface-500">
                      {formatCurrency(selectedSource.balance)}
                    </span>
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
                <div className="absolute top-full left-0 right-0 mt-1 z-20 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl shadow-xl overflow-hidden animate-scale-in max-h-60 overflow-y-auto">
                  <button
                    type="button"
                    onClick={() => { setFundSourceId(null); setShowSourcePicker(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-50 dark:hover:bg-surface-700/50 ${!fundSourceId ? 'bg-primary-50 dark:bg-primary-900/20' : ''}`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-surface-200 dark:bg-surface-600 flex items-center justify-center">
                      <MoreHorizontal size={14} className="text-surface-400" />
                    </div>
                    <span className="text-sm text-surface-600 dark:text-surface-400">Tanpa sumber dana</span>
                  </button>

                  {fundSources.map(source => (
                    <button
                      key={source.id}
                      type="button"
                      onClick={() => { setFundSourceId(source.id); setShowSourcePicker(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-50 dark:hover:bg-surface-700/50 ${fundSourceId === source.id ? 'bg-primary-50 dark:bg-primary-900/20' : ''}`}
                    >
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${source.color}20` }}>
                        <Wallet size={14} style={{ color: source.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-surface-800 dark:text-surface-200 truncate">{source.name}</p>
                        <p className="text-[11px] text-surface-400">Saldo: {formatCurrency(source.balance)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

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
