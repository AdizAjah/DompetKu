import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, Landmark, PiggyBank, Wallet, BarChart3, Settings, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const mainNavItems = [
  { path: '/', icon: LayoutDashboard, label: 'Beranda' },
  { path: '/transactions', icon: ArrowLeftRight, label: 'Transaksi' },
  { path: '/reports', icon: BarChart3, label: 'Laporan' },
];

const moreNavItems = [
  { path: '/debts', icon: Landmark, label: 'Hutang' },
  { path: '/savings', icon: PiggyBank, label: 'Tabungan' },
  { path: '/fund-sources', icon: Wallet, label: 'Dana' },
  { path: '/settings', icon: Settings, label: 'Setelan' },
];

export default function BottomNav() {
  const [showMore, setShowMore] = useState(false);
  const location = useLocation();

  // Close more menu when route changes
  useEffect(() => {
    setShowMore(false);
  }, [location.pathname]);

  const isMoreActive = moreNavItems.some(item => location.pathname.startsWith(item.path));

  return (
    <>
      {/* Overlay for More Menu */}
      {showMore && (
        <div 
          className="lg:hidden fixed inset-0 bg-surface-900/20 backdrop-blur-sm z-30 transition-opacity"
          onClick={() => setShowMore(false)}
        />
      )}

      {/* More Menu Drawer */}
      <div className={`lg:hidden fixed bottom-16 left-0 right-0 z-30 bg-white dark:bg-surface-800 rounded-t-2xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_-8px_30px_rgba(0,0,0,0.5)] border-t border-surface-200 dark:border-surface-700 transition-transform duration-300 ease-in-out ${showMore ? 'translate-y-0' : 'translate-y-[150%]'}`}>
        <div className="p-4 grid grid-cols-4 gap-4">
          {moreNavItems.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setShowMore(false)}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all
                ${isActive ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400' : 'text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-700/50'}`
              }
            >
              <Icon size={24} strokeWidth={1.8} />
              <span className="text-xs font-medium">{label}</span>
            </NavLink>
          ))}
        </div>
      </div>

      <nav id="bottom-navigation" className="lg:hidden fixed bottom-0 left-0 right-0 z-40
        bg-white/90 dark:bg-surface-800/90 backdrop-blur-xl
        border-t border-surface-200 dark:border-surface-700/50 safe-bottom">
        <div className="flex items-center justify-around px-2 py-1 relative">
          {mainNavItems.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              onClick={() => setShowMore(false)}
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
          
          <button
            onClick={() => setShowMore(!showMore)}
            className={`flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all duration-200
              ${isMoreActive || showMore ? 'text-primary-600 dark:text-primary-400' : 'text-surface-400 dark:text-surface-500'}`}
          >
            <div className={`p-1 rounded-lg transition-all ${(isMoreActive || showMore) ? 'bg-primary-500/15 scale-110' : ''}`}>
              {showMore ? <X size={22} strokeWidth={2.5} /> : <Menu size={22} strokeWidth={1.8} />}
            </div>
            <span className={`text-[10px] font-medium ${(isMoreActive || showMore) ? 'font-semibold' : ''}`}>
              Lainnya
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}
