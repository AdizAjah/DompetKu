import Header from '../components/layout/Header';
import BalanceCard from '../components/dashboard/BalanceCard';
import BudgetGauge from '../components/dashboard/BudgetGauge';
import SpendingChart from '../components/dashboard/SpendingChart';
import QuickStats from '../components/dashboard/QuickStats';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import SavingsWidget from '../components/dashboard/SavingsWidget';
import FundSourcesOverview from '../components/dashboard/FundSourcesOverview';
import Walkthrough from '../components/common/Walkthrough';

const walkthroughSteps = [
  {
    target: '#dashboard-balance-card',
    title: '👋 Selamat Datang!',
    content:
      'Di sini Anda dapat melihat ringkasan saldo secara keseluruhan — termasuk total pemasukan, pengeluaran, dan alokasi tabungan Anda.',
    position: 'bottom',
  },
  {
    target: '#dashboard-quick-stats',
    title: '📊 Statistik Cepat',
    content:
      'Pantau keuangan bulan ini secara instan: pemasukan, pengeluaran, total hutang, dan tabungan terkumpul — semuanya dalam satu tampilan.',
    position: 'bottom',
  },
  {
    target: '#dashboard-fund-sources',
    title: '💼 Sumber Dana',
    content:
      'Pantau semua sumber dana Anda secara detail, baik tunai maupun rekening bank. Total gabungan juga akan ditampilkan di sini.',
    position: 'top',
  },
  {
    target: '#dashboard-recent-transactions',
    title: '📝 Transaksi Terakhir',
    content:
      'Lihat riwayat transaksi terbaru Anda di sini. Klik "Lihat semua" untuk melihat dan mengelola seluruh transaksi.',
    position: 'top',
  },
  {
    target: '#bottom-navigation',
    title: '🧭 Navigasi Utama',
    content:
      'Gunakan menu navigasi untuk berpindah antar fitur: Transaksi, Hutang, Tabungan, Laporan, dan Setelan. Selamat mengelola keuangan!',
    position: 'top',
    padding: 4,
  },
];

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

        {/* Charts + Savings Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SpendingChart />
          <SavingsWidget />
        </div>

        {/* Fund Sources Overview */}
        <FundSourcesOverview />

        {/* Recent Transactions */}
        <RecentTransactions />
      </div>

      {/* Onboarding Walkthrough */}
      <Walkthrough steps={walkthroughSteps} />
    </div>
  );
}
