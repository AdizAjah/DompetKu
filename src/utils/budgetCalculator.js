/**
 * Calculate remaining daily budget
 * @param {number} dailyLimit - The daily spending limit
 * @param {number} todayExpenses - Total expenses today
 * @returns {number} Remaining amount
 */
export function calculateDailyRemaining(dailyLimit, todayExpenses) {
  return dailyLimit - todayExpenses;
}

/**
 * Get budget status based on remaining amount
 * @param {number} remaining - Remaining daily budget
 * @param {number} dailyLimit - The daily spending limit
 * @returns {{ status: string, color: string, label: string, percentage: number }}
 */
export function getBudgetStatus(remaining, dailyLimit) {
  if (dailyLimit <= 0) {
    return { status: 'none', color: '#64748b', label: 'Tidak ada batas', percentage: 0 };
  }

  const spent = dailyLimit - remaining;
  const percentage = Math.min((spent / dailyLimit) * 100, 100);

  if (percentage > 100) {
    return {
      status: 'over',
      color: '#ef4444',
      label: 'Batas terlampaui!',
      percentage: 100,
      overAmount: Math.abs(remaining)
    };
  }

  if (percentage >= 90) {
    return {
      status: 'critical',
      color: '#ef4444',
      label: 'Kritis!',
      percentage
    };
  }

  if (percentage >= 70) {
    return {
      status: 'warning',
      color: '#f59e0b',
      label: 'Peringatan',
      percentage
    };
  }

  return {
    status: 'safe',
    color: '#10b981',
    label: 'Aman',
    percentage
  };
}

/**
 * Get alert message for budget status
 */
export function getBudgetAlertMessage(remaining, dailyLimit) {
  const { status, overAmount } = getBudgetStatus(remaining, dailyLimit);

  switch (status) {
    case 'over':
      return `🚫 Batas harian terlampaui! Kelebihan Rp${overAmount?.toLocaleString('id-ID')}`;
    case 'critical':
      return `🔴 Kritis! Sisa kuota hari ini: Rp${remaining.toLocaleString('id-ID')}`;
    case 'warning':
      return `⚠️ Peringatan: Sisa kuota hari ini Rp${remaining.toLocaleString('id-ID')}`;
    default:
      return null;
  }
}
