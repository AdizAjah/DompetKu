import { useLiveQuery } from 'dexie-react-hooks';
import db from './db';
import { checkFundBalance } from './fundValidation';

/**
 * Hook: Get all debts with optional status filter
 */
export function useDebts(statusFilter = null) {
  return useLiveQuery(async () => {
    let debts = await db.debts.orderBy('createdAt').reverse().toArray();
    if (statusFilter) {
      debts = debts.filter(d => d.status === statusFilter);
    }
    return debts;
  }, [statusFilter]);
}

/**
 * Hook: Get total active debt amount
 */
export function useTotalDebt() {
  return useLiveQuery(async () => {
    const debts = await db.debts.where('status').equals('active').toArray();
    return debts.reduce((sum, d) => sum + (d.totalAmount - d.paidAmount), 0);
  });
}

/**
 * Hook: Get payment history for a specific debt
 */
export function useDebtPayments(debtId) {
  return useLiveQuery(async () => {
    if (!debtId) return [];
    return await db.debtPayments
      .where('debtId')
      .equals(debtId)
      .reverse()
      .sortBy('date');
  }, [debtId]);
}

// ========== CRUD Operations ==========

export async function addDebt(data) {
  const debt = {
    creditorName: data.creditorName,
    totalAmount: Number(data.totalAmount),
    paidAmount: 0,
    dueDate: data.dueDate || null,
    description: data.description || '',
    status: 'active',
    createdAt: new Date().toISOString()
  };
  return await db.debts.add(debt);
}

export async function updateDebt(id, data) {
  return await db.debts.update(id, data);
}

export async function deleteDebt(id) {
  await db.transaction('rw', db.debts, db.debtPayments, async () => {
    await db.debtPayments.where('debtId').equals(id).delete();
    await db.debts.delete(id);
  });
}

export async function addDebtPayment(debtId, amount, note = '', fundSourceId = null) {
  return await db.transaction('rw', db.debts, db.debtPayments, db.transactions, async () => {
    if (fundSourceId) {
      await checkFundBalance(fundSourceId, Number(amount));
    }
    const now = new Date().toISOString();

    // Add payment record
    await db.debtPayments.add({
      debtId,
      amount: Number(amount),
      date: now,
      note
    });

    // Update debt's paid amount
    const debt = await db.debts.get(debtId);
    const newPaidAmount = (debt.paidAmount || 0) + Number(amount);
    const updates = { paidAmount: newPaidAmount };

    // Auto-mark as paid if fully paid
    if (newPaidAmount >= debt.totalAmount) {
      updates.status = 'paid';
    }

    await db.debts.update(debtId, updates);

    // Create expense transaction so balance is reduced
    await db.transactions.add({
      type: 'expense',
      amount: Number(amount),
      category: 'Bayar Hutang',
      description: `Bayar hutang ke ${debt.creditorName}${note ? ' — ' + note : ''}`,
      fundSourceId,
      date: now,
      createdAt: now
    });
  });
}
