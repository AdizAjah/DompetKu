import { Wallet } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900 transition-colors duration-300">
      <div className="relative flex items-center justify-center">
        {/* Pulsing ring */}
        <div className="absolute inset-0 w-20 h-20 bg-primary-500/20 rounded-full animate-ping"></div>
        {/* Logo Container */}
        <div className="relative w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-primary-500/30 animate-pulse-soft">
          <Wallet size={32} className="text-white" />
        </div>
      </div>
    </div>
  );
}
