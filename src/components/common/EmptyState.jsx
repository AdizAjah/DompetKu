import { Inbox } from 'lucide-react';

export default function EmptyState({ icon: Icon = Inbox, title = 'Belum ada data', description = '', action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-5">
        <Icon size={36} className="text-surface-400 dark:text-surface-500" />
      </div>
      <h3 className="text-lg font-semibold text-surface-700 dark:text-surface-300 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-surface-500 dark:text-surface-400 max-w-xs mb-5">{description}</p>
      )}
      {action && action}
    </div>
  );
}
