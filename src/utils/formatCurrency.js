/**
 * Format a number as Indonesian Rupiah currency
 * @param {number} amount - The amount to format
 * @param {string} symbol - Currency symbol (default: 'Rp')
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, symbol = 'Rp') {
  if (amount === null || amount === undefined || isNaN(amount)) return `${symbol}0`;
  
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  // Format with Indonesian locale (dots as thousands separator)
  const formatted = absAmount.toLocaleString('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });

  return `${isNegative ? '-' : ''}${symbol}${formatted}`;
}

/**
 * Format a number as compact currency (e.g., Rp50rb, Rp1,2jt)
 */
export function formatCompactCurrency(amount, symbol = 'Rp') {
  if (amount === null || amount === undefined) return `${symbol}0`;
  
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (abs >= 1_000_000_000) {
    return `${sign}${symbol}${(abs / 1_000_000_000).toFixed(1).replace('.0', '')}M`;
  }
  if (abs >= 1_000_000) {
    return `${sign}${symbol}${(abs / 1_000_000).toFixed(1).replace('.0', '')}jt`;
  }
  if (abs >= 1_000) {
    return `${sign}${symbol}${(abs / 1_000).toFixed(1).replace('.0', '')}rb`;
  }
  return `${sign}${symbol}${abs}`;
}

/**
 * Parse a currency string back to number
 */
export function parseCurrency(value) {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  
  // Remove currency symbol, dots, and spaces
  const cleaned = value.toString().replace(/[^0-9,-]/g, '').replace(/\./g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
}
