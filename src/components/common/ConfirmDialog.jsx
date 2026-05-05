import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ isOpen, onConfirm, onCancel, title, message, confirmText = 'Hapus', danger = true }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white dark:bg-surface-800 rounded-2xl shadow-2xl p-6 mx-4 max-w-sm w-full animate-scale-in">
        <div className="flex flex-col items-center text-center gap-4">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center ${danger ? 'bg-red-100 dark:bg-red-900/30' : 'bg-primary-100 dark:bg-primary-900/30'}`}>
            <AlertTriangle size={28} className={danger ? 'text-red-500' : 'text-primary-500'} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-1">{title}</h3>
            <p className="text-sm text-surface-500 dark:text-surface-400">{message}</p>
          </div>
          <div className="flex gap-3 w-full">
            <button onClick={onCancel} className="btn btn-secondary flex-1">Batal</button>
            <button onClick={onConfirm} className={`btn flex-1 ${danger ? 'btn-danger' : 'btn-primary'}`}>
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
