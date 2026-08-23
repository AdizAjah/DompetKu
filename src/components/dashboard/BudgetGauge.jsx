import { useTodayExpenses, useTotalBalance } from '../../db/useTransactions';
import { useTotalSaved } from '../../db/useSavings';
import { useSettings } from '../../db/useSettings';
import { calculateDailyRemaining, getBudgetStatus } from '../../utils/budgetCalculator';
import { formatCurrency } from '../../utils/formatCurrency';
import { getAvailableBalance, getRemainingDays, getDailySafeLimit } from '../../utils/financialCalculator';
import { Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BudgetGauge() {
  const todayExpenses = useTodayExpenses();
  const totalBalance = useTotalBalance();
  const totalSaved = useTotalSaved();
  const settings = useSettings();

  const isEnabled = settings?.isBudgetEnabled ?? true;

  if (!isEnabled) {
    return (
      <div className="card p-6 flex flex-col items-center justify-center min-h-[260px]">
        <h3 className="text-sm font-semibold text-surface-500 dark:text-surface-400 w-full text-center mb-4">
          Batas Aman Harian
        </h3>
        <div className="flex-1 flex flex-col items-center justify-center text-center w-full">
          <div className="w-16 h-16 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-3">
            <span className="text-2xl opacity-50">💤</span>
          </div>
          <p className="text-surface-900 dark:text-white font-medium text-sm">Anggaran Nonaktif</p>
          <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
            Aktifkan di pengaturan.
          </p>
        </div>
      </div>
    );
  }

  const budgetMode = settings?.budgetMode || 'otomatis';
  const availableBalance = getAvailableBalance(totalBalance, totalSaved);
  const remainingDays = getRemainingDays(settings?.targetDate);
  const targetPassed = budgetMode === 'otomatis' && remainingDays <= 0 && settings?.targetDate;
  const balanceNegative = budgetMode === 'otomatis' && availableBalance <= 0;

  if (targetPassed) {
    return (
      <div className="card p-6 flex flex-col items-center justify-center min-h-[260px]">
        <h3 className="text-sm font-semibold text-surface-500 dark:text-surface-400 w-full text-center mb-4">
          Batas Aman Harian
        </h3>
        <div className="flex-1 flex flex-col items-center justify-center text-center w-full space-y-3">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 flex items-center justify-center">
            <Info size={28} />
          </div>
          <div>
            <p className="text-surface-900 dark:text-white font-medium text-sm">Target Tanggal Terlewati</p>
            <p className="text-xs text-surface-500 dark:text-surface-400 mt-1 px-4">
              Silakan atur ulang target tanggal bertahan di Pengaturan.
            </p>
          </div>
          <Link to="/settings" className="btn btn-secondary text-xs py-1.5 px-3">
            Ke Pengaturan
          </Link>
        </div>
      </div>
    );
  }

  if (balanceNegative) {
    return (
      <div className="card p-6 flex flex-col items-center justify-center min-h-[260px]">
        <h3 className="text-sm font-semibold text-surface-500 dark:text-surface-400 w-full text-center mb-4">
          Batas Aman Harian
        </h3>
        <div className="flex-1 flex flex-col items-center justify-center text-center w-full space-y-3">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 flex items-center justify-center">
            <span className="text-2xl">💸</span>
          </div>
          <div>
            <p className="text-red-500 font-medium text-sm">Saldo Tidak Mencukupi</p>
            <p className="text-xs text-surface-500 dark:text-surface-400 mt-1 px-4">
              Saldo tersedia saat ini Rp0 atau minus. Tidak ada batas aman pengeluaran.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const dailyLimit = getDailySafeLimit(availableBalance, remainingDays, budgetMode, settings?.dailyLimit || 50000);
  const remaining = calculateDailyRemaining(dailyLimit, todayExpenses || 0);
  const { status, color, label, percentage } = getBudgetStatus(remaining, dailyLimit);

  // SVG circular gauge parameters
  const size = 160;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(percentage, 100) / 100) * circumference;

  return (
    <div className="card p-6 flex flex-col items-center">
      <div className="w-full flex items-center justify-center mb-1">
        <h3 className="text-sm font-semibold text-surface-500 dark:text-surface-400">
          Batas Aman Harian
        </h3>
      </div>
      <p className="text-[10px] text-surface-400 text-center mb-4 leading-tight">
        Pengganti Kuota Harian. <br/>Membantu pengeluaranmu aman sampai target.
      </p>
      
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-surface-100 dark:text-surface-700"
          />
          {/* Progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-surface-900 dark:text-white">
            {Math.round(percentage)}%
          </span>
          <span className="text-xs font-medium" style={{ color }}>
            {label}
          </span>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-surface-500 dark:text-surface-400">
          Sisa: <span className="font-semibold text-surface-900 dark:text-white">
            {formatCurrency(Math.max(0, remaining))}
          </span>
        </p>
        <p className="text-xs text-surface-400 dark:text-surface-500 mt-1">
          dari {formatCurrency(dailyLimit)}/hari
        </p>
        {budgetMode === 'otomatis' && settings?.targetDate && (
           <p className="text-[10px] font-medium text-primary-500 bg-primary-50 dark:bg-primary-500/10 px-2 py-1 rounded-full mt-3 inline-block">
             Target: {new Date(settings.targetDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
           </p>
        )}
      </div>
    </div>
  );
}
