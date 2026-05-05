import Dexie from 'dexie';

const db = new Dexie('DompetKuDB');

db.version(1).stores({
  transactions: '++id, type, category, date, amount, description, createdAt',
  debts: '++id, creditorName, totalAmount, paidAmount, dueDate, status, createdAt',
  debtPayments: '++id, debtId, amount, date, note',
  settings: 'id',
  categories: '++id, name, icon, color, type'
});

// Seed default data on first open
db.on('populate', () => {
  // Default settings
  db.settings.add({
    id: 1,
    dailyLimit: 50000,
    currencySymbol: 'Rp',
    theme: 'dark',
    createdAt: new Date()
  });

  // Default expense categories
  db.categories.bulkAdd([
    { name: 'Makan', icon: 'UtensilsCrossed', color: '#f59e0b', type: 'expense' },
    { name: 'Transport', icon: 'Car', color: '#3b82f6', type: 'expense' },
    { name: 'Listrik', icon: 'Zap', color: '#8b5cf6', type: 'expense' },
    { name: 'Hiburan', icon: 'Gamepad2', color: '#ec4899', type: 'expense' },
    { name: 'Belanja', icon: 'ShoppingBag', color: '#14b8a6', type: 'expense' },
    { name: 'Kesehatan', icon: 'Heart', color: '#ef4444', type: 'expense' },
    { name: 'Bayar Hutang', icon: 'Landmark', color: '#f59e0b', type: 'expense' },
    { name: 'Lainnya', icon: 'MoreHorizontal', color: '#64748b', type: 'expense' },
    // Default income categories
    { name: 'Gaji', icon: 'Banknote', color: '#10b981', type: 'income' },
    { name: 'Freelance', icon: 'Laptop', color: '#6366f1', type: 'income' },
    { name: 'Hadiah', icon: 'Gift', color: '#f43f5e', type: 'income' },
    { name: 'Lainnya', icon: 'MoreHorizontal', color: '#64748b', type: 'income' },
  ]);
});

export default db;
