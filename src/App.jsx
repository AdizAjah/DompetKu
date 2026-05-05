import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Debts from './pages/Debts';
import Savings from './pages/Savings';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import { useTheme } from './hooks/useTheme';

function AppContent() {
  // Initialize theme on app load
  useTheme();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="debts" element={<Debts />} />
          <Route path="savings" element={<Savings />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
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
  );
}

export default function App() {
  return <AppContent />;
}
