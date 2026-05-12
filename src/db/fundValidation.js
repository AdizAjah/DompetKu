import db from './db';

/**
 * Validates if a fund source has enough balance for a transaction.
 * Throws an Error if the balance is insufficient.
 */
export async function checkFundBalance(fundSourceId, amount) {
  if (!fundSourceId) return; // No fund source selected, skip validation

  const transactions = await db.transactions.where('fundSourceId').equals(fundSourceId).toArray();
  const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + (t.amount || 0), 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + (t.amount || 0), 0);
  const balance = income - expense;

  if (balance < amount) {
    throw new Error(`Saldo sumber dana tidak mencukupi (Sisa: Rp${balance.toLocaleString('id-ID')})`);
  }
}
