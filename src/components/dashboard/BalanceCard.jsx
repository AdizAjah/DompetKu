import { TrendingUp, TrendingDown, Wallet, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import { useTotalBalance } from '../../db/useTransactions';
import { useTotalSaved } from '../../db/useSavings';
import { useTotalDebt } from '../../db/useDebts';

export default function BalanceCard() {
  const balance = useTotalBalance();
  const totalSaved = useTotalSaved();
  const totalDebt = useTotalDebt();

  // Disposable = balance (already reduced by savings deposits as expenses)
  // But we also show how much is "locked" in savings
  const disposable = (balance || 0);
  const locked = (totalSaved || 0);

  return (
    <div id="dashboard-balance-card" className="relative overflow-hidden rounded-2xl p-5 sm:p-6 gradient-primary text-white shadow-xl shadow-primary-500/20 h-full flex flex-col justify-center">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Wallet size={18} />
          </div>
          <span className="text-sm font-medium text-white/80">Total Saldo</span>
        </div>
        
        <p className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight animate-count-up truncate">
          {balance !== undefined ? formatCurrency(balance) : '...'}
        </p>

        {/* Disposable income info */}
        <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-3">
          <div className="flex items-center gap-1 text-sm text-white/70">
            {balance >= 0 ? (
              <>
                <TrendingUp size={16} />
                <span>Keuangan sehat</span>
              </>
            ) : (
              <>
                <TrendingDown size={16} />
                <span>Pengeluaran melebihi pemasukan</span>
              </>
            )}
          </div>

          {locked > 0 && (
            <div className="flex items-center gap-1 text-xs text-white/50">
              <ShieldCheck size={13} />
              <span>{formatCurrency(locked)} dialokasi tabungan</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
