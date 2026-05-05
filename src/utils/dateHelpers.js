import { format, formatDistanceToNow, isToday, isYesterday, isThisWeek, isThisMonth, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

/**
 * Format a date string to a readable format
 * @param {string} dateStr - ISO date string
 * @param {string} fmt - date-fns format string
 */
export function formatDate(dateStr, fmt = 'd MMM yyyy') {
  if (!dateStr) return '-';
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  return format(date, fmt, { locale: id });
}

/**
 * Format date with time
 */
export function formatDateTime(dateStr) {
  return formatDate(dateStr, 'd MMM yyyy, HH:mm');
}

/**
 * Get relative date label (Hari ini, Kemarin, etc.)
 */
export function getRelativeDate(dateStr) {
  if (!dateStr) return '-';
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;

  if (isToday(date)) return 'Hari ini';
  if (isYesterday(date)) return 'Kemarin';
  if (isThisWeek(date, { weekStartsOn: 1 })) return format(date, 'EEEE', { locale: id });
  if (isThisMonth(date)) return format(date, 'd MMMM', { locale: id });
  return format(date, 'd MMM yyyy', { locale: id });
}

/**
 * Get time-ago string
 */
export function timeAgo(dateStr) {
  if (!dateStr) return '';
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  return formatDistanceToNow(date, { addSuffix: true, locale: id });
}

/**
 * Get today's date as ISO string (date part only)
 */
export function getTodayISO() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Group transactions by date
 */
export function groupByDate(transactions) {
  const groups = {};
  
  transactions.forEach(t => {
    const dateKey = t.date ? t.date.split('T')[0] : 'unknown';
    if (!groups[dateKey]) {
      groups[dateKey] = {
        date: dateKey,
        label: getRelativeDate(t.date),
        transactions: []
      };
    }
    groups[dateKey].transactions.push(t);
  });

  return Object.values(groups).sort((a, b) => b.date.localeCompare(a.date));
}
