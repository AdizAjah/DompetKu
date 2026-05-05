import Header from '../components/layout/Header';
import BalanceCard from '../components/dashboard/BalanceCard';
import BudgetGauge from '../components/dashboard/BudgetGauge';
import SpendingChart from '../components/dashboard/SpendingChart';
import QuickStats from '../components/dashboard/QuickStats';
import RecentTransactions from '../components/dashboard/RecentTransactions';

export default function Dashboard() {
  return (
    <div>
      <Header title="Dashboard" />

      <div className="space-y-6">
        {/* Top row: Balance + Budget */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <BalanceCard />
          </div>
          <div>
            <BudgetGauge />
          </div>
        </div>

        {/* Quick Stats */}
        <QuickStats />

        {/* Charts + Recent */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SpendingChart />
          <RecentTransactions />
        </div>
      </div>
    </div>
  );
}
