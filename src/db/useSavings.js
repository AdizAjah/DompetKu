import { useLiveQuery } from 'dexie-react-hooks';
import db from './db';
import { differenceInDays, parseISO } from 'date-fns';

/**
 * Hook: Get all savings goals with optional status filter
 */
export function useSavings(statusFilter = null) {
  return useLiveQuery(async () => {
    let goals = await db.savings.orderBy('createdAt').reverse().toArray();
    if (statusFilter) {
      goals = goals.filter(g => g.status === statusFilter);
    }
    return goals;
  }, [statusFilter]);
}

/**
 * Hook: Get total saved amount across all active goals
 */
export function useTotalSaved() {
  return useLiveQuery(async () => {
    const goals = await db.savings.where('status').equals('active').toArray();
    return goals.reduce((sum, g) => sum + (g.savedAmount || 0), 0);
  });
}

/**
 * Hook: Get top active savings goals (for dashboard widget)
 */
export function useActiveSavingsPreview(limit = 3) {
  return useLiveQuery(async () => {
    const goals = await db.savings.where('status').equals('active').toArray();
    // Sort by progress percentage descending (closest to completion first)
    goals.sort((a, b) => {
      const pctA = a.targetAmount > 0 ? a.savedAmount / a.targetAmount : 0;
      const pctB = b.targetAmount > 0 ? b.savedAmount / b.targetAmount : 0;
      return pctB - pctA;
    });
    return goals.slice(0, limit);
  }, [limit]);
}

/**
 * Hook: Get deposit history for a specific savings goal
 */
export function useSavingsDeposits(savingsId) {
  return useLiveQuery(async () => {
    if (!savingsId) return [];
    return await db.savingsDeposits
      .where('savingsId')
      .equals(savingsId)
      .reverse()
      .sortBy('date');
  }, [savingsId]);
}

// ========== Utility Functions ==========

/**
 * Calculate daily saving needed to reach target by date
 */
export function calculateDailySaving(targetAmount, savedAmount, targetDate) {
  if (!targetDate) return null;
  const remaining = targetAmount - savedAmount;
  if (remaining <= 0) return 0;
  const daysLeft = differenceInDays(parseISO(targetDate), new Date());
  if (daysLeft <= 0) return remaining; // overdue, need full amount
  return Math.ceil(remaining / daysLeft);
}

/**
 * Get progress color based on percentage
 */
export function getSavingsProgressColor(percentage) {
  if (percentage >= 100) return '#10b981'; // emerald - completed
  if (percentage >= 75) return '#22c55e';  // green
  if (percentage >= 50) return '#eab308';  // yellow
  if (percentage >= 25) return '#f97316';  // orange
  return '#ef4444';                         // red - just started
}

// ========== CRUD Operations ==========

export async function addSavingsGoal(data) {
  return await db.savings.add({
    name: data.name,
    targetAmount: Number(data.targetAmount),
    savedAmount: 0,
    targetDate: data.targetDate || null,
    status: 'active',
    color: data.color || '#6366f1',
    description: data.description || '',
    createdAt: new Date().toISOString()
  });
}

export async function updateSavingsGoal(id, data) {
  return await db.savings.update(id, data);
}

export async function deleteSavingsGoal(id) {
  await db.transaction('rw', db.savings, db.savingsDeposits, async () => {
    await db.savingsDeposits.where('savingsId').equals(id).delete();
    await db.savings.delete(id);
  });
}

/**
 * Add a deposit to a savings goal — also creates an expense transaction to reduce balance
 */
export async function addSavingsDeposit(savingsId, amount, note = '') {
  return await db.transaction('rw', db.savings, db.savingsDeposits, db.transactions, async () => {
    const now = new Date().toISOString();

    // Record the deposit
    await db.savingsDeposits.add({
      savingsId,
      amount: Number(amount),
      date: now,
      note
    });

    // Update savings goal
    const goal = await db.savings.get(savingsId);
    const newSavedAmount = (goal.savedAmount || 0) + Number(amount);
    const updates = { savedAmount: newSavedAmount };

    // Auto-mark as reached if target met
    if (newSavedAmount >= goal.targetAmount) {
      updates.status = 'reached';
    }

    await db.savings.update(savingsId, updates);

    // Create expense transaction so balance is reduced
    await db.transactions.add({
      type: 'expense',
      amount: Number(amount),
      category: 'Tabungan',
      description: `Menabung untuk "${goal.name}"${note ? ' — ' + note : ''}`,
      date: now,
      createdAt: now
    });
  });
}

/**
 * Withdraw from a savings goal — creates income transaction to restore balance
 */
export async function withdrawSavings(savingsId, amount, note = '') {
  return await db.transaction('rw', db.savings, db.savingsDeposits, db.transactions, async () => {
    const now = new Date().toISOString();

    const goal = await db.savings.get(savingsId);
    const newSavedAmount = Math.max(0, (goal.savedAmount || 0) - Number(amount));

    await db.savings.update(savingsId, {
      savedAmount: newSavedAmount,
      status: 'active' // reactivate if it was reached
    });

    // Record negative deposit
    await db.savingsDeposits.add({
      savingsId,
      amount: -Number(amount),
      date: now,
      note: `Penarikan: ${note || ''}`
    });

    // Create income transaction so balance is restored
    await db.transactions.add({
      type: 'income',
      amount: Number(amount),
      category: 'Lainnya',
      description: `Penarikan tabungan "${goal.name}"${note ? ' — ' + note : ''}`,
      date: now,
      createdAt: now
    });
  });
}
