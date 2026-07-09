import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppLayout from './components/layout/AppLayout';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorBoundary from './components/common/ErrorBoundary';
import { useTheme } from './hooks/useTheme';

// Lazy Load Pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Transactions = lazy(() => import('./pages/Transactions'));
const Debts = lazy(() => import('./pages/Debts'));
const Savings = lazy(() => import('./pages/Savings'));
const FundSources = lazy(() => import('./pages/FundSources'));
const Reports = lazy(() => import('./pages/Reports'));
const Settings = lazy(() => import('./pages/Settings'));

function AppContent() {
  // Initialize theme on app load
  useTheme();

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="debts" element={<Debts />} />
              <Route path="savings" element={<Savings />} />
              <Route path="fund-sources" element={<FundSources />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </Suspense>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: document.body.classList.contains('dark') ? '#1e293b' : '#ffffff',
              color: document.body.classList.contains('dark') ? '#f1f5f9' : '#0f172a',
              borderRadius: '12px',
              border: document.body.classList.contains('dark') ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
            },
          }}
        />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default function App() {
  return <AppContent />;
}
