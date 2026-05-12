import { useLiveQuery } from 'dexie-react-hooks';
import db from './db';
import { startOfMonth, endOfMonth } from 'date-fns';

/**
 * Hook: Get all fund sources (reactive)
 */
export function useFundSources() {
  return useLiveQuery(async () => {
    return await db.fundSources.orderBy('createdAt').toArray();
  });
}

/**
 * Hook: Get fund source allocation stats for a given month
 * Returns array of { id, name, type, color, income, expense, total } per source
 */
export function useFundSourceStats(date = new Date()) {
  const monthKey = `${date.getFullYear()}-${date.getMonth()}`;

  return useLiveQuery(async () => {
    const start = startOfMonth(date).toISOString();
    const end = endOfMonth(date).toISOString();

    const transactions = await db.transactions
      .where('date')
      .between(start, end, true, true)
      .toArray();

    const sources = await db.fundSources.toArray();

    // Build stats per source
    const statsMap = {};
    sources.forEach(s => {
      statsMap[s.id] = {
        id: s.id,
        name: s.name,
        type: s.type,
        color: s.color,
        bankName: s.bankName,
        income: 0,
        expense: 0,
        total: 0,
        count: 0
      };
    });

    // Add "Tanpa Sumber" bucket for unlinked transactions
    statsMap['none'] = {
      id: null,
      name: 'Tanpa Sumber',
      type: 'other',
      color: '#94a3b8',
      income: 0,
      expense: 0,
      total: 0,
      count: 0
    };

    transactions.forEach(t => {
      const key = t.fundSourceId || 'none';
      if (!statsMap[key]) {
        // Source was deleted but transactions remain
        statsMap[key] = {
          id: t.fundSourceId,
          name: 'Sumber Dihapus',
          type: 'other',
          color: '#64748b',
          income: 0,
          expense: 0,
          total: 0,
          count: 0
        };
      }
      const bucket = statsMap[key];
      bucket.count++;
      if (t.type === 'income') {
        bucket.income += t.amount;
        bucket.total += t.amount;
      } else {
        bucket.expense += t.amount;
        bucket.total -= t.amount;
      }
    });

    // Return only sources that have transactions, sorted by total (descending absolute)
    return Object.values(statsMap)
      .filter(s => s.count > 0)
      .sort((a, b) => (b.income + b.expense) - (a.income + a.expense));
  }, [monthKey]);
}

/**
 * Hook: Get total allocated per fund source (all-time)
 */
export function useFundSourceTotals() {
  return useLiveQuery(async () => {
    const sources = await db.fundSources.toArray();
    const transactions = await db.transactions.toArray();

    return sources.map(s => {
      const linked = transactions.filter(t => t.fundSourceId === s.id);
      const income = linked.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const expense = linked.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
      return {
        ...s,
        income,
        expense,
        balance: income - expense,
        transactionCount: linked.length
      };
    });
  });
}

// ========== CRUD Operations ==========

export async function addFundSource(data) {
  // If setting as default, unset other defaults
  if (data.isDefault) {
    await db.fundSources.where('isDefault').equals(1).modify({ isDefault: false });
  }

  return await db.fundSources.add({
    name: data.name,
    type: data.type || 'cash',
    bankName: data.bankName || '',
    accountNumber: data.accountNumber || '',
    color: data.color || '#10b981',
    isDefault: data.isDefault || false,
    createdAt: new Date().toISOString()
  });
}

export async function updateFundSource(id, data) {
  // If setting as default, unset other defaults
  if (data.isDefault) {
    await db.fundSources.where('isDefault').equals(1).modify({ isDefault: false });
  }
  return await db.fundSources.update(id, data);
}

export async function deleteFundSource(id) {
  // Unlink transactions that reference this source
  await db.transactions.where('fundSourceId').equals(id).modify({ fundSourceId: null });
  return await db.fundSources.delete(id);
}

export async function getDefaultFundSource() {
  const defaults = await db.fundSources.where('isDefault').equals(1).first();
  return defaults || null;
}
