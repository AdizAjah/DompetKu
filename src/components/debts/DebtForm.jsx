import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import CurrencyInput from '../common/CurrencyInput';
import { addDebt, updateDebt } from '../../db/useDebts';
import toast from 'react-hot-toast';

export default function DebtForm({ isOpen, onClose, editData = null }) {
  const [creditorName, setCreditorName] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editData) {
      setCreditorName(editData.creditorName);
      setTotalAmount(editData.totalAmount);
      setDueDate(editData.dueDate?.split('T')[0] || '');
      setDescription(editData.description || '');
    } else {
      setCreditorName('');
      setTotalAmount(0);
      setDueDate('');
      setDescription('');
    }
  }, [editData, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!creditorName.trim()) {
      toast.error('Masukkan nama pemberi hutang');
      return;
    }
    if (!totalAmount || totalAmount <= 0) {
      toast.error('Masukkan jumlah hutang yang valid');
      return;
    }

    try {
      if (editData) {
        await updateDebt(editData.id, {
          creditorName: creditorName.trim(),
          totalAmount,
          dueDate: dueDate ? new Date(dueDate).toISOString() : null,
          description: description.trim()
        });
        toast.success('Hutang diperbarui!');
      } else {
        await addDebt({
          creditorName: creditorName.trim(),
          totalAmount,
          dueDate: dueDate ? new Date(dueDate).toISOString() : null,
          description: description.trim()
        });
        toast.success('Hutang ditambahkan!');
      }
      onClose();
    } catch (error) {
      toast.error('Gagal menyimpan: ' + error.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editData ? 'Edit Hutang' : 'Tambah Hutang'}>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Creditor Name */}
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Nama Pemberi Hutang
          </label>
          <input
            type="text"
            value={creditorName}
            onChange={(e) => setCreditorName(e.target.value)}
            placeholder="Contoh: Budi, Bank BCA"
            className="input-field"
            autoFocus
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Jumlah Hutang
          </label>
          <CurrencyInput value={totalAmount} onChange={setTotalAmount} />
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Jatuh Tempo <span className="text-surface-400 font-normal">(opsional)</span>
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="input-field"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Catatan <span className="text-surface-400 font-normal">(opsional)</span>
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Catatan tambahan..."
            className="input-field"
          />
        </div>

        {/* Submit */}
        <button type="submit" className="btn btn-primary w-full py-3.5 text-base">
          {editData ? 'Simpan Perubahan' : 'Tambah Hutang'}
        </button>
      </form>
    </Modal>
  );
}
