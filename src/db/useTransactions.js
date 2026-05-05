import { useLiveQuery } from 'dexie-react-hooks';
import db from './db';
import { startOfDay, endOfDay, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';

/**
 * Hook: Get all transactions with optional filters
 */
export function useTransactions(filters = {}) {
  const { type, category, dateFrom, dateTo, limit } = filters;

  return useLiveQuery(async () => {
    let collection = db.transactions.orderBy('date').reverse();

    let results = await collection.toArray();

    if (type) {
      results = results.filter(t => t.type === type);
    }
    if (category) {
      results = results.filter(t => t.category === category);
    }
    if (dateFrom) {
      const from = startOfDay(new Date(dateFrom));
      results = results.filter(t => new Date(t.date) >= from);
    }
    if (dateTo) {
      const to = endOfDay(new Date(dateTo));
      results = results.filter(t => new Date(t.date) <= to);
    }
    if (limit) {
      results = results.slice(0, limit);
    }

    return results;
  }, [type, category, dateFrom, dateTo, limit]);
}

/**
 * Hook: Get today's expenses total
 */
export function useTodayExpenses() {
  return useLiveQuery(async () => {
    const today = new Date();
    const start = startOfDay(today).toISOString();
    const end = endOfDay(today).toISOString();

    const expenses = await db.transactions
      .where('date')
      .between(start, end, true, true)
      .and(t => t.type === 'expense')
      .toArray();

    return expenses.reduce((sum, t) => sum + (t.amount || 0), 0);
  }, [new Date().toDateString()]);
}

/**
 * Hook: Get monthly income & expense totals
 */
export function useMonthlyStats(date = new Date()) {
  const monthKey = `${date.getFullYear()}-${date.getMonth()}`;

  return useLiveQuery(async () => {
    const start = startOfMonth(date).toISOString();
    const end = endOfMonth(date).toISOString();

    const transactions = await db.transactions
      .where('date')
      .between(start, end, true, true)
      .toArray();

    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    return { income, expense, balance: income - expense };
  }, [monthKey]);
}

/**
 * Hook: Get weekly spending data for charts
 */
export function useWeeklySpending() {
  return useLiveQuery(async () => {
    const today = new Date();
    const start = startOfWeek(today, { weekStartsOn: 1 }).toISOString();
    const end = endOfWeek(today, { weekStartsOn: 1 }).toISOString();

    const transactions = await db.transactions
      .where('date')
      .between(start, end, true, true)
      .toArray();

    const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
    const data = days.map((day, index) => {
      const dayDate = new Date(startOfWeek(today, { weekStartsOn: 1 }));
      dayDate.setDate(dayDate.getDate() + index);
      const dayStart = startOfDay(dayDate);
      const dayEnd = endOfDay(dayDate);

      const dayExpense = transactions
        .filter(t => {
          const d = new Date(t.date);
          return t.type === 'expense' && d >= dayStart && d <= dayEnd;
        })
        .reduce((sum, t) => sum + t.amount, 0);

      const dayIncome = transactions
        .filter(t => {
          const d = new Date(t.date);
          return t.type === 'income' && d >= dayStart && d <= dayEnd;
        })
        .reduce((sum, t) => sum + t.amount, 0);

      return { day, expense: dayExpense, income: dayIncome };
    });

    return data;
  }, [new Date().toDateString()]);
}

/**
 * Hook: Get total balance (all-time income - expenses)
 */
export function useTotalBalance() {
  return useLiveQuery(async () => {
    const all = await db.transactions.toArray();
    const income = all.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = all.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return income - expense;
  });
}

/**
 * Hook: Get category-wise expense breakdown for current month
 */
export function useCategoryBreakdown(date = new Date()) {
  const monthKey = `${date.getFullYear()}-${date.getMonth()}`;

  return useLiveQuery(async () => {
    const start = startOfMonth(date).toISOString();
    const end = endOfMonth(date).toISOString();

    const expenses = await db.transactions
      .where('date')
      .between(start, end, true, true)
      .and(t => t.type === 'expense')
      .toArray();

    const categories = await db.categories.where('type').equals('expense').toArray();
    const breakdown = {};

    expenses.forEach(t => {
      if (!breakdown[t.category]) {
        const cat = categories.find(c => c.name === t.category);
        breakdown[t.category] = {
          name: t.category,
          amount: 0,
          color: cat?.color || '#64748b',
          icon: cat?.icon || 'MoreHorizontal'
        };
      }
      breakdown[t.category].amount += t.amount;
    });

    return Object.values(breakdown).sort((a, b) => b.amount - a.amount);
  }, [monthKey]);
}

// ========== CRUD Operations ==========

export async function addTransaction(data) {
  const transaction = {
    ...data,
    amount: Number(data.amount),
    date: data.date || new Date().toISOString(),
    createdAt: new Date().toISOString()
  };
  return await db.transactions.add(transaction);
}

export async function updateTransaction(id, data) {
  return await db.transactions.update(id, {
    ...data,
    amount: Number(data.amount)
  });
}

export async function deleteTransaction(id) {
  return await db.transactions.delete(id);
}
