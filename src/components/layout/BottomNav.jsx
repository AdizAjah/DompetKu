import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, Landmark, PiggyBank, BarChart3, Settings } from 'lucide-react';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Beranda' },
  { path: '/transactions', icon: ArrowLeftRight, label: 'Transaksi' },
  { path: '/debts', icon: Landmark, label: 'Hutang' },
  { path: '/savings', icon: PiggyBank, label: 'Tabungan' },
  { path: '/reports', icon: BarChart3, label: 'Laporan' },
  { path: '/settings', icon: Settings, label: 'Setelan' },
];

export default function BottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40
      bg-white/90 dark:bg-surface-800/90 backdrop-blur-xl
      border-t border-surface-200 dark:border-surface-700/50 safe-bottom">
      <div className="flex items-center justify-around px-2 py-1">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all duration-200
              ${isActive
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-surface-400 dark:text-surface-500'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1 rounded-lg transition-all ${isActive ? 'bg-primary-500/15 scale-110' : ''}`}>
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                </div>
                <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
