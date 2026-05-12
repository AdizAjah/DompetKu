import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, Landmark, PiggyBank, Wallet, BarChart3, Settings, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/transactions', icon: ArrowLeftRight, label: 'Transaksi' },
  { path: '/debts', icon: Landmark, label: 'Hutang' },
  { path: '/savings', icon: PiggyBank, label: 'Tabungan' },
  { path: '/fund-sources', icon: Wallet, label: 'Sumber Dana' },
  { path: '/reports', icon: BarChart3, label: 'Laporan' },
  { path: '/settings', icon: Settings, label: 'Pengaturan' },
];

export default function Sidebar() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-[280px] flex-col z-30
      bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl
      border-r border-surface-200 dark:border-surface-700/50">
      
      {/* Logo */}
      <div className="px-6 py-8">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary-500/20">
            <Wallet size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-surface-900 dark:text-white tracking-tight">DompetKu</h1>
            <p className="text-xs text-surface-400 dark:text-surface-500 font-medium">Kelola Keuanganmu</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        <p className="px-3 py-2 text-[11px] font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider">
          Menu
        </p>
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
              ${isActive
                ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-surface-500 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700/50 hover:text-surface-700 dark:hover:text-surface-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-lg ${isActive ? 'bg-primary-500/15' : ''}`}>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span>{label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Theme Toggle */}
      <div className="px-4 py-6 border-t border-surface-200 dark:border-surface-700/50">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium
            text-surface-500 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700/50 transition-all"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
          <span>{isDark ? 'Mode Terang' : 'Mode Gelap'}</span>
        </button>
      </div>
    </aside>
  );
}
