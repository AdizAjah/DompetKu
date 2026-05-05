import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import { useTotalBalance } from '../../db/useTransactions';

export default function BalanceCard() {
  const balance = useTotalBalance();

  return (
    <div className="relative overflow-hidden rounded-2xl p-6 gradient-primary text-white shadow-xl shadow-primary-500/20">
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
        
        <p className="text-3xl sm:text-4xl font-bold tracking-tight animate-count-up">
          {balance !== undefined ? formatCurrency(balance) : '...'}
        </p>

        <div className="flex items-center gap-1 mt-3 text-sm text-white/70">
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
      </div>
    </div>
  );
}
