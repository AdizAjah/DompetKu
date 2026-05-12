import { useFundSourceTotals } from '../../db/useFundSources';
import { formatCurrency } from '../../utils/formatCurrency';
import { Wallet, Banknote, Smartphone, MoreHorizontal } from 'lucide-react';

const FUND_TYPE_ICONS = {
  cash: Wallet,
  bank: Banknote,
  ewallet: Smartphone,
  other: MoreHorizontal,
};

export default function FundSourcesOverview() {
  const sources = useFundSourceTotals();

  if (!sources || sources.length === 0) {
    return null; // Do not show if there are no fund sources
  }

  const totalBalance = sources.reduce((sum, source) => sum + source.balance, 0);

  return (
    <div className="card p-6 overflow-hidden min-w-0" id="dashboard-fund-sources">
      <h3 className="text-sm font-semibold text-surface-500 dark:text-surface-400 mb-4">Ringkasan Sumber Dana</h3>
      
      {/* Total Balance */}
      <div className="mb-6">
        <p className="text-xs text-surface-400 dark:text-surface-500 mb-1 uppercase tracking-wider font-semibold">Total Keseluruhan</p>
        <p className="text-2xl font-bold text-surface-900 dark:text-white tracking-tight">
          {formatCurrency(totalBalance)}
        </p>
      </div>

      {/* List of Sources */}
      <div className="space-y-3">
        {sources.map(source => {
          const Icon = FUND_TYPE_ICONS[source.type] || Wallet;
          return (
            <div key={source.id} className="flex items-center justify-between p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${source.color}20` }}>
                  <Icon size={18} style={{ color: source.color }} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-surface-800 dark:text-surface-200 truncate">{source.name}</p>
                  <p className="text-[11px] text-surface-400 truncate">{source.bankName || (source.type === 'cash' ? 'Tunai' : 'Lainnya')}</p>
                </div>
              </div>
              <p className="text-sm font-semibold text-surface-900 dark:text-surface-100 shrink-0 ml-3">
                {formatCurrency(source.balance)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
