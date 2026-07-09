import { Component } from 'react';
import { AlertOctagon, RefreshCw } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-surface-50 dark:bg-surface-900 transition-colors duration-300">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6">
            <AlertOctagon size={32} className="text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-2 text-center">
            Terjadi Kesalahan
          </h1>
          <p className="text-surface-500 dark:text-surface-400 text-center max-w-md mb-8">
            Maaf, ada sesuatu yang salah. Silakan muat ulang halaman atau kembali ke beranda.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-medium transition-all active:scale-95 shadow-lg shadow-primary-500/25"
          >
            <RefreshCw size={18} />
            Muat Ulang Halaman
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
