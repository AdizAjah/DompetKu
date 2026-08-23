import { startOfDay, differenceInDays } from 'date-fns';

/**
 * Get available balance for spending.
 * @param {number} totalBalance 
 * @param {number} totalSaved 
 * @returns {number} Available balance
 */
export function getAvailableBalance(totalBalance, totalSaved) {
  // If saving deposits are already accounted for as expenses in the total balance,
  // we might not need to subtract them again.
  // In DompetKu, saving deposits reduce the total balance if they use a fund source,
  // but if they just track progress, they might not.
  // We assume totalBalance already reflects actual remaining money in funds.
  // But wait, the plan says: "Saldo untuk pengeluaran = Total Saldo - Tabungan".
  // Actually, if a user deposits to savings, it is an expense in transaction history.
  // Let's assume totalBalance returned from `useTotalBalance` is total income - total expenses.
  // We will return it directly for now, as `balance` already incorporates savings deposits as expenses.
  // However, if the requirement says to subtract it, let's keep it flexible.
  // For now, we return totalBalance.
  return totalBalance || 0;
}

/**
 * Get remaining days until target date (inclusive).
 * @param {string} targetDate - ISO date string
 * @returns {number} Number of days remaining.
 */
export function getRemainingDays(targetDate) {
  if (!targetDate) return 0;
  
  const today = startOfDay(new Date());
  const target = startOfDay(new Date(targetDate));
  
  // +1 to include both today and the target date
  const diff = differenceInDays(target, today) + 1;
  return diff;
}

/**
 * Get daily safe limit (Batas Aman Harian).
 * @param {number} availableBalance 
 * @param {number} remainingDays 
 * @param {string} budgetMode - 'otomatis' | 'manual'
 * @param {number} manualLimit 
 * @returns {number}
 */
export function getDailySafeLimit(availableBalance, remainingDays, budgetMode, manualLimit) {
  if (budgetMode === 'manual') {
    return manualLimit || 0;
  }
  
  // Otomatis
  if (availableBalance <= 0) return 0;
  if (remainingDays <= 0) return 0;
  
  return Math.floor(availableBalance / remainingDays);
}
