import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import CurrencyInput from '../common/CurrencyInput';
import { addSavingsGoal, updateSavingsGoal } from '../../db/useSavings';
import { availableColors } from '../../utils/categories';
import toast from 'react-hot-toast';

export default function SavingsForm({ isOpen, onClose, editData = null }) {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState(0);
  const [targetDate, setTargetDate] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#6366f1');

  useEffect(() => {
    if (editData) {
      setName(editData.name);
      setTargetAmount(editData.targetAmount);
      setTargetDate(editData.targetDate?.split('T')[0] || '');
      setDescription(editData.description || '');
      setColor(editData.color || '#6366f1');
    } else {
      setName('');
      setTargetAmount(0);
      setTargetDate('');
      setDescription('');
      setColor('#6366f1');
    }
  }, [editData, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) { toast.error('Masukkan nama target'); return; }
    if (!targetAmount || targetAmount <= 0) { toast.error('Masukkan nominal target'); return; }

    try {
      if (editData) {
        await updateSavingsGoal(editData.id, {
          name: name.trim(),
          targetAmount,
          targetDate: targetDate ? new Date(targetDate).toISOString() : null,
          description: description.trim(),
          color
        });
        toast.success('Target diperbarui!');
      } else {
        await addSavingsGoal({
          name: name.trim(),
          targetAmount,
          targetDate: targetDate ? new Date(targetDate).toISOString() : null,
          description: description.trim(),
          color
        });
        toast.success('Target tabungan dibuat! 🎯');
      }
      onClose();
    } catch (error) {
      toast.error('Gagal menyimpan: ' + error.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editData ? 'Edit Target' : 'Target Baru'}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Nama Target
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Beli laptop, Dana darurat"
            className="input-field"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Nominal Target
          </label>
          <CurrencyInput value={targetAmount} onChange={setTargetAmount} />
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Target Tanggal <span className="text-surface-400 font-normal">(opsional)</span>
          </label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Catatan <span className="text-surface-400 font-normal">(opsional)</span>
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Deskripsi tujuan..."
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Warna
          </label>
          <div className="flex flex-wrap gap-2">
            {availableColors.map(c => (
              <button
                key={c} type="button" onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full transition-all ${color === c ? 'ring-2 ring-offset-2 ring-primary-500 dark:ring-offset-surface-800 scale-110' : ''}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-full py-3.5 text-base">
          {editData ? 'Simpan Perubahan' : 'Buat Target'}
        </button>
      </form>
    </Modal>
  );
}
