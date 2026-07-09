import { describe, it, expect } from 'vitest';
import { formatCurrency } from './formatCurrency';

describe('formatCurrency', () => {
  it('formats positive numbers correctly', () => {
    expect(formatCurrency(50000)).toBe('Rp50.000');
  });

  it('formats zero correctly', () => {
    expect(formatCurrency(0)).toBe('Rp0');
  });

  it('formats negative numbers correctly', () => {
    expect(formatCurrency(-25000)).toBe('-Rp25.000');
  });
});
