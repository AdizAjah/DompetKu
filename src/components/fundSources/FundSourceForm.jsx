import { useState, useEffect } from 'react';
import { Banknote, Wallet, Smartphone, MoreHorizontal, Star } from 'lucide-react';
import Modal from '../common/Modal';
import { addFundSource, updateFundSource } from '../../db/useFundSources';
import toast from 'react-hot-toast';

const SOURCE_TYPES = [
  { value: 'cash', label: 'Tunai', icon: Wallet },
  { value: 'bank', label: 'Bank', icon: Banknote },
  { value: 'ewallet', label: 'E-Wallet', icon: Smartphone },
  { value: 'other', label: 'Lainnya', icon: MoreHorizontal },
];

const COLOR_PALETTE = [
  '#10b981', '#3b82f6', '#6366f1', '#8b5cf6',
  '#ec4899', '#f59e0b', '#ef4444', '#14b8a6',
  '#f97316', '#06b6d4', '#84cc16', '#64748b',
];

export default function FundSourceForm({ isOpen, onClose, editData = null }) {
  const [type, setType] = useState('cash');
  const [name, setName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [color, setColor] = useState('#10b981');
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    if (editData) {
      setType(editData.type || 'cash');
      setName(editData.name || '');
      setBankName(editData.bankName || '');
      setAccountNumber(editData.accountNumber || '');
      setColor(editData.color || '#10b981');
      setIsDefault(editData.isDefault || false);
    } else {
      setType('cash');
      setName('');
      setBankName('');
      setAccountNumber('');
      setColor('#10b981');
      setIsDefault(false);
    }
  }, [editData, isOpen]);

  const handleTypeChange = (newType) => {
    setType(newType);
    // Auto-fill name based on type if empty or still has default name
    const defaultNames = { cash: 'Kas/Tunai', bank: '', ewallet: '', other: '' };
    const oldDefaults = Object.values(defaultNames);
    if (!name || oldDefaults.includes(name)) {
      setName(defaultNames[newType]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Nama sumber dana wajib diisi');
      return;
    }
    if (type === 'bank' && !bankName.trim()) {
      toast.error('Nama bank wajib diisi');
      return;
    }

    try {
      const data = {
        type,
        name: name.trim(),
        bankName: (type === 'bank' || type === 'ewallet') ? bankName.trim() : '',
        accountNumber: type === 'bank' ? accountNumber.trim() : '',
        color,
        isDefault,
      };

      if (editData) {
        await updateFundSource(editData.id, data);
        toast.success('Sumber dana diperbarui!');
      } else {
        await addFundSource(data);
        toast.success('Sumber dana ditambahkan!');
      }
      onClose();
    } catch (error) {
      toast.error('Gagal menyimpan: ' + error.message);
    }
  };

  const TypeIcon = SOURCE_TYPES.find(t => t.value === type)?.icon || Wallet;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editData ? 'Edit Sumber Dana' : 'Tambah Sumber Dana'}>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Type Selector */}
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Tipe Sumber
          </label>
          <div className="grid grid-cols-4 gap-2">
            {SOURCE_TYPES.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => handleTypeChange(value)}
                className={`fund-source-type-btn flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl text-xs font-medium transition-all
                  ${type === value
                    ? 'bg-primary-500/15 text-primary-600 dark:text-primary-400 ring-2 ring-primary-500/30 shadow-sm'
                    : 'bg-surface-100 dark:bg-surface-700 text-surface-500 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-600'
                  }`}
              >
                <Icon size={20} strokeWidth={type === value ? 2.5 : 1.8} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Nama Sumber Dana
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${color}20` }}>
              <TypeIcon size={16} style={{ color }} />
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={type === 'bank' ? 'Contoh: BCA Utama' : type === 'ewallet' ? 'Contoh: GoPay' : 'Nama sumber dana'}
              className="input-field !pl-14"
            />
          </div>
        </div>

        {/* Bank-specific fields */}
        {type === 'bank' && (
          <>
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                Nama Bank
              </label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="Contoh: BCA, BNI, Mandiri"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                Nomor Rekening <span className="text-surface-400 font-normal">(opsional)</span>
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Contoh: 1234567890"
                className="input-field"
              />
            </div>
          </>
        )}

        {/* E-Wallet provider */}
        {type === 'ewallet' && (
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              Nama Provider
            </label>
            <input
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="Contoh: GoPay, OVO, DANA"
              className="input-field"
            />
          </div>
        )}

        {/* Color Picker */}
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Warna
          </label>
          <div className="color-picker-grid">
            {COLOR_PALETTE.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`color-picker-swatch ${color === c ? 'color-picker-swatch--active' : ''}`}
                style={{ backgroundColor: c }}
                aria-label={`Pilih warna ${c}`}
              >
                {color === c && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Default Toggle */}
        <label className="flex items-center gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-700/50 cursor-pointer group">
          <div className={`w-10 h-6 rounded-full relative transition-all duration-200 ${isDefault ? 'bg-primary-500' : 'bg-surface-300 dark:bg-surface-600'}`}>
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-200 ${isDefault ? 'left-[18px]' : 'left-0.5'}`} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-surface-700 dark:text-surface-300">Jadikan Default</p>
            <p className="text-xs text-surface-400 dark:text-surface-500">Otomatis terpilih saat membuat transaksi baru</p>
          </div>
          <Star size={16} className={`transition-colors ${isDefault ? 'text-amber-400 fill-amber-400' : 'text-surface-300 dark:text-surface-600'}`} />
          <input
            type="checkbox"
            checked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
            className="sr-only"
          />
        </label>

        {/* Submit */}
        <button
          type="submit"
          className="btn w-full py-3.5 text-base bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/25"
        >
          {editData ? 'Simpan Perubahan' : 'Tambah Sumber Dana'}
        </button>
      </form>
    </Modal>
  );
}
