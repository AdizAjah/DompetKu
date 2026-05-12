import { useTodayExpenses } from '../../db/useTransactions';
import { useSettings } from '../../db/useSettings';
import { calculateDailyRemaining, getBudgetStatus } from '../../utils/budgetCalculator';
import { formatCurrency } from '../../utils/formatCurrency';

export default function BudgetGauge() {
  const todayExpenses = useTodayExpenses();
  const settings = useSettings();

  const isEnabled = settings?.isBudgetEnabled ?? true;

  if (!isEnabled) {
    return (
      <div className="card p-6 flex flex-col items-center justify-center min-h-[260px]">
        <h3 className="text-sm font-semibold text-surface-500 dark:text-surface-400 w-full text-center mb-4">
          Kuota Harian
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

  const dailyLimit = settings?.dailyLimit || 50000;
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
      <h3 className="text-sm font-semibold text-surface-500 dark:text-surface-400 mb-4">
        Kuota Harian
      </h3>
      
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
      </div>
    </div>
  );
}
