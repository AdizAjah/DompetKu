import { AlertTriangle, XCircle, CheckCircle } from 'lucide-react';
import { useTodayExpenses } from '../../db/useTransactions';
import { useSettings } from '../../db/useSettings';
import { calculateDailyRemaining, getBudgetStatus, getBudgetAlertMessage } from '../../utils/budgetCalculator';
import { formatCurrency } from '../../utils/formatCurrency';

export default function BudgetAlert() {
  const todayExpenses = useTodayExpenses();
  const settings = useSettings();

  if (!settings || !settings.dailyLimit || todayExpenses === undefined) return null;

  const remaining = calculateDailyRemaining(settings.dailyLimit, todayExpenses);
  const { status } = getBudgetStatus(remaining, settings.dailyLimit);
  const message = getBudgetAlertMessage(remaining, settings.dailyLimit);

  if (status === 'safe' || status === 'none' || !message) return null;

  const configs = {
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700/50',
      text: 'text-amber-800 dark:text-amber-300',
      icon: AlertTriangle,
      iconColor: 'text-amber-500'
    },
    critical: {
      bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700/50',
      text: 'text-red-800 dark:text-red-300',
      icon: XCircle,
      iconColor: 'text-red-500'
    },
    over: {
      bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700/50',
      text: 'text-red-800 dark:text-red-300',
      icon: XCircle,
      iconColor: 'text-red-500'
    }
  };

  const config = configs[status];
  if (!config) return null;

  const Icon = config.icon;

  return (
    <div className={`lg:ml-[280px] px-4 sm:px-6 lg:px-8 py-2 animate-slide-down`}>
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${config.bg} ${config.text}`}>
        <Icon size={18} className={config.iconColor} />
        <p className="text-sm font-medium flex-1">{message}</p>
        <span className="text-xs font-semibold opacity-75">
          Sisa: {formatCurrency(Math.max(0, remaining))}
        </span>
      </div>
    </div>
  );
}
